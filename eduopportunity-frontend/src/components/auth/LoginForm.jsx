import { useState } from "react";
import api from "../../services/api";
import GoogleLoginButton from "./GoogleLoginButton";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">

      <h1 className="text-3xl font-bold text-center mb-2">
        EduOpportunity
      </h1>

      <p className="text-gray-500 text-center mb-6">
        Login to your account
      </p>

      <form onSubmit={handleSubmit}>

        <input
          className="border p-3 w-full rounded mb-4"
          placeholder="Email"
          name="email"
          type="email"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded mb-4"
          placeholder="Password"
          name="password"
          type="password"
          onChange={handleChange}
        />

        <button
          className="bg-blue-600 text-white w-full p-3 rounded"
        >
          Login
        </button>

      </form>

      <div className="text-center mt-5">
        OR
      </div>

   {
    <GoogleLoginButton/>
   }
    <p className="text-center mt-5">
 Don't have an account?
 <a href="/signup" className="text-blue-600">
  Signup
 </a>
</p>

    </div>
    
  );
}

export default LoginForm;