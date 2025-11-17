import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function StudentRegister() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    roll_no: "",
    branch: "",
    year: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleSignupChange = (e) => {
    const { id, value } = e.target;
    setSignupData({ ...signupData, [id]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(signupData).forEach((key) =>
      formData.append(key, signupData[key])
    );
    formData.append("avatar", avatar);

    try {
      const token = sessionStorage.getItem("adminAccessToken");
      console.log("Hellow1")
      const response = await axios.post(
        "http://localhost:6005/api/v1/admins/register-student",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Hellow2")

      console.log(response);
      alert("Registration successful"); 
    } catch (error) {
      console.error("Error during signup:", error.message);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-700">
      <GraduationCap className="text-white mb-4" size={64} />
      <h1 className="text-3xl font-bold text-white mb-6">
        Create Student Account
      </h1>
      <form
        onSubmit={handleSignUpSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          id="name"
          placeholder="Name"
          value={signupData.name}
          onChange={handleSignupChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={signupData.email}
          onChange={handleSignupChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          id="roll_no"
          placeholder="Enrollment No"
          value={signupData.roll_no}
          onChange={handleSignupChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          id="branch"
          placeholder="Branch"
          value={signupData.branch}
          onChange={handleSignupChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          id="year"
          placeholder="Year"
          value={signupData.year}
          onChange={handleSignupChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={signupData.password}
          onChange={handleSignupChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="file"
          id="avatar"
          onChange={handleAvatarChange}
          accept="image/*"
          className="mb-3"
        />
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-20 h-20 object-cover rounded-full mb-3"
          />
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
