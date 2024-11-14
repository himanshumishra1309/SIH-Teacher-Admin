import React, { useEffect, useState } from 'react';
import "../SISU/SISU.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

function FacultySISU() {
  const navigate = useNavigate();
  
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    employee_code: '',  // Corrected from 'employee_Code'
    department: '',
    password: '',
  });
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

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

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', signupData.name);
    formData.append('email', signupData.email);
    formData.append('employee_code', signupData.employee_code);  // Keep consistent naming
    formData.append('department', signupData.department);
    formData.append('password', signupData.password);
    formData.append('avatar', avatar);

    try {
      const response = await axios.post('http://localhost:6005/api/v1/teachers/register', formData);

      console.log('Signup successful:', response);
      console.log('Signup successful:', response.data);

      const { teacherAccessToken } = response?.data?.data;
      
      // Store the access token in session storage
      sessionStorage.setItem('teacherAccessToken', teacherAccessToken);

      navigate('/faculty');
    } catch (error) {
      console.error('Error during signup:', error.response?.data?.message || error.message);
      alert('Signup failed. Please try again.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({loginData});
      const response = await axios.post('http://localhost:6005/api/v1/teachers/login', loginData);
      // console.log({response});
      const { teacherAccessToken } = response?.data?.data;
      // console.log(response.data.data.user._id);
      
      // Store the access token in session storage
      sessionStorage.setItem('teacherAccessToken', teacherAccessToken);
      
      navigate(`/faculty/${response.data.data.user._id}`, { state: { justLoggedIn: true }});  // Redirect to profile page
    } catch (error) {
      console.error('Error during login:', error.response?.data?.message || error.message);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className='w-full h-full flex flex-col justify-center items-center bg-slate-50'>
      <div className='w-full flex justify-center items-center bg-slate-50'>
        <div className="fs-container w-1/2" id="fs-main">
          <div className="fs-sign-up">
            <form onSubmit={handleSignUpSubmit}>
              <p className='mb-4'>Sign Up</p>

              <ScrollArea>
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
                  id="employee_code"  // Corrected to be consistent with backend
                  type="text"
                  placeholder="Employee Code*"
                  value={signupData.employee_code}
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

                <h2 className='mt-2'>Add Avatar:</h2>
                <input type="file" onChange={handleAvatarChange} accept="image/png, image/gif, image/jpeg" />
                {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="mt-2" />}

                <Button className="pt-2 pb-2 pl-4 pr-4 w-2/4 bg-blue-400 text-white m-2 font-semibold hover:bg-blue-500">
                  Sign Up
                </Button>
              </ScrollArea>
            </form>
          </div>

          <div className="fs-sign-in">
            <form onSubmit={handleLoginSubmit}>
              <p className='mb-4'>Sign In</p>
              <input
                className='border mb-2 p-2'
                type="email"
                id="email"
                placeholder="Email*"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              <input
                className='border mb-2 p-2'
                type="password"
                id="password"
                placeholder="Password*"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              <Button className="pt-2 pb-2 pl-4 pr-4 w-2/4 bg-green-400 text-white m-2 font-semibold hover:bg-green-500">
                Sign In
              </Button>
            </form>
          </div>
          <div className="fs-overlay-container">
            <div className="fs-overlay">
              <div className="fs-overlay-left">
                <h1 className='mb-5 text-3xl font-semibold'>Already have an account?</h1>
                <button 
                  className='pt-2 pb-2 pl-4 pr-4 w-3/4 font-semibold' 
                  id="fs-signIn"
                >
                  Sign In
                </button>
              </div>

              <div className="fs-overlay-right">
                <h1 className='mb-5 text-3xl font-semibold'>New User?</h1>
                <button 
                  className='pt-2 pb-2 pl-4 pr-4 w-3/4 font-semibold' 
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