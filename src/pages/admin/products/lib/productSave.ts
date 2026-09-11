import axios from 'axios'

const API = import.meta.env.VITE_APP_API_URL

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const getErrorMessage = (err: any, fallback: string) =>
  err?.response?.data?.message || err?.message || fallback

/** В таблице всегда три поля кода (КТ1–КТ3); бэкенд может вернуть меньше. */
export const padCodes = (codes?: { code?: null | string }[] | null) => {
  const result = (codes || []).map(code => ({ code: code?.code || '' }))

  while (result.length < 3) {
    result.push({ code: '' })
  }

  return result
}

interface StockLike {
  stores: { name: string; shortName?: string; storeId: number }[]
}

/** Уникальные склады из ответа остатков — по ним строятся колонки таблицы. */
export const getWarehouses = (stocks: StockLike[]) =>
  Array.from(
    new Map(
      stocks.flatMap(stockItem =>
        (stockItem.stores || []).map(store => [
          store.storeId,
          { name: store.name, shortName: store.shortName, storeId: store.storeId },
        ])
      )
    ).values()
  )

interface VariantRow {
  codes: { code: string }[]
  colorAlias: string
  colorAttrValueId: number
  id?: number
  sizeValueId: number
}

/**
 * Проверяем строки таблицы остатков ДО сохранения: раньше товар создавался,
 * а потом синхронизация падала на неполной строке и фото уже не отправлялись.
 */
export const getVariantRowError = (variants: VariantRow[] | undefined, onlyNew = false) => {
  const index = (variants || []).findIndex(
    variant =>
      (!onlyNew || variant.id == null) &&
      variant.codes.some(code => code.code?.trim()) &&
      (!variant.colorAttrValueId || !variant.sizeValueId || !variant.colorAlias?.trim())
  )

  return index >= 0 ? `Строка ${index + 1} в таблице остатков: выберите размер и цвет` : null
}

interface FreeValueAttribute {
  id: number
  values: { id: number; value: string }[]
}

/**
 * Превращает введённый текст произвольных атрибутов в id значений:
 * совпадение с уже заданным значением берём как есть, иначе создаём новое.
 */
export const resolveFreeValueIds = async (
  freeValues: Record<number, string> | undefined,
  attributes: FreeValueAttribute[]
) => {
  const ids: number[] = []

  for (const [attributeId, rawText] of Object.entries(freeValues || {})) {
    const text = rawText.trim()

    if (!text) {
      continue
    }

    const attribute = attributes.find(attr => attr.id === Number(attributeId))
    const existing = attribute?.values.find(
      value => value.value.trim().toLowerCase() === text.toLowerCase()
    )

    if (existing) {
      ids.push(existing.id)
      continue
    }

    const res = await axios.post(
      `${API}/attributes/${attributeId}/values/`,
      { attributeId: Number(attributeId), value: text },
      { headers: authHeaders() }
    )

    ids.push(Number(res.data.id))
  }

  return ids
}

interface VariantForSync {
  clientId?: string
  codes: { code: string }[]
  colorAlias: string
  colorAttrValueId: number
  id?: number
  sizeValueId: number
}

export const extractResponseVariants = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data
  }

  return (
    [
      data?.variants,
      data?.data?.variants,
      data?.createdVariants,
      data?.data?.createdVariants,
      data?.result?.variants,
      data?.data,
    ].find(Array.isArray) || (data?.variantId || data?.id ? [data] : [])
  )
}

const getVariantId = (variant: any) => {
  const variantId = Number(variant?.variantId ?? variant?.id ?? variant?.variant?.id)

  return Number.isFinite(variantId) && variantId > 0 ? variantId : undefined
}

const getResponseCodes = (variant: any): string[] =>
  (variant?.codes || [])
    .map((code: any) => String(typeof code === 'string' ? code : (code?.code ?? '')).trim())
    .filter(Boolean)

const getRowCodes = (variant: VariantForSync) => variant.codes.map(code => code.code)

const findVariantByCodes = (responseVariants: any[], variant: VariantForSync) => {
  const rowCodes = getRowCodes(variant)

  return responseVariants.find(candidate =>
    getResponseCodes(candidate).some(code => rowCodes.includes(code))
  )
}

