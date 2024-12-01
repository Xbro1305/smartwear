import React, { useState } from "react";
import styles from "./Signup.module.scss";
import { PatternFormat } from "react-number-format";
import { Link } from "react-router-dom";

export const Signup = () => {
  const [cb, setCb] = useState(false);
  return (
    <div className={styles.signup}>
      <form className={styles.signup_form}>
        <h1 className={styles.signup_form_h1}>регистрация</h1>
        <label className={styles.signup_form_label}>
          <p>
            Фамилия <span style={{ color: "red" }}>*</span>
          </p>
          <input type="text" name="surname" />
        </label>
        <label className={styles.signup_form_label}>
          <p>
            Имя <span style={{ color: "red" }}>*</span>
          </p>
          <input type="text" name="name" />
        </label>
        <label className={styles.signup_form_label}>
          <p>Отчество</p>
          <input type="text" name="patronomic" />
        </label>
        <label className={styles.signup_form_label}>
          <p>
            Номер телефона <span style={{ color: "red" }}>*</span>
          </p>
          <PatternFormat
            format="+7 (###) ### ##-##"
            allowEmptyFormatting
            mask="_"
            name="phone"
          />
        </label>
        <label className={styles.signup_form_label}>
          <p>E-mail</p>
          <input type="email" name="email" />
        </label>
        <label className={styles.signup_form_confirmLabel}>
          <input type="checkbox" onChange={(e) => setCb(!cb)} />
          <p>Получать информацию о новинках и распродажах</p>
        </label>
        <h3 className={styles.signup_form_confirm}>
          Продолжив регистрацию, я соглашаюсь с{" "}
          <Link to="/politics">политикой конфиденциальности</Link>и
          <Link to="/oferta">публичной офертой</Link>
        </h3>
        <button className={styles.signup_form_button}>Продолжить</button>
        <h2 className={styles.signup_form_link}>
          Уже есть аккаунт? <Link to="/signin">Войти</Link>
        </h2>
      </form>
    </div>
  );
};
