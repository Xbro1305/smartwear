/** Сколько файлов загружаем одновременно. */
export const MEDIA_UPLOAD_CONCURRENCY = 3

/** Длинная сторона фото после сжатия. */
const MAX_IMAGE_SIDE = 2000
const IMAGE_QUALITY = 0.85
/** Меньше этого размера фото не трогаем — выигрыш не стоит перекодирования. */
const SKIP_BELOW_BYTES = 400 * 1024

/** Форматы, которые умеем пережать без потери прозрачности и анимации. */
const COMPRESSIBLE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Уменьшает фото до MAX_IMAGE_SIDE по длинной стороне и перекодирует в тот же формат.
 * Если сжать не получилось или файл не стал меньше — возвращает исходный.
 */
export const compressImage = async (file: File): Promise<File> => {
  if (!COMPRESSIBLE_TYPES.includes(file.type) || file.size < SKIP_BELOW_BYTES) {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')

    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, file.type, IMAGE_QUALITY)
    )

    if (!blob || blob.size >= file.size) {
      return file
    }

    return new File([blob], file.name, { lastModified: file.lastModified, type: file.type })
  } catch (err) {
    console.error('Image compression failed, uploading original:', file.name, err)

    return file
  }
}

/**
 * Выполняет задачи очередью, не больше `concurrency` одновременно.
 * Ошибка одной задачи не останавливает остальные. Возвращает число неудачных.
 */
export const runQueue = async <T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  onProgress?: (done: number, total: number) => void,
  concurrency = MEDIA_UPLOAD_CONCURRENCY
) => {
  let next = 0
  let done = 0
  let failed = 0

  onProgress?.(0, items.length)

  const runner = async () => {
    while (next < items.length) {
      const item = items[next++]

      try {
        await worker(item)
      } catch (err) {
        failed++
        console.error('Queue task failed:', item, err)
      }
      onProgress?.(++done, items.length)
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runner))

  return failed
}

export interface MediaProgress {
  done: number
  total: number
}
