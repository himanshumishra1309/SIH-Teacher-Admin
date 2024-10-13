import React, { useEffect, useState } from 'react';
import './SISU.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Input} from "../../components/ui/input"
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
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const main = document.getElementById('main');

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
  
//   const handleCancleClick = () => {
//     const changebutton = document.querySelector('#Ambulance-Button');
//     changebutton.classList.remove('bg-orange-500');
//     changebutton.classList.add('bg-red-600');
//     changebutton.innerText = "Call an Ambulance"
//     setTrackAmb(false);
//   }

//   const handleSavePostClick = (event) => {
//     event.preventDefault();
//     if(event.target.innerHTML == "Call an Ambulance"){
//         setPopupVisible(true);
//     }
//     if(event.target.innerHTML == "Track Your Ambulance"){
//         console.log(event.target.innerHTML);
//         setPopupVisible(false);
//         setTrackAmb(true);
//     }
// };

// const handleContinue = (event) =>{
//     setPopupVisible(false);
//     const changebutton = document.querySelector('#Ambulance-Button')
//     changebutton.classList.add('bg-orange-500');
//     changebutton.innerText = "Track Your Ambulance"
// }

  const handleSignupChange = (e) => {
    // console.log(e);
    // console.log(e.target);
    const { id, value } = e.target; //id and values are teo fields inside the object of event that is 'e', this way is named as destructuring, suppose if we are qriting anythng in the name then the part 'name' is in the id and the thing that we are writing is the value of that specific id
    setSignupData({ ...signupData, [id]: value });
  };

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginData({ ...loginData, [id]: value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URI}/api/v1/doctors/register`, signupData);
      const accessToken = response?.data?.data?.accessToken;
    
      // Store user-specific data in sessionStorage
      sessionStorage.setItem('doctorAccessToken', accessToken);
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
      const response = await axios.post(`${URI}/api/v1/doctors/login`, loginData);
      const accessToken = response?.data?.data?.accessToken;
            
      // Store user-specific data in sessionStorage
      sessionStorage.setItem('doctorAccessToken', accessToken);
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
        <div className="container w-1/2" id="main">
          <div className="sign-up">
            <form onSubmit={handleSignUpSubmit}>
              <p className='mb-4'>Sign Up</p>
              <input className='border mb-2 p-2' id="name" type="text" placeholder="Name*" value={signupData.name} onChange={handleSignupChange} required />
              <input className='border mb-2 p-2' id="email" type="email" placeholder="Email*" value={signupData.email} onChange={handleSignupChange} required />
              <input className='border mb-2 p-2' id="qualification" type="text" placeholder="Department*" value={signupData.department} onChange={handleSignupChange} required />
              <input className='border mb-2 p-2' id="experience" type="text" placeholder="Employee Code*" value={signupData.employee_Code} onChange={handleSignupChange} required />
              <input className='border mb-2 p-2' id="password" type="password" placeholder="Password*" value={signupData.password} onChange={handleSignupChange} required />

            <h2>Add Avatar:</h2>
            <input type="file" onChange={handleChange} />
            <img src={file} />


              <Button className="button pt-2 pb-2 pl-4 pr-4 w-2/4 bg-blue-400 text-white m-2 font-semibold hover:bg-blue-500">Sign Up</Button>
            </form>
          </div>

          <div className="sign-in">
            <form onSubmit={handleLoginSubmit}>
              <p className='mb-4'>Sign In</p>
              <input className='border mb-2 p-2' type="email-login" id="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required />
              <input className='border mb-2 p-2' type="Password" id="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
              <button className="button pt-2 pb-2 pl-4 pr-4 w-2/4 bg-blue-400 text-white m-2 font-semibold hover:bg-blue-400">Sign In</button>
            </form>
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-left">
                <h1 className='mb-5 text-3xl font-semibold'>Already have an account?</h1>
                <button className='pt-2 pb-2 pl-4 pr-4 w-2/4 font-semibold' id="signIn">Sign In</button>
              </div>

              <div className="overlay-right">
                <h1 className='mb-5 text-3xl font-semibold'>New User?</h1>
                <button className='pt-2 pb-2 pl-4 pr-4 w-2/4 font-semibold' id="signUp">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default FacultySISU;
