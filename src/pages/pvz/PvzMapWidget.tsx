import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import * as L from 'leaflet'
import { motion } from 'framer-motion'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import { InputLabel } from '@/widgets/InputLabel/InputLabel'
import cdekIconUrl from '@/assets/images/marker.png' //
import { IoArrowBack } from 'react-icons/io5'

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

export default function PvzMapWidget({
  onSelect,
  lat,
  long,
  isEditing,
  apartment,
  comment,
  deliveryAddr: defalultDeliveryAddress,
  entrance,
  floor,
  intercom,
  type,
}: PvzMapWidgetProps) {
  const [city, setCity] = useState<string>('')
  const [pvzList, setPvzList] = useState<Pvz[]>([])
  const [selectedPvz, setSelectedPvz] = useState<Pvz | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.35, 83.75])
  const listRef = useRef<HTMLDivElement | null>(null)
  const markerRefs = useRef<Map<string, L.Marker>>(new Map())
  const [deliveryType, setDeliveryType] = useState<'PVZ' | 'DELIVERY'>('PVZ')
  const [deliveryCoords, setDeliveryCoords] = useState<[number, number]>([53.35, 83.75])
  const [deliveryAddr, setDeliveryAddr] = useState<string>('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dragY, setDragY] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)


  const isTinyScreen = window.innerWidth < 1000

  useEffect(() => {
    defalultDeliveryAddress && setDeliveryAddr(defalultDeliveryAddress)
  }, [defalultDeliveryAddress])

  useEffect(() => type && setDeliveryType(type), [type])

  useEffect(() => {
    if (lat && long) {
      setMapCenter([lat, long])
      type == 'DELIVERY' && setDeliveryCoords([lat, long])
    }

    isEditing == false && getLocation()
  }, [])

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
    if (!isOpen) return

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
    }, 500)

    return () => clearTimeout(delay)
  }, [isOpen, city])

  useEffect(() => {
    if (selectedPvz && listRef.current) {
      const selectedElement = document.getElementById(`pvz-${selectedPvz.code}`)
      selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })

      const marker = markerRefs.current.get(selectedPvz.code)
      if (marker) {
        marker.openPopup()
      }
    }
  }, [selectedPvz])

  const cdekIcon = new L.Icon({
    iconUrl: cdekIconUrl,
    iconSize: deliveryType == 'PVZ' ? [45, 38] : [60, 50],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  })

  function LiveMapCenterLogger({
    onCenterChange,
  }: {
    onCenterChange: (center: [number, number]) => void
  }) {
    useMapEvent('moveend', async event => {
      const map = event.target
      const center = map.getCenter()
      const fetchAddress = async (latitude: number, longitude: number) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`
          )
          const data = await response.json()

          return {
            city: data.address.city || '',
            fullAddress: data.display_name,
            lat: data.lat,
            lon: data.lon,
          }
        } catch (error) {
          console.error('Ошибка получения адреса:', error)
        }
      }

      const address = await fetchAddress(center.lat, center.lng)

      setDeliveryAddr(address?.fullAddress)
      setDeliveryCoords([Number(address?.lat), Number(address?.lon)])
    })

    useMapEvent('move', event => {
      const map = event.target
      const center = map.getCenter()
      onCenterChange([center.lat, center.lng])
    })

    return null
  }

  return (
    <>
      {isEditing ? (
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
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} title={''}>
        <>
          <motion.div
            ref={menuRef}
            initial={{ y: '100%' }}
            animate={{ y: isMenuOpen ? 0 : isTinyScreen ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={
              isTinyScreen
                ? { top: 0, bottom: deliveryType == 'PVZ' ? 320 : 460 }
                : { top: 0, bottom: 0 }
            }
            dragElastic={0.2}
            style={{ touchAction: 'none' }}
            onDrag={(_: any, info: any) => setDragY(info.point.y)}
            onDragEnd={() => {
              if (dragY > 50) {
                setIsMenuOpen(false)
              }
            }}
            className={'flex inputs-label flex-col gap-4 mt-5 p-[30px] min-w-[400px] w-[40%]'}
          >
            <h2 className="h2">Способ доставки</h2>
            <div className="pvzTypeSelector">
              <div
                className={`button ${deliveryType == 'PVZ' && 'active'}`}
                onClick={() => setDeliveryType('PVZ')}
              >
                Самовывоз
              </div>
              <div
                className={`button ${deliveryType == 'DELIVERY' && 'active'}`}
                onClick={() => setDeliveryType('DELIVERY')}
              >
                Курьером
              </div>
            </div>
            {deliveryType == 'PVZ' && (
              <>
                <h4 className="h4">Куда доставить заказ?</h4>
                <span className="p2 mt-[-10px]" style={{ color: 'var(--service)' }}>
                  Укажите адрес доставки
                </span>
                <InputLabel
                  name="city"
                  title="Город"
                  onChange={e => setCity(e.target.value)}
                  value={city}
                />
                <div
                  ref={listRef}
                  className={'w-full max-h-[400px] overflow-auto border p-2 rounded-lg'}
                >
                  {pvzList.length === 0 ? (
                    <p>{city ? 'Загрузка...' : 'Введите город для поиска ПВЗ'}</p>
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
              </>
            )}
            {deliveryType == 'DELIVERY' && (
              <>
                <AddressInput
                  addr={deliveryAddr}
                  coords={deliveryCoords}
                  changeAddr={setDeliveryAddr}
                  setMapCenter={setMapCenter}
                  deliveryApartment={apartment}
                  deliveryComment={comment}
                  deliveryEntrance={entrance}
                  deliveryFloor={floor}
                  deliveryIntercom={intercom}
                  onSelect={data => {
                    setIsOpen(false)
                    onSelect({
                      code: 'custom',
                      location: {
                        address: data.fullAddress,
                        address_full: data.fullAddress,
                        city: data.city,
                        latitude: data?.latitude,
                        longitude: data?.longitude,
                      },
                      work_time: '08:00-20:00',
                      type: 'DELIVERY',
                      apartment: data?.deliveryApartment,
                      comment: data?.deliveryComment,
                      entrance: data?.deliveryEntrance,
                      floor: data?.deliveryFloor,
                      intercom: data?.deliveryIntercom,
                    })
                  }}
                />
              </>
            )}
          </motion.div>
          <div
            className={
              'w-full max-w[calc(100%-550px)] h-[calc(100vh-105px)] overflow-hidden border'
            }
          >
            {deliveryType == 'PVZ' && (
              <MapContainer center={mapCenter} className={'w-full h-[calc(100vh-105px)]'} zoom={12}>
                <TileLayer url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
                <RecenterMap center={mapCenter} />
                {pvzList.map(pvz => (
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
                          onSelect({ ...pvz, type: 'PVZ' })
                          setIsOpen(false)
                        }}
                      >
                        Выбрать
                      </Button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
            {deliveryType == 'DELIVERY' && (
              <MapContainer center={mapCenter} className={'w-full h-[calc(100vh-105px)]'} zoom={12}>
                <TileLayer url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
                <RecenterMap center={mapCenter} />
                <LiveMapCenterLogger onCenterChange={setMapCenter} />
                <Marker position={[mapCenter[0], mapCenter[1]]} icon={cdekIcon} />
              </MapContainer>
            )}
          </div>
        </>
      </Dialog>
    </>
  )
}

interface deliveryData {
  fullAddress: string
  longitude: number
  latitude: number
  city: string
  deliveryApartment?: string
  deliveryIntercom?: string
  deliveryEntrance?: string
  deliveryFloor?: string
  deliveryComment?: string
}

function AddressInput({
  onSelect,
  addr,
  changeAddr,
  setMapCenter,
  coords,
  deliveryApartment,
  deliveryIntercom,
  deliveryEntrance,
  deliveryFloor,
  deliveryComment,
}: DeliveryProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [address, setAddress] = useState<any>({
    fullAddress: addr,
    city: '',
  })
  const [latitude, setLatitude] = useState(55.625578)
  const [longitude, setLongitude] = useState(37.6063916)
  const [apartment, setApartment] = useState<string>('')
  const [entrance, setEntrance] = useState<string>('')
  const [floor, setFloor] = useState<string>('')
  const [intercom, setIntercom] = useState<string>('')
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    setQuery(addr)
    setLatitude(coords[0])
    setLongitude(coords[1])
    deliveryApartment && setApartment(deliveryApartment)
    deliveryEntrance && setEntrance(deliveryEntrance)
    deliveryIntercom && setIntercom(deliveryIntercom)
    deliveryFloor && setFloor(deliveryFloor)
    deliveryComment && setComment(deliveryComment)
  }, [addr, coords])

  useEffect(() => {
    if (query.length < 3) return
    if (query == addr) return

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
        onSelect({
          ...address,
          latitude,
          longitude,
          deliveryApartment: apartment,
          deliveryComment: comment,
          deliveryFloor: floor,
          deliveryEntrance: entrance,
          deliveryIntercom: intercom,
        })
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
        <ul className="absolute max-h-[400px] overflow-auto bg-white border rounded w-full shadow-md z-10 top-[70px]">
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
                setMapCenter([suggestion.lat, suggestion.lon])
                changeAddr(suggestion.display_name)
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
    <div
      className={
        'fixed inset-0 flex flex-row items-center justify-center bg-black bg-opacity-50 z-50'
      }
    >
      <div className={'bg-white w-full h-full'}>
        <h2 className={'text-lg p-[30px]'}>
          {' '}
          <button
            className={'flex flex-row items-center gap-[10px] text-white'}
            style={{ color: 'var(--red)' }}
            onClick={onClose}
          >
            <IoArrowBack /> Назад
          </button>
          {title}
        </h2>
        <div className={'mt-4 flex gap-[20px] h-[calc(100vh-105px)]'}>{children}</div>
      </div>
    </div>
  )
}

interface Location {
  address: string
  address_full: string
  city: string

  latitude: number
  longitude: number
}

export interface Pvz {
  code: string

  location: Location
  type: 'PVZ' | 'DELIVERY'

  work_time: string
  apartment?: string
  floor?: string
  entrance?: string
  intercom?: string
  comment?: string
}

interface PvzMapWidgetProps {
  onSelect: (pvz: Pvz) => void
  lat?: number
  long?: number
  isEditing?: boolean
  type?: 'PVZ' | 'DELIVERY'
  deliveryAddr?: string
  deliveryCoords?: [number, number]
  intercom?: string
  entrance?: string
  apartment?: string
  comment?: string
  floor?: string
}

interface DeliveryProps {
  onSelect: (data: deliveryData) => void
  addr: string
  changeAddr: (addr: string) => void
  setMapCenter: (center: [number, number]) => void
  coords: [number, number]
  deliveryApartment?: string
  deliveryIntercom?: string
  deliveryEntrance?: string
  deliveryFloor?: string
  deliveryComment?: string
}
