import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await api.post("/auth/signup", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      alert(res.data.message);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[420px]">

        <h1 className="text-3xl font-bold text-center">
          EduOpportunity
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        <form onSubmit={handleSubmit}>

          <input
            className="border p-3 rounded w-full mb-4"
            placeholder="Full Name"
            name="fullName"
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded w-full mb-4"
            placeholder="Email"
            type="email"
            name="email"
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded w-full mb-4"
            placeholder="Password"
            type="password"
            name="password"
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded w-full mb-5"
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            onChange={handleChange}
          />

          <button
            className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700"
          >
            Create Account
          </button>

        </form>

        <div className="text-center my-5">
          OR
        </div>

        <GoogleLoginButton />

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;