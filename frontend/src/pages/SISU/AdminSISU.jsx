import React, { useEffect, useState } from "react";
// Import the updated AdminSISU CSS file
import "../SISU/SISU.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

function AdminSISU() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    designation: "",
    Avatar: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State for storing the profile picture (avatar)
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    const signUpButton = document.getElementById("fs-signUp");
    const signInButton = document.getElementById("fs-signIn");
    const main = document.getElementById("fs-main");

    if (signUpButton && signInButton && main) {
      const signUpClick = () => main.classList.add("right-panel-active");
      const signInClick = () => main.classList.remove("right-panel-active");

      signUpButton.addEventListener("click", signUpClick);
      signInButton.addEventListener("click", signInClick);

      return () => {
        signUpButton.removeEventListener("click", signUpClick);
        signInButton.removeEventListener("click", signInClick);
      };
    }
  }, []);

  const handleSignupChange = (e) => {
    const { id, value } = e.target;
    setSignupData({ ...signupData, [id]: value });
  };

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginData({ ...loginData, [id]: value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);
    formData.append("designation", signupData.designation);
    formData.append("password", signupData.password);
    formData.append("avatar", avatar);
    try {
      const response = await axios.post(
        "http://localhost:6005/api/v1/admins/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const accessToken = response?.data?.data?.adminAccessToken;
      sessionStorage.setItem("adminAccessToken", accessToken);
      console.log("Registration successful", response.data);
      navigate("/admin-home");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    // Display image preview
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        email: loginData.email,
        password: loginData.password,
      };
      console.log(formData);

      const response = await axios.post(
        "http://localhost:6005/api/v1/admins/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { adminAccessToken } = response?.data?.data;

      if (adminAccessToken) {
        sessionStorage.setItem("adminAccessToken", adminAccessToken);

        console.log("Login successful", response.data);

        navigate("/admin-home");
      } else {
        throw new Error("Access token is missing in the response");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error during login:", errorMessage);
      alert("Login failed. Please try again.");
    }
  };

  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-slate-50">
      <div className="w-full flex justify-center items-center bg-slate-50">
        <div className="fs-container w-1/2" id="fs-main">
          <div className="fs-sign-up">
            <form onSubmit={handleSignUpSubmit}>
              <p className="mb-4">Sign Up</p>

              <ScrollArea>
                <input
                  className="border mb-2 p-2"
                  id="name"
                  type="text"
                  placeholder="Name*"
                  value={signupData.name}
                  onChange={handleSignupChange}
                />
                <input
                  className="border mb-2 p-2"
                  id="email"
                  type="email"
                  placeholder="Email*"
                  value={signupData.email}
                  onChange={handleSignupChange}
                />
                <input
                  className="border mb-2 p-2"
                  id="designation"
                  type="text"
                  placeholder="Designation*"
                  value={signupData.designation}
                  onChange={handleSignupChange}
                />
                <input
                  className="border mb-2 p-2"
                  id="password"
                  type="password"
                  placeholder="Password*"
                  value={signupData.password}
                  onChange={handleSignupChange}
                />

                <h2>Add Avatar:</h2>
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  accept="image/png, image/gif, image/jpeg"
                />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="mt-2"
                  />
                )}

                <Button className="button pt-2 pb-2 pl-4 pr-4 w-3/4 bg-blue-400 text-white m-2 font-semibold hover:bg-blue-500">
                  Sign Up
                </Button>
              </ScrollArea>
            </form>
          </div>
          <div className="fs-sign-in">
            <form onSubmit={handleLoginSubmit}>
              <p className="mb-4 w-3/4">Sign In</p>
              <input
                className="border mb-2 p-2"
                type="email"
                id="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              <input
                className="border mb-2 p-2"
                type="password"
                id="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              <button
                type="submit"
                className="button pt-2 pb-2 pl-4 pr-4 w-3/4 bg-blue-400 text-white m-2 font-semibold hover:bg-blue-400"
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="fs-overlay-container">
            <div className="fs-overlay">
              <div className="fs-overlay-left">
                <h1 className="mb-5 text-3xl font-semibold">
                  Already have an account?
                </h1>
                <button
                  className="pt-2 pb-2 pl-4 pr-4 w-3/4 font-semibold"
                  id="fs-signIn"
                >
                  Sign In
                </button>
              </div>

              <div className="fs-overlay-right">
                <h1 className="mb-5 text-3xl font-semibold">New User?</h1>
                <button
                  className="pt-2 pb-2 pl-4 pr-4 w-3/4 font-semibold"
                  id="fs-signUp"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSISU;
