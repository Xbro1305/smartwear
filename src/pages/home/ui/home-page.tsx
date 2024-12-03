import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATHS } from '@/shared/config/routes'; 



export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    navigate(ROUTER_PATHS.SIGN_UP);
  }, [navigate]);

  return (
    <div>
      <h1>Добро пожаловать на главную страницу!</h1>
      <p>Вы будете перенаправлены на страницу регистрации.</p>
    </div>
  );
};
