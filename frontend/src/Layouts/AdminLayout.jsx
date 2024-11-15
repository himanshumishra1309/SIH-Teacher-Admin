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
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1">
        <div className="flex h-full">
          <AdminNavigation />
          <main className="flex-1 p-4">
            <h1 className="text-xl font-bold m-2 text-center">Admin Portal</h1>
            {navigation.state === "loading" ? <LoadingPage /> : <Outlet />}
          </main>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FacultyLayout;
