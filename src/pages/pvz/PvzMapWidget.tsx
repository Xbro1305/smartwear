import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import { InputLabel } from '@/widgets/InputLabel/InputLabel'
import cdekIconUrl from '@/assets/images/marker.png' //

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

export default function PvzMapWidget({ onSelect, lat, long, isEditing }: PvzMapWidgetProps) {
  const [city, setCity] = useState<string>('')
  const [pvzList, setPvzList] = useState<Pvz[]>([])
  const [selectedPvz, setSelectedPvz] = useState<Pvz | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.35, 83.75])
  const listRef = useRef<HTMLDivElement | null>(null)
  const markerRefs = useRef<Map<string, L.Marker>>(new Map())
  const [deliveryType, setDeliveryType] = useState<'pvz' | 'delivery'>('pvz')

  useEffect(() => {
    if (lat && long) {
      setMapCenter([lat, long])
      reverseGeocode(lat, long)
    } else {
      getLocation()
    }
  }, [])

  async function reverseGeocode(latitude: number, longitude: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`
      )
      const data = await response.json()
      const foundCity =
        data.address.city || data.address.town || data.address.village || 'Город не найден'
      setCity(foundCity)
    } catch (error) {
      console.error('Ошибка получения города:', error)
    }
  }

  async function getLocation() {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером.')
      return
    }

    const permission = await navigator.permissions.query({ name: 'geolocation' })

    if (permission.state === 'granted' || permission.state === 'prompt') {
      navigator.geolocation.getCurrentPosition(showPosition, showError)
    } else {
      alert('Вы отклонили доступ к геолокации. Разрешите его в настройках браузера.')
    }
  }

  async function showPosition(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords
    setMapCenter([latitude, longitude])

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`
      )
      const data = await response.json()
      setCity(data.address.city || data.address.town || data.address.village || 'Город не найден')
    } catch (error) {
      console.error('Ошибка получения города:', error)
    }
  }

  function showError() {
    alert('Не удалось получить местоположение.')
  }

  useEffect(() => {
    if (!isOpen || !city) return

    const delay = setTimeout(() => {
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/cdek/widget?city=${encodeURIComponent(city)}`)
        .then(res => {
          setPvzList(res.data)
          if (res.data.length > 0) {
            setMapCenter([res.data[0].location.latitude, res.data[0].location.longitude])
          }
        })
        .catch(err => console.error('Ошибка загрузки ПВЗ:', err))
    }, 2000)

    return () => clearTimeout(delay)
  }, [isOpen, city])

  useEffect(() => {
    if (selectedPvz && listRef.current) {
      const selectedElement = document.getElementById(`pvz-${selectedPvz.code}`)
      selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Открытие попапа на карте
      const marker = markerRefs.current.get(selectedPvz.code)
      if (marker) {
        marker.openPopup()
      }
    }
  }, [selectedPvz])

  return (
    <>
      {!isEditing ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{ background: 'var(--dark)', marginLeft: '20px' }}
          className="button"
        >
          Изменить адрес
        </button>
      ) : (
        <Button onClick={() => setIsOpen(true)}>+ Добавить адрес доставки</Button>
      )}
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} title={'Выберите пункт выдачи'}>
        <div className="pvzTypeSelector">
          <div
            className={`button ${deliveryType == 'pvz' && 'active'}`}
            onClick={() => setDeliveryType('pvz')}
          >
            Пункт выдачи
          </div>
          <div
            className={`button ${deliveryType == 'delivery' && 'active'}`}
            onClick={() => setDeliveryType('delivery')}
          >
            Курьерская доставка
          </div>
        </div>
        {deliveryType == 'pvz' && (
          <>
            <InputLabel
              name="city"
              title="Город"
              onChange={e => setCity(e.target.value)}
              value={city}
            />

            <div className={'flex gap-4 mt-5'}>
              <div
                ref={listRef}
                className={'w-1/2 max-h-[400px] overflow-auto border p-2 rounded-lg'}
              >
                {pvzList.length === 0 ? (
                  <p>Загрузка...</p>
                ) : (
                  pvzList.map(pvz => (
                    <div
                      id={`pvz-${pvz.code}`}
                      className={`p-2 cursor-pointer rounded-md ${selectedPvz?.code === pvz.code ? 'bg-gray-200' : ''}`}
                      key={pvz.code}
                      onClick={() => {
                        setSelectedPvz(pvz)
                        setMapCenter([pvz.location.latitude, pvz.location.longitude])
                      }}
                    >
                      <p className={'font-semibold'}>{pvz.location.address}</p>
                      <p className={'text-sm text-gray-500'}>{pvz.work_time}</p>
                    </div>
                  ))
                )}
              </div>

              <div className={'w-1/2 h-[400px] rounded-lg overflow-hidden border'}>
                <MapContainer center={mapCenter} className={'w-full h-full'} zoom={12}>
                  <TileLayer url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
                  <RecenterMap center={mapCenter} />
                  {pvzList.map(pvz => {
                    const cdekIcon = new L.Icon({
                      iconUrl: cdekIconUrl,
                      iconSize: [45, 38], // Размер иконки
                      iconAnchor: [15, 30], // Точка привязки
                      popupAnchor: [0, -30], // Смещение попапа
                    })

                    return (
                      <Marker
                        key={`marker-${pvz.code}`}
                        position={[pvz.location.latitude, pvz.location.longitude]}
                        eventHandlers={{ click: () => setSelectedPvz(pvz) }}
                        icon={cdekIcon}
                        ref={marker => {
                          if (marker) markerRefs.current.set(pvz.code, marker)
                        }}
                      >
                        <Popup>
                          <p className={'font-semibold'}>{pvz.location.address}</p>
                          <p className={'text-sm'}>{pvz.work_time}</p>
                          <Button
                            onClick={() => {
                              onSelect({ ...pvz, type: 'pvz' })
                              setIsOpen(false)
                            }}
                          >
                            Выбрать
                          </Button>
                        </Popup>
                      </Marker>
                    )
                  })}
                </MapContainer>
              </div>
            </div>
          </>
        )}

        {deliveryType == 'delivery' && (
          <>
            <AddressInput
              onSelect={data => {
                setIsOpen(false)
                onSelect({
                  code: 'custom',
                  location: {
                    address: data.fullAddress,
                    address_full: data.fullAddress,
                    city: data.city,
                    latitude: data.latitude,
                    longitude: data.longitude,
                  },
                  work_time: '08:00-20:00',
                  type: 'delivery',
                  apartment: data?.apartment,
                  comment: data?.comment,
                  entrance: data?.entrance,
                  floor: data?.floor,
                  intercom: data?.intercom,
                })
              }}
            />
          </>
        )}
      </Dialog>
    </>
  )
}

interface deliveryData {
  fullAddress: string
  longitude: number
  latitude: number
  city: string
  apartment?: string
  intercom?: string
  entrance?: string
  floor?: string
  comment?: string
}

function AddressInput({ onSelect }: { onSelect: (data: deliveryData) => void }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [address, setAddress] = useState<deliveryData>({
    fullAddress: '',
    longitude: 1,
    latitude: 1,
    city: '',
  })
  const [apartment, setApartment] = useState<string>('')
  const [entrance, setEntrance] = useState<string>('')
  const [floor, setFloor] = useState<string>('')
  const [intercom, setIntercom] = useState<string>('')
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    if (query.length < 3) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&accept-language=ru`
        )
        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        console.error('Ошибка поиска адреса:', error)
      }
    }, 500)
  }, [query])

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSelect({ ...address, apartment, comment, floor, entrance, intercom })
      }}
      className="relative flex-wrap flex gap-[10px]"
    >
      <InputLabel
        className="w-full"
        onChange={e => setQuery(e.target.value)}
        value={query}
        name="address"
        title="Адрес"
        required={true}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded w-full shadow-md z-10 top-[70px]">
          {suggestions.map(suggestion => (
            <li
              key={suggestion.place_id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={async () => {
                setQuery(suggestion.display_name)
                setSuggestions([])
                const fetchAddress = async (latitude: number, longitude: number) => {
                  try {
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`
                    )
                    const data = await response.json()

                    return {
                      city: data.address.city || '',
                    }
                  } catch (error) {
                    console.error('Ошибка получения адреса:', error)
                  }
                }
                setAddress({
                  fullAddress: suggestion.display_name,
                  longitude: suggestion.lon,
                  latitude: suggestion.lat,
                  city: (await fetchAddress(suggestion.lat, suggestion.lon))?.city || '',
                })
              }}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
      <InputLabel
        className="w-[calc(50%-5px)]"
        value={apartment}
        onChange={e => setApartment(e.target.value)}
        title="Квартира"
        name="apartment"
      />
      <InputLabel
        className="w-[calc(50%-5px)]"
        value={entrance}
        onChange={e => setEntrance(e.target.value)}
        title="Подъезд"
        name="entrance"
      />
      <InputLabel
        className="w-[calc(50%-5px)]"
        value={floor}
        onChange={e => setFloor(e.target.value)}
        title="Этаж"
        name="floor"
      />
      <InputLabel
        className="w-[calc(50%-5px)]"
        value={intercom}
        onChange={e => setIntercom(e.target.value)}
        title="Домофон"
        name="intercom"
      />
      <InputLabel
        className="w-full"
        value={comment}
        onChange={e => setComment(e.target.value)}
        title="Комментарий курьеру"
        name="comment"
      />
      <button
        type="submit"
        className={'mt-4 w-full px-4 py-2 text-white rounded-[8px]'}
        style={{ background: 'var(--red)' }}
      >
        Готово{' '}
      </button>
    </form>
  )
}

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
}

function Button({ children, onClick }: ButtonProps) {
  return (
    <button className={'p-2 bg-blue-500 text-white rounded-[8px]'} onClick={onClick}>
      {children}
    </button>
  )
}

interface DialogProps {
  children: React.ReactNode
  onClose: () => void
  open: boolean
  title: string
}

function Dialog({ children, onClose, open, title }: DialogProps) {
  if (!open) return null

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'}>
      <div className={'bg-white rounded-lg p-4 max-w-lg w-full'}>
        <h2 className={'text-lg font-semibold'}>{title}</h2>
        <div className={'mt-4'}>{children}</div>
        <button
          className={'mt-4 w-full px-4 py-2 text-white rounded-[8px]'}
          style={{ background: 'var(--red)' }}
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}

// Типизация интерфейсов
// interface Phone {
//   number: string
// }

// interface WorkTime {
//   day: number
//   time: string
// }

// interface WorkTimeException {
//   date_end: string
//   date_start: string
//   is_working: boolean
//   time_end: string
//   time_start: string
// }

// interface WorkTimeExceptionAlt {
//   date: string
//   is_working: boolean
//   time: string
// }

// interface Dimension {
//   depth: number
//   height: number
//   width: number
// }

interface Location {
  address: string
  address_full: string
  city: string
  // city_code: number
  // city_uuid: string
  // country_code: string
  // fias_guid: string
  latitude: number
  longitude: number
  // postal_code: string
  // region: string
  // region_code: number
}

export interface Pvz {
  // address_comment: string
  // allowed_cod: boolean
  code: string
  // dimensions: Dimension[]
  // fulfillment: boolean
  // have_cash: boolean
  // have_cashless: boolean
  // have_fast_payment_system: boolean
  // is_dressing_room: boolean
  // is_handout: boolean
  // is_ltl: boolean
  // is_reception: boolean
  location: Location
  type: 'pvz' | 'delivery'
  // name: string
  // nearest_station: string
  // note: string
  // owner_code: string
  // phones: Phone[]
  // take_only: boolean
  // type: string
  // uuid: string
  // weight_max: number
  // weight_min: number
  work_time: string
  apartment?: string
  floor?: string
  entrance?: string
  intercom?: string
  comment?: string
  // work_time_exception_list: WorkTimeException[]
  // work_time_exceptions?: WorkTimeExceptionAlt[]
  // work_time_list: WorkTime[]
}

interface PvzMapWidgetProps {
  onSelect: (pvz: Pvz) => void
  lat?: number
  long?: number
  isEditing?: boolean
}