/**
 * Сопоставляет новые строки таблицы с вариантами из ответа sync-product-codes.
 * Ответ — `{ variants: [{ variantId, codes: [{ code, ... }] }], stocks }`: цвета,
 * размера и alias в нём нет, поэтому строку узнаём по её кодам. Один вариант
 * ответа достаётся только одной строке — иначе строки получали один id и
 * склеивались при следующем сохранении.
 */
export const matchCreatedVariantIds = (variantsForSync: VariantForSync[], responseData: any) => {
  const responseVariants = extractResponseVariants(responseData)
  const knownIds = new Set(variantsForSync.map(v => v.id).filter(Boolean))
  const used = new Set<number>()
  const newVariants = variantsForSync.filter(v => v.id == null)
  const result: { clientId: string; variantId: number }[] = []

  const take = (variant: VariantForSync, candidate: any) => {
    const variantId = getVariantId(candidate)

    if (!variant.clientId || !variantId || used.has(variantId) || knownIds.has(variantId)) {
      return false
    }
    used.add(variantId)
    result.push({ clientId: variant.clientId, variantId })

    return true
  }

  const unmatched = newVariants.filter(variant => {
    // 1. По кодам строки
    const byCodes = findVariantByCodes(responseVariants, variant)

    if (byCodes) {
      take(variant, byCodes)

      // вариант с этими кодами уже отдан другой строке — значит, бэкенд их склеил
      return false
    }

    // 2. По цвету, размеру и alias — если бэкенд когда-нибудь начнёт их отдавать
    const exact = responseVariants.find(
      candidate =>
        Number(candidate?.colorAttrValueId) === Number(variant.colorAttrValueId) &&
        Number(candidate?.sizeValueId) === Number(variant.sizeValueId) &&
        candidate?.colorAlias === variant.colorAlias
    )

    return !(exact && take(variant, exact))
  })

  // 3. Позиционно — только для вариантов ответа без кодов и при совпадении количества
  const positionIn = (list: VariantForSync[]) =>
    responseVariants.length === list.length
      ? (variant: VariantForSync) => list.indexOf(variant)
      : null
  const getPosition = positionIn(variantsForSync) || positionIn(newVariants)

  unmatched.forEach(variant => {
    const candidate = getPosition ? responseVariants[getPosition(variant)] : undefined

    if (candidate && getResponseCodes(candidate).length === 0) {
      take(variant, candidate)
    }
  })

  return result
}

/**
 * Сверяет таблицу с тем, что сохранил бэкенд: две строки попали в один вариант
 * (так «Оливковый 58» уезжал в «Зелёный 58», файл 07.09) или у строки сохранились
 * не все коды (Правки 5, п.19). Пустой массив — всё сохранилось как в таблице.
 */
export const getSyncWarnings = (
  variantsForSync: VariantForSync[],
  responseData: any,
  rowNumber: (variant: VariantForSync) => number
) => {
  const responseVariants = extractResponseVariants(responseData)
  const warnings: string[] = []
  const rowsByVariantId = new Map<number, number[]>()

  variantsForSync.forEach(variant => {
    const owner = findVariantByCodes(responseVariants, variant)

    // бэкенд не вернул эту строку — сверять не с чем
    if (!owner) {
      return
    }

    const savedCodes = getResponseCodes(owner)
    const lostCodes = getRowCodes(variant).filter(code => !savedCodes.includes(code))

    if (lostCodes.length) {
      warnings.push(`строка ${rowNumber(variant)}: не сохранены коды ${lostCodes.join(', ')}`)
    }

    const ownerId = getVariantId(owner)

    if (ownerId) {
      rowsByVariantId.set(ownerId, [...(rowsByVariantId.get(ownerId) || []), rowNumber(variant)])
    }
  })

  rowsByVariantId.forEach(rows => {
    if (rows.length > 1) {
      warnings.push(`строки ${rows.join(' и ')} сервер объединил в один вариант`)
    }
  })

  return warnings
}

/** Остатки по складам приходят прямо в ответе sync-product-codes. */
export const extractResponseStocks = <T>(responseData: any): T[] | undefined =>
  Array.isArray(responseData?.stocks) ? responseData.stocks : undefined
