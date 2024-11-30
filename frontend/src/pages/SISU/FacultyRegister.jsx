import React, { useState } from "react";
import axios from "axios";

export default function FacultyRegister() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    employee_code: "",
    department: "",
    designation: "",
    experience: "",
    qualification: "",
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

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      employee_code,
      department,
      designation,
      experience,
      qualification,
      password,
    } = signupData;

    if (
      !name ||
      !email ||
      !employee_code ||
      !department ||
      !designation ||
      !experience ||
      !qualification ||
      !password
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    Object.keys(signupData).forEach((key) => {
      formData.append(key, signupData[key]);
    });
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const token = sessionStorage.getItem("adminAccessToken");
      console.log("hellow1");
      const response = await axios.post(
        "http://localhost:6005/api/v1/admins/register-teacher",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("hellow2");

      alert("Faculty account created successfully!");
      console.log("Response:", response.data);

      setSignupData({
        name: "",
        email: "",
        employee_code: "",
        department: "",
        designation: "",
        experience: "",
        qualification: "",
        password: "",
      });
      setAvatar(null);
      setAvatarPreview("");
    } catch (error) {
      console.error(
        "Error during faculty signup:",
        error.response?.data?.message || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to create faculty account. Please try again."
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create Faculty Account
        </h1>
        <form onSubmit={handleSignUpSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={signupData.name}
              onChange={handleSignupChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="employee_code"
              className="block text-sm font-medium text-gray-700"
            >
              Employee Code
            </label>
            <input
              type="text"
              id="employee_code"
              placeholder="Employee Code"
              value={signupData.employee_code}
              onChange={handleSignupChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              placeholder="Department"
              value={signupData.department}
              onChange={handleSignupChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700"
            >
              Designation
            </label>
            <input
              type="text"
              id="designation"
              placeholder="Designation"
              value={signupData.designation}
              onChange={handleSignupChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700"
            >
              Experience (in years)
            </label>
            <input
              type="number"
              id="experience"
              placeholder="Experience"
              value={signupData.experience}
              onChange={handleSignupChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="qualification"
              className="block text-sm font-medium text-gray-700"
            >
              Qualification
            </label>
            <input
              type="text"
              id="qualification"
              placeholder="Qualification"
              value={signupData.qualification}
              onChange={handleSignupChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              onChange={handleAvatarChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:bg-gray-100 hover:file:bg-gray-200"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
