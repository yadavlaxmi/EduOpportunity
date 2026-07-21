import {useState} from "react";
import api from "../../services/api";


function SignupForm(){

const [formData,setFormData]=useState({
 fullName:"",
 email:"",
 password:""
});


const handleChange=(e)=>{
 setFormData({
  ...formData,
  [e.target.name]:e.target.value
 });
};


const handleSubmit=async(e)=>{

 e.preventDefault();

 try{

  const res=await api.post(
    "/auth/signup",
    formData
  );

  localStorage.setItem(
    "token",
    res.data.token
  );

  alert("Signup Successful");

 }
 catch(err){

  alert(
   err.response?.data?.message ||
   "Signup Failed"
  );

 }

};


return(

<div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">

<h1 className="text-3xl font-bold text-center">
Create Account
</h1>


<form onSubmit={handleSubmit}>


<input
className="border p-3 w-full mt-5"
placeholder="Full Name"
name="fullName"
onChange={handleChange}
/>


<input
className="border p-3 w-full mt-4"
placeholder="Email"
name="email"
type="email"
onChange={handleChange}
/>


<input
className="border p-3 w-full mt-4"
placeholder="Password"
name="password"
type="password"
onChange={handleChange}
/>


<button
className="bg-blue-600 text-white w-full p-3 mt-5 rounded"
>
Signup
</button>


</form>

</div>

)

}

export default SignupForm;