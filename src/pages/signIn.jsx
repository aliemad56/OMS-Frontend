import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextFieldForm from "./../reusable elements/ReuseAbleTextField.jsx";
import "./signIn.css";
import Logo from "../assets/Asset 2.png";
import dataUsers from "./../data/users.json";
import useAuthStore from "./../store/store.js";

const SignInPage = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [loginError, setLoginError] = useState("");

  const { login, error, isLoggedIn } = useAuthStore();

  const fields = [
    { name: "username", placeholder: "اسم المستخدم", type: "text" },
    { name: "password", placeholder: "كلمة السر", type: "password" },
  ];

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);

  const handleSubmit = () => {
    if (formRef.current) {
      const formData = formRef.current.getFormData();
      const { username, password } = formData;

      if (!username || !password) {
        setLoginError("يرجى إدخال اسم المستخدم وكلمة السر");
        return;
      }

      login(username, password, dataUsers);
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src={Logo} alt="ScopeSky Logo" className="logo" />
        <h1>نظام إدارة المكاتب</h1>
      </div>
      <div className="right-side">
        <h2>سجل الدخول</h2>
        {loginError && <div className="error-message">{loginError}</div>}
        <TextFieldForm
          ref={formRef}
          fields={fields}
          hideButtons={true} // Hide buttons on the sign-in page
          formClassName="form"
          inputClassName="input-field"
          fieldWrapperClassName="input-wrapper"
        />
        <button onClick={handleSubmit} className="login-btn">
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
