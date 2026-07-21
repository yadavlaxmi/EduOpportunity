import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function GoogleLoginButton() {

 const handleSuccess = async (credentialResponse) => {
  try {
    const res = await axios.post(
      "http://localhost:5005/api/auth/google-login",
      {
        token: credentialResponse.credential,
      }
    );

    console.log(res.data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Google Login Successful");

  } catch (err) {
    console.log(err);
    alert("Google Login Failed");
  }
};

  return (

    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />

  );

}

export default GoogleLoginButton;