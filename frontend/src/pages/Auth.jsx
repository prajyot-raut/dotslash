import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        loginData,
        { withCredentials: true }
      );
      if (response.data.message === "Login successful") {
        setIsAuthenticated(true);
        localStorage.setItem("authToken", response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignupSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        signupData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        // After successful registration, switch to login tab
        setActiveIndex(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen bg-gray-100">
      <Card className="w-full md:w-8 lg:w-6 xl:w-4">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel header="Login">
            <div className="p-fluid">
              <div className="p-field">
                <label htmlFor="loginEmail">Email</label>
                <InputText
                  id="loginEmail"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="loginPassword">Password</label>
                <Password
                  id="loginPassword"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
              </div>
              <Button label="Login" onClick={handleLoginSubmit} />
            </div>
          </TabPanel>
          <TabPanel header="Sign Up">
            <div className="p-fluid">
              <div className="p-field">
                <label htmlFor="signupEmail">Email</label>
                <InputText
                  id="signupEmail"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="signupPassword">Password</label>
                <Password
                  id="signupPassword"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                />
              </div>
              <div className="p-field">
                <label htmlFor="signupConfirmPassword">Confirm Password</label>
                <Password
                  id="signupConfirmPassword"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                />
              </div>
              <Button label="Sign Up" onClick={handleSignupSubmit} />
            </div>
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default AuthPage;
