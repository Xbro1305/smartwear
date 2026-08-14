export type ContactStore = {
  id: number
  name: string
  addressLines: string[]
  phone: string
  /** координаты для Leaflet — [lat, lon] */
  coords: [number, number]
  /** показывать в блоке контактов на главной и «О нас» */
  showOnHome: boolean
}

/**
 * Источник истины для блока контактов (главная, «О нас», «Контакты»).
 * Текст взят со страницы «Контакты» (ТЗ 10, п.10–11).
 */
export const CONTACT_STORES: ContactStore[] = [
  {
    id: 2,
    name: '«Умная Одежда» у станции метро «Ладожская»',
    addressLines: ['Заневский проспект, 67к2', 'ТРК «Заневский Каскад-1», 2 этаж, помещение 2-94'],
    phone: '8 921 908–00–39',
    coords: [59.933032, 30.437617],
    showOnHome: true,
  },
  {
    id: 4,
    name: 'AutoJack & LimoLady у станции метро «Ладожская»',
    addressLines: ['Заневский проспект, 67к2', 'ТРК «Заневский Каскад-1», 1-й этаж, помещение 1-89'],
    phone: '8 901 300–58–54',
    coords: [59.933032, 30.437617],
    showOnHome: false,
  },
  {
    id: 3,
    name: 'NorthBloom у станции метро «Проспект Просвещения»',
    addressLines: ['Проспект Энгельса, 154', 'ТРК «Гранд Каньон», 2 этаж, помещение 2-19'],
    phone: '8 931 364–70–37',
    coords: [60.059095, 30.335068],
    showOnHome: true,
  },
]

/** Магазины для блока контактов на главной и «О нас» — 2-94 и 2-19 (ТЗ 10, п.10). */
export const HOME_CONTACT_STORES = CONTACT_STORES.filter(s => s.showOnHome)
