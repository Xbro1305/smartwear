import { useState, FormEvent } from "react";
import styles from '../../sign-up/Signup.module.scss';
import { PatternFormat } from "react-number-format";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ROUTER_PATHS } from "@/shared/config/routes";
import { useRequestCodeMutation, useLoginMutation } from "@/entities/auth";

interface FormData {
  phone?: string;
  code?: string;
}

export const SignInPage: React.FC = () => {
  const [stage, setStage] = useState<number>(1);
  const [timer, setTimer] = useState<number>(30);
  //const [data, setData] = useState<FormData>({});
  const navigate = useNavigate();

  const [requestCode] = useRequestCodeMutation();
  const [login] = useLoginMutation();

  
  const getCode = async (phone: string) => {
    try {
      await requestCode({ phone }).unwrap();
      setStage(2);
      let tm = 30;
      const interval = setInterval(() => {
        tm -= 1;
        setTimer(tm);
      }, 1000);

      setTimeout(() => clearInterval(interval), 30000);
    } catch (error) {
      enqueueSnackbar("Ошибка при отправке кода", {
        variant: "error",
      });
    }
  };

  const setSt = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const value = Object.fromEntries(formData) as FormData;
    //setData(value);

    
    getCode(value.phone!);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData(e.target as HTMLFormElement);
    const value = Object.fromEntries(formData) as FormData;
  
    if (value.code?.includes("-")) {
      return enqueueSnackbar("Неправильный код", {
        variant: "error",
      });
    }
  
    login({ code: value.code! })
      .unwrap()
      .then(({ access_token }) => {
        
        localStorage.setItem('token', access_token);
  
        
        enqueueSnackbar("Вы успешно зарегистрировались", {
          variant: "success",
        });
  
        
        navigate(ROUTER_PATHS.PROFILE, { replace: true });
      })
      .catch(() => {
        enqueueSnackbar("Ошибка при подтверждении кода", {
          variant: "error",
        });
      });
  };

  return (
    <div className={styles.signup}>
      {stage === 1 && (
        <form className={styles.signup_form} onSubmit={setSt}>
          <h1 className={styles.signup_form_h1}>Вход</h1>
          <label className={styles.signup_form_label}>
            <p>Номер телефона</p>
            <PatternFormat
              format="+7 (###) ### ##-##"
              allowEmptyFormatting
              mask="_"
              name="phone"
            />
          </label>
          <button className={styles.signup_form_button}>Получить код</button>
          <h2 className={styles.signup_form_link}>
            Нет аккаунта? <Link to={ROUTER_PATHS.SIGN_UP}>Зарегистрироваться</Link>
          </h2>
        </form>
      )}

      {stage === 2 && (
        <form onSubmit={submit} className={styles.signup_form}>
          <h1 className={styles.signup_form_h1}>Регистрация</h1>
          <p className={styles.signup_form_againButton}>
            На ваш номер придёт сообщение с кодом.
            <button className={styles.signup_form_againButton}>
              Отправить повторно {timer !== 0 ? "через " + timer : ""}
            </button>
          </p>
          <label className={styles.signup_form_label}>
            <p>Введите смс код</p>
            <PatternFormat
              format="#####"
              allowEmptyFormatting
              mask="-"
              name="code"
              required
            />
          </label>
          <button className={styles.signup_form_button}>
            Перейти в личный кабинет
          </button>
        </form>
      )}
    </div>
  );
};