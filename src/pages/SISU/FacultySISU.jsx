import React, { useEffect, useState } from 'react';
// Import the updated CSS file
import "../SISU/SISU.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from "../../components/ui/input";
import { Button } from '../../components/ui/button';

function FacultySISU() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    department: '',
    employee_Code: '',
    Avatar: '',
    password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // State for storing the profile picture (avatar)
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const signUpButton = document.getElementById('fs-signUp');
    const signInButton = document.getElementById('fs-signIn');
    const main = document.getElementById('fs-main');

    if (signUpButton && signInButton && main) {
      const signUpClick = () => main.classList.add("right-panel-active");
      const signInClick = () => main.classList.remove("right-panel-active");

      signUpButton.addEventListener('click', signUpClick);
      signInButton.addEventListener('click', signInClick);

      return () => {
        signUpButton.removeEventListener('click', signUpClick);
        signInButton.removeEventListener('click', signInClick);
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
    try {
      // const response = await axios.post(`${URI}/api/v1/doctors/register`, signupData);
      // const accessToken = response?.data?.data?.accessToken;

      // Store user-specific data in sessionStorage
      // sessionStorage.setItem('doctorAccessToken', accessToken);
      navigate('/faculty');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed. Please try again.');
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
        // const response = await axios.post(`${URI}/api/v1/doctors/login`, loginData);
        // const accessToken = response?.data?.data?.accessToken;
              
        // Store user-specific data in sessionStorage
        // sessionStorage.setItem('doctorAccessToken', accessToken);
        navigate('/faculty');  // Redirect to profile page
    } catch (error) {
        if (error.response) {
            console.error('Error during login:', error.response.data); // Capture error message from backend
        } else {
            console.error('Error during login:', error.message); // Capture other errors
        }
    }
  };

  const [file, setFile] = useState();
  function handleChange(e) {
      console.log(e.target.files);
      setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className='w-full h-full flex flex-col justify-center items-center bg-slate-50'>
      <div className='w-full flex justify-center items-center bg-slate-50'>
        <div className="fs-container w-1/2" id="fs-main">
          <div className="fs-sign-up">
            <form onSubmit={handleSignUpSubmit}>
              <p className='mb-4'>Sign Up</p>
              <input 
                className='border mb-2 p-2' 
                id="name" 
                type="text" 
                placeholder="Name*" 
                value={signupData.name} 
                onChange={handleSignupChange}  
              />
              <input 
                className='border mb-2 p-2' 
                id="email" 
                type="email" 
                placeholder="Email*" 
                value={signupData.email} 
                onChange={handleSignupChange}  
              />
              <input 
                className='border mb-2 p-2' 
                id="department" 
                type="text" 
                placeholder="Department*" 
                value={signupData.department} 
                onChange={handleSignupChange}  
              />
              <input 
                className='border mb-2 p-2' 
                id="employee_Code" 
                type="text" 
                placeholder="Employee Code*" 
                value={signupData.employee_Code} 
                onChange={handleSignupChange}  
              />
              <input 
                className='border mb-2 p-2' 
                id="password" 
                type="password" 
                placeholder="Password*" 
                value={signupData.password} 
                onChange={handleSignupChange}  
              />

              <h2>Add Avatar:</h2>
              <input type="file" onChange={handleChange} />
              {file && <img src={file} alt="Avatar Preview" />}

              <Button className="button pt-2 pb-2 pl-4 pr-4 w-2/4 bg-blue-400 text-white m-2 font-semibold hover:bg-blue-500">
                Sign Up
              </Button>
            </form>
          </div>

          <div className="fs-sign-in">
            <form onSubmit={handleLoginSubmit}>
              <p className='mb-4'>Sign In</p>
              <input 
                className='border mb-2 p-2' 
                type="email" 
                id="email" 
                placeholder="Email" 
                value={loginData.email} 
                onChange={handleLoginChange}  
              />
              <input 
                className='border mb-2 p-2' 
                type="password" 
                id="password" 
                placeholder="Password" 
                value={loginData.password} 
                onChange={handleLoginChange}  
              />
              <button 
                type="submit" 
                className="button pt-2 pb-2 pl-4 pr-4 w-2/4 bg-blue-400 text-white m-2 font-semibold hover:bg-blue-400"
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="fs-overlay-container">
            <div className="fs-overlay">
              <div className="fs-overlay-left">
                <h1 className='mb-5 text-3xl font-semibold'>Already have an account?</h1>
                <button 
                  className='pt-2 pb-2 pl-4 pr-4 w-2/4 font-semibold' 
                  id="fs-signIn"
                >
                  Sign In
                </button>
              </div>

              <div className="fs-overlay-right">
                <h1 className='mb-5 text-3xl font-semibold'>New User?</h1>
                <button 
                  className='pt-2 pb-2 pl-4 pr-4 w-2/4 font-semibold' 
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

export default FacultySISU;
