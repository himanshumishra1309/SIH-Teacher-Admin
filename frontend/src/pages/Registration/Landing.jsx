import React from 'react'
import {Header, Footer} from '@/components'
import { Button } from 'react-day-picker'
import {useState} from 'react'
import { Tab } from '@headlessui/react';

const Landing = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );

  const Input = ({ id, type, placeholder, required }) => (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );

  const Button = ({ type, className, children }) => (
    <button type={type} className={`px-4 py-2 rounded-md ${className}`}>
      {children}
    </button>
  );
  
  return (
    <div>
      <Header/>
      <div className="flex flex-row gap-x-64 px-20 py-16 bg-cover bg-center z-50 relative" style={{ backgroundImage: "url('./assets/icons/section1.jpg')" }}>{/*Section 1*/}
        <div className="flex flex-col gap-y-6 max-w-[600px] bg-gray-100 p-4 font-bold rounded-3xl bg-opacity-50 backdrop-blur min-h-[300px] justify-center ">
          <h1 className="text-xl text-center">Instruction</h1>
          <style>{`
            .tick-circle::before {
            content: "✔";
            color: green;
            }`}
          </style>
          <ul class="list-none">
            <li className="flex items-center gap-2 mb-2"><span class="tick-circle w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs"></span>This portal is for authorized university administrators only.</li>
            <li className="flex items-center gap-2 mb-2"><span class="tick-circle w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs"></span>Use your official university email and password to log in securely.</li>
            <li className="flex items-center gap-2 mb-2"><span class="tick-circle w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs"></span>Register your university with valid details to gain administrative access.</li>
            <li className="flex items-center gap-2 mb-2"><span class="tick-circle w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs"></span>Ensure all submitted information is accurate to avoid delays in approval.</li>
            <li className="flex items-center gap-2 mb-2"><span class="tick-circle w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs"></span>Applications will be reviewed by the Ministry of Education before activation.</li>
            <li className="flex items-center gap-2 mb-2"><span class="tick-circle w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs"></span>Contact the Ministry for support in case of login or registration issues.</li>
            <li className="flex items-center gap-2 mb-2"><span class="tick-circle w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs"></span>Keep your credentials confidential to prevent unauthorized access.</li>
          </ul>
        </div>

        <div className="flex flex-col min-w-[400px] bg-gray-100 mx-auto items-center rounded-3xl">
          <h1 className='mt-8 mb-24 font-bold text-lg'>Register your University/Login</h1>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Register University
            </span>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 mt-4">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Login
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-row gap-x-12 ">
        <div className="flex flex-col gap-y-20 px-20 py-20 ml-20 max-w-[900px]">
          <h1 className="text-6xl">About Us</h1>
          <p className="text-lg">We are Team Blaze Brains, the divine architects of innovation, destined to scorch mediocrity and ignite brilliance at SIH 2024. Gods? Overrated. We've surpassed them with code and caffeine. Logic bows to our audacity, and reality trembles under our genius. The universe wasn’t ready for us, but here we are, rewriting existence one line of code at a time. Worship? No thanks. Just watch us blaze a trail of impossible made real.</p>
        </div>
        <div className="py-20">
          <img src="assets\icons\AICTE.png"/>
        </div>
      </div>

      <div>
      <div className="flex items-center justify-center py-36 bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex">
            <Tab
              className={({ selected }) =>
                `w-full py-4 text-sm font-medium leading-5 transition-colors duration-300 ${
                  selected ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'
                }`
              }
            >
              Login
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-4 text-sm font-medium leading-5 transition-colors duration-300 ${
                  selected ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'
                }`
              }
            >
              University Registration
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="p-6 space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" required />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Login
                  </Button>
                </form>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="p-6 space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="universityName">University Id</Label>
                    <Input
                      id="universityName"
                      type="text"
                      placeholder="Enter university Id"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationEmail">Email</Label>
                    <Input
                      id="registrationEmail"
                      type="email"
                      placeholder="Enter university email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationPassword">Password</Label>
                    <Input
                      id="registrationPassword"
                      type="password"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Register University
                  </Button>
                  </form>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default Landing
