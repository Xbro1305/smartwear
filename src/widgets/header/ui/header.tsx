import styles from "./Header.module.scss";
import logo from "../../images/logo.png";
import search from "../../images/svg.svg";
import profile from "../../images/svg (1).svg";
import cart from "../../images/svg (2).svg";
import { Link } from "react-router-dom";
import { ROUTER_PATHS } from "@/shared/config/routes";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header_sect}>
        <img className={styles.header_logo} src={logo} alt="Logo" />
        <Link to={ROUTER_PATHS.CATALOG}>Каталог</Link> 
        <Link to={ROUTER_PATHS.ABOUT}>О нас</Link> 
        <Link to={ROUTER_PATHS.CONTACTS}>Контакты</Link> 
        <Link to={ROUTER_PATHS.DELIVERY}>Доставка</Link> 
      </div>
      <div className={styles.header_sect}>
        <Link to={ROUTER_PATHS.SEARCH}>
          <img src={search} alt="Search" />
        </Link>
        <Link to={ROUTER_PATHS.PROFILE}>
          <img src={profile} alt="Profile" />
        </Link>
        <Link to={ROUTER_PATHS.CART}>
          <img src={cart} alt="Cart" />
        </Link>
      </div>
      <button className={styles.header_menu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};