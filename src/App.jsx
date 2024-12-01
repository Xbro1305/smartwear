import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Signup } from "./Pages/Auth/Signup/Signup";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/signUp"} element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};
