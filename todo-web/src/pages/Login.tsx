import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import custom_axios from "../axios/AxiosSetup";
import { ApiConstants } from "../api/ApiConstants";

const Login = () => {
  const navigate = useNavigate();
  const email: any = React.useRef();
  const password: any = React.useRef();

  const loginApp = async () => {
    if (email.current.value == "" || password.current.value == "") {
      toast.info("Please fill the information");
      return;
    }
    
    try {
      const response = await custom_axios.post(ApiConstants.LOGIN, {
        email: email.current.value,
        password: password.current.value,
      });
      
      localStorage.setItem("token", response.data.token);
      dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something was wrong!!");
    }
  };

  return (
    <div className="flex items-center justify-center mt-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl px-12 pt-6 pb-8 mb-4">
          <h3 className="pt-4 text-2xl mb-4 text-center">Todo's App</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="username">
              Email
            </label>
            <input
              ref={email}
              name="email"
              type="email"
              placeholder="Email"
              v-model="form.email"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="password">
              Password
            </label>
            <input
              ref={password}
              type="password"
              name="password"
              placeholder="Password"
              v-model="form.password"
              autoComplete="current-password"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <button 
              onClick={loginApp} 
              className="px-4 py-2 rounded-full font-bold text-white inline-block bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <a 
              onClick={() => navigate("/signUp")} 
              className="cursor-pointer inline-block align-baseline font-normal text-sm text-center text-blue-500 hover:text-blue-800 underline"
            >
              Create New Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
