import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus, UserCheck, BookOpen } from "lucide-react";
import "../SISU/SISU.css";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FacultySISU() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    employee_code: "",
    department: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // useEffect(() => {
  //   const signUpButton = document.getElementById('fs-signUp');
  //   const signInButton = document.getElementById('fs-signIn');
  //   const container = document.querySelector('.fs-container');

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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);
    formData.append("employee_code", signupData.employee_code);
    formData.append("department", signupData.department);
    formData.append("password", signupData.password);
    formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        "http://localhost:6005/api/v1/teachers/register",
        formData
      );
      const { teacherAccessToken } = response?.data?.data;
      sessionStorage.setItem("teacherAccessToken", teacherAccessToken);
      navigate("/faculty");
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data?.message || error.message
      );
      alert("Signup failed. Please try again.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6005/api/v1/teachers/login",
        loginData
      );
      const { teacherAccessToken } = response?.data?.data;
      sessionStorage.setItem("teacherAccessToken", teacherAccessToken);
      navigate(`/faculty/${response.data.data.user._id}/appraisal-report`, {
        state: { justLoggedIn: true },
      });
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data?.message || error.message
      );
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Faculty Portal</h1>
        <p className="text-xl text-blue-100">
          Empowering Educators in the Appraisal Process
        </p>
      </div>
      <div className="w-full max-w-4xl flex justify-center items-center">
        <div className="fs-container" id="fs-main">
          {/* <div className="fs-sign-up">
            <form onSubmit={handleSignUpSubmit}>

              <ScrollArea>
              <h1 className="text-2xl font-bold text-blue-800 mb-4">Create Faculty Account</h1>
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
                id="employee_code"
                placeholder="Employee Code"
                value={signupData.employee_code}
                onChange={handleSignupChange}
                required
                className="fs-input"
              />
              <input
                type="text"
                id="department"
                placeholder="Department"
                value={signupData.department}
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
                <img src={avatarPreview} alt="Avatar Preview" className="mt-2 w-20 h-20 object-cover rounded-full" />
              )}
              <button type="submit" className="fs-button">Sign Up</button>
              </ScrollArea>

            </form>


          </div> */}
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
                <p className="mb-4">To continue your journey in shaping minds, please sign in</p>
                <button id="fs-signIn" className="fs-overlay-button">Sign In</button>
              </div> */}
              <div className="fs-overlay-right">
                <h1 className="text-3xl font-bold mb-4">Hello, Educator!</h1>
                <p className="mb-4">
                  Start your journey with us and make a difference in education
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
