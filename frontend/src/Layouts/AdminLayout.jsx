import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import axios from "axios";
import FacultyNavigation from "@/components/NavigationSIdeBar/FacultyNavigation";
import React from "react";
import { Footer } from "@/components";
import LoadingPage from "@/pages/LoadingPage";

import "./loading.css";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import facultyData from "../pages/FacultyPortal/FacultyList/facultyData.json";
import AdminHeader from "@/components/Header/AdminHeader/AdminHeader";
import AdminNavigation from "../components/NavigationSIdeBar/AdminNavigation";

const FacultyLayout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AdminHeader/>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-68 overflow-y-auto">
            <AdminNavigation/>
          </aside>
          <main className="flex-1 flex flex-col overflow-hidden min-h-screen">
            <h1 className="text-xl font-bold text-center p-4">Admin Portal</h1>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              {navigation.state === "loading" ? <LoadingPage /> : <Outlet />}
            </div>
          </main>
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  );
};

export default FacultyLayout;
