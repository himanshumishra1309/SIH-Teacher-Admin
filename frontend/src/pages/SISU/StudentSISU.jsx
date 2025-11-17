import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus, UserCheck, GraduationCap } from "lucide-react";
import "../SISU/SISU.css";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
// import "react-toastify/dist/ReactToastify.css";

export default function StudentSISU() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    roll_no: "",
    branch: "",
    year: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // useEffect(() => {
  //   const signUpButton = document.getElementById("fs-signUp");
  //   const signInButton = document.getElementById("fs-signIn");
  //   const container = document.querySelector(".fs-container");

  //   signUpButton.addEventListener('click', () => {
  //     container.classList.add("right-panel-active");
  //   });

  //   signInButton.addEventListener('click', () => {
  //     container.classList.remove("right-panel-active");
  //   });

  //   return () => {
  //     signUpButton.removeEventListener('click', () => {
  //       container.classList.add("right-panel-active");
  //     });
  //     signInButton.removeEventListener('click', () => {
  //       container.classList.remove("right-panel-active");
  //     });
  //   };
  // }, []);

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
    formData.append("roll_no", signupData.roll_no);
    formData.append("branch", signupData.branch);
    formData.append("year", signupData.year);
    formData.append("avatar", avatar);
    formData.append("password", signupData.password);

    try {
      const response = await axios.post(
        "http://localhost:6005/api/v1/students/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Proper headers for file uploads
          },
        }
      );

      const accessToken = response?.data?.data?.studentAccessToken;
      sessionStorage.setItem("studentAccessToken", accessToken);
      // console.log("Registration successful", response.data);
      toast.success("Registration successful");
      navigate;
      ("/student-home");
    } catch (error) {
      console.error("Error during signup:", error.message);
      toast.success("Signup failed. Please try again.");
      // alert("Signup failed. Please try again.");
    }
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // const handleSignUpSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   Object.keys(signupData).forEach(key => {
  //     formData.append(key, signupData[key]);
  //   });
  //   if (avatar) formData.append("avatar", avatar);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:6005/api/v1/students/register",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     const accessToken = response?.data?.data?.studentAccessToken;
  //     sessionStorage.setItem("studentAccessToken", accessToken);
  //     navigate("/student-home");
  //   } catch (error) {
  //     console.error("Error during signup:", error.message);
  //     alert("Signup failed. Please try again.");
  //   }
  // };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:6005/api/v1/students/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { studentAccessToken } = response?.data?.data;

      if (studentAccessToken) {
        sessionStorage.setItem("studentAccessToken", studentAccessToken);

        // toast.success("Login successful");
        console.log("Login successful", response.data);

        navigate("/student-home");
      } else {
        throw new Error("Access token is missing in the response");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error during login:", errorMessage);
      // toast.error("Login failed. Please try again.");
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Student Portal</h1>
        <p className="text-xl text-blue-100">
          Empowering Students in the Academic Journey
        </p>
      </div>
      <div className="w-full max-w-4xl flex justify-center items-center">
        <div className="fs-container" id="fs-main">
          <div className="fs-sign-up">
            <form onSubmit={handleSignUpSubmit}>
              <ScrollArea>
                <GraduationCap className="fs-icon text-blue-800" size={64} />

                <h1 className="text-2xl font-bold text-blue-800 mb-4">
                  Create Student Account
                </h1>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                  className="fs-input"
                />
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  className="fs-input"
                />
                <input
                  type="text"
                  id="roll_no"
                  placeholder="Enrollment No"
                  value={signupData.roll_no}
                  onChange={handleSignupChange}
                  required
                  className="fs-input"
                />
                <input
                  type="text"
                  id="branch"
                  placeholder="Branch"
                  value={signupData.branch}
                  onChange={handleSignupChange}
                  required
                  className="fs-input"
                />
                <input
                  type="text"
                  id="year"
                  placeholder="Year"
                  value={signupData.year}
                  onChange={handleSignupChange}
                  required
                  className="fs-input"
                />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  className="fs-input"
                />
                <input
                  type="file"
                  id="avatar"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="fs-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="mt-2 w-20 h-20 object-cover rounded-full"
                  />
                )}
                <button type="submit" className="fs-button">
                  Sign Up
                </button>
              </ScrollArea>
            </form>
          </div>

          <div className="fs-sign-in">
            <form onSubmit={handleLoginSubmit}>
              <UserCheck className="fs-icon text-blue-800" size={64} />
              <h1 className="text-2xl font-bold text-blue-800 mb-4">Sign In</h1>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="fs-input"
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="fs-input"
              />
              <button type="submit" className="fs-button">
                Sign In
              </button>
            </form>
          </div>

          <div className="fs-overlay-container">
            <div className="fs-overlay">
              {/* <div className="fs-overlay-left">
                <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
                <p className="mb-4">Continue your learning journey with us</p>
                <button id="fs-signIn" className="fs-overlay-button">Sign In</button>
              </div> */}
              <div className="fs-overlay-right">
                <h1 className="text-3xl font-bold mb-4">Hello, Student!</h1>
                <p className="mb-4">
                  Join us and start your academic adventure
                </p>
                {/* <button id="fs-signUp" className="fs-overlay-button">Sign Up</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
