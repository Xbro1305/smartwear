import { Link, useLocation } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

import styles from './Header.module.scss'
import { MdMenu, MdClose } from 'react-icons/md'
import logo from '../../../assets/images/logo.png'

import cart from '../../../assets/images/svg (2).svg'
import search from '../../../assets/images/svg.svg'
import { useEffect, useState } from 'react'
import axios from 'axios'
import profile from '../icons/profile.svg'
import { useSelector } from 'react-redux'

export const Header: React.FC = () => {
  const cartLength = useSelector((state: any) => state.cartCount)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [categories, setCategories] = useState<any>(null)
  const [width, setWidth] = useState(window.innerWidth)

  const location = useLocation()
  const redirectUrl = location.pathname + location.search
  const searchParams = new URLSearchParams(location.search)

  useEffect(() => {
    const main = document.querySelector('main')
    const navigation = document.querySelector('.navigation')!

    const close = () => setIsOpen(false)

    if (isOpen && main) {
      main.addEventListener('click', close)
      navigation?.addEventListener('click', close)
    }

    return () => {
      if (main) main.removeEventListener('click', close)
      if (navigation) navigation?.removeEventListener('click', close)
    }
  }, [isOpen])

  useEffect(() => {
    axios(`${import.meta.env.VITE_APP_API_URL}/categories`).then(res => {
      const data = res?.data?.filter((cat: any) => cat.showInMenu)
      setCategories(data)
    })

    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.main-container')?.scrollTo(0, 0)
    }, 1)
  }, [window.location.pathname])

  useEffect(() => {
    const setVh = () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    window.addEventListener('resize', setVh)
    setVh()

    return () => window.removeEventListener('resize', setVh)
  }, [])

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header_sect}>
          <Link className={styles.header_logo} to="/">
            <div className={styles.header_logo_wrapper}>
              <img alt="Logo" className={styles.header_logo_img} src={logo} />
            </div>
          </Link>

          {categories &&
            categories.map((category: any) => (
              <Link key={category.id} to={`${category.slug}`}>
                {category.name}
              </Link>
            ))}

          <Link to="/about">О нас</Link>
          <Link to="/contacts">Контакты</Link>
          <Link to="/delivery">Доставка</Link>
          <Link to={ROUTER_PATHS.ARTICLES}>Статьи</Link>
        </div>

        <div className={styles.header_sect}>
          <Link to={ROUTER_PATHS.SEARCH}>
            <img alt="Search" src={search} />
          </Link>
          <Link
            to={
              localStorage.getItem('token')
                ? ROUTER_PATHS.PROFILE
                : `${ROUTER_PATHS.SIGN_IN}?redirectUrl=${searchParams.get('redirectUrl') || redirectUrl || ''}`
            }
            state={{ from: location.pathname }}
          >
            <img alt="Profile" src={profile} />
            {localStorage.getItem('token') ? 'Профиль' : 'Войти'}
          </Link>

          <Link to={ROUTER_PATHS.CART} className={styles.header_button}>
            <img alt="Cart" src={cart} />
            {cartLength > 0 && (
              <div className="absolute bottom-[10px] -right-[3px] bg-red text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[12px]">
                {cartLength}
              </div>
            )}
          </Link>
        </div>
        <button className={styles.header_menu} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <MdClose /> : <MdMenu />}
        </button>

        <div
          className={styles.mob_header}
          id="mob_header"
          style={width <= 1214 && isOpen ? {} : { top: '-100%' }}
        >
          <Link onClick={() => setIsOpen(false)} to={ROUTER_PATHS.ARTICLES}>
            Статьи
          </Link>
          <Link onClick={() => setIsOpen(false)} to="/contacts">
            Контакты
          </Link>
          <Link onClick={() => setIsOpen(false)} to="/delivery">
            Доставка
          </Link>
          <Link onClick={() => setIsOpen(false)} to="/about">
            О нас
          </Link>
        </div>
      </header>
    </>
  )
}
