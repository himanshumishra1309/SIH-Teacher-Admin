import React, { useEffect, useState } from "react";
import "../SISU/SISU.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentSISU() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    roll_no: "",
    branch: "",
    year: "",
    avatar: "",
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
      // Create FormData object and append the email and password
      const formData = {
        email: loginData.email,
        password: loginData.password,
      };
      console.log(formData);

      // Send the FormData to the backend using axios
      const response = await axios.post(
        "http://localhost:6005/api/v1/students/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Set content type to application/json
          },
        }
      );

      const { studentAccessToken } = response?.data?.data;

      if (studentAccessToken) {
        sessionStorage.setItem("studentAccessToken", studentAccessToken);

        toast.success("Login successful");
        // console.log("Login successful", response.data);

        navigate("/student-home");
      } else {
        throw new Error("Access token is missing in the response");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error during login:", errorMessage);
      toast.error("Login failed. Please try again.");
      // alert("Login failed. Please try again.");
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
              <ScrollArea>
                <p className="mb-4">Sign Up</p>
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
                  id="roll_no"
                  type="text"
                  placeholder="Enrollment No*"
                  value={signupData.roll_no}
                  onChange={handleSignupChange}
                />
                <input
                  className="border mb-2 p-2"
                  id="branch"
                  type="text"
                  placeholder="Branch*"
                  value={signupData.branch}
                  onChange={handleSignupChange}
                />
                <input
                  className="border mb-2 p-2"
                  id="year"
                  type="text"
                  placeholder="Year*"
                  value={signupData.year}
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
              <p className="mb-4">Sign In</p>
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
                  {" "}
                  Sign In{" "}
                </button>
              </div>

              <div className="fs-overlay-right">
                <h1 className="mb-5 text-3xl font-semibold">New User?</h1>
                <button
                  className="pt-2 pb-2 pl-4 pr-4 w-3/4 font-semibold"
                  id="fs-signUp"
                >
                  {" "}
                  Sign Up{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSISU;
