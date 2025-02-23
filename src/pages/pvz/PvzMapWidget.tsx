import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

import axios from 'axios'

import 'leaflet/dist/leaflet.css'

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

export default function PvzMapWidget({ onSelect }: PvzMapWidgetProps) {
  const [city, setCity] = useState<string>('')
  const [pvzList, setPvzList] = useState<Pvz[]>([])
  const [selectedPvz, setSelectedPvz] = useState<Pvz | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  // Изначально центр по Барнаулу
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.35, 83.75])

  useEffect(() => {
    if (!isOpen || !city) {
      return
    }
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/cdek/widget?city=${encodeURIComponent(city)}`)
      .then(res => {
        setPvzList(res.data)
        // Если массив не пустой, устанавливаем центр по широте и долготе первого элемента
        if (res.data.length > 0) {
          setMapCenter([res.data[0].location.latitude, res.data[0].location.longitude])
        }
      })
      .catch(err => console.error('Ошибка загрузки ПВЗ:', err))
  }, [isOpen, city])

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Добавить адрес доставки</Button>

      <Dialog onClose={() => setIsOpen(false)} open={isOpen} title={'Выберите пункт выдачи'}>
        <input
          className={'w-full px-3 py-2 border rounded mb-4'}
          onChange={e => setCity(e.target.value)}
          placeholder={'Введите город'}
          type={'text'}
          value={city}
        />

        <div className={'flex gap-4'}>
          <div className={'w-1/2 max-h-[400px] overflow-auto border p-2 rounded-lg'}>
            {pvzList.length === 0 ? (
              <p>Загрузка...</p>
            ) : (
              pvzList.map(pvz => (
                <div
                  className={`p-2 cursor-pointer rounded-md ${
                    selectedPvz?.code === pvz.code ? 'bg-gray-200' : ''
                  }`}
                  key={pvz.code}
                  onClick={() => setSelectedPvz(pvz)}
                >
                  <p className={'font-semibold'}>{pvz.location.address}</p>
                  <p className={'text-sm text-gray-500'}>{pvz.work_time}</p>
                </div>
              ))
            )}
          </div>

          <div className={'w-1/2 h-[400px] rounded-lg overflow-hidden border'}>
            <MapContainer center={mapCenter} className={'w-full h-full'} zoom={12}>
              {/* Компонент, который меняет центр карты */}
              <RecenterMap center={mapCenter} />
              <TileLayer url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
              {pvzList.map(pvz => (
                <Marker
                  eventHandlers={{ click: () => setSelectedPvz(pvz) }}
                  key={pvz.code}
                  position={[pvz.location.latitude, pvz.location.longitude]}
                >
                  <Popup>
                    <p className={'font-semibold'}>{pvz.location.address}</p>
                    <p className={'text-sm'}>{pvz.work_time}</p>
                    <Button
                      onClick={() => {
                        onSelect(pvz)
                        setIsOpen(false)
                      }}
                    >
                      Выбрать
                    </Button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </Dialog>
    </>
  )
}

// Типизация пропсов для компонента Button
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
}

function Button({ children, onClick }: ButtonProps) {
  return (
    <button className={'p addAddressButton'} onClick={onClick}>
      {children}
    </button>
  )
}

// Типизация пропсов для компонента Dialog
interface DialogProps {
  children: React.ReactNode
  onClose: () => void
  open: boolean
  title: string
}

function Dialog({ children, onClose, open, title }: DialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'}>
      <div className={'bg-white rounded-lg p-4 max-w-lg w-full'}>
        <h2 className={'text-lg font-semibold'}>{title}</h2>
        <div className={'mt-4'}>{children}</div>
        <button
          className={
            'mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'
          }
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}

interface Phone {
  number: string
}

interface WorkTime {
  day: number
  time: string
}

interface WorkTimeException {
  date_end: string
  date_start: string
  is_working: boolean
  time_end: string
  time_start: string
}

interface WorkTimeExceptionAlt {
  date: string
  is_working: boolean
  time: string
}

interface Dimension {
  depth: number
  height: number
  width: number
}

interface Location {
  address: string
  address_full: string
  city: string
  city_code: number
  city_uuid: string
  country_code: string
  fias_guid: string
  latitude: number
  longitude: number
  postal_code: string
  region: string
  region_code: number
}

export interface Pvz {
  address_comment: string
  allowed_cod: boolean
  code: string
  dimensions: Dimension[]
  fulfillment: boolean
  have_cash: boolean
  have_cashless: boolean
  have_fast_payment_system: boolean
  is_dressing_room: boolean
  is_handout: boolean
  is_ltl: boolean
  is_reception: boolean
  location: Location
  name: string
  nearest_station: string
  note: string
  owner_code: string
  phones: Phone[]
  take_only: boolean
  type: string
  uuid: string
  weight_max: number
  weight_min: number
  work_time: string
  work_time_exception_list: WorkTimeException[]
  work_time_exceptions?: WorkTimeExceptionAlt[]
  work_time_list: WorkTime[]
}

// Типизация пропсов для компонента PvzMapWidget
interface PvzMapWidgetProps {
  onSelect: (pvz: Pvz) => void
}
