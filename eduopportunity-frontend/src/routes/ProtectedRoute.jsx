import api from "../../services/api";


const getProfile = async()=>{

 const token = localStorage.getItem("token");


 const res = await api.get(
   "/users/profile",
   {
    headers:{
      Authorization:`Bearer ${token}`
    }
   }
 );


 console.log(res.data);

}