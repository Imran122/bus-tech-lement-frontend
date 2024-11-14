import AboutUs from "@/pages/public/AboutUs";
import Blog from "@/pages/public/Blog";
import Contact from "@/pages/public/Contact";
import FindTickit from "@/pages/public/FindTickit";
import Home from "@/pages/public/Home";
import Login from "@/pages/public/Login";
import Notice from "@/pages/public/Notice";
import PaymentCancel from "@/pages/public/PaymentCancel";
import PaymentFailed from "@/pages/public/PaymentFailed";
import PaymentSuccess from "@/pages/public/PaymentSuccess";
import ResetPassword from "@/pages/public/ResetPassword";
import Route from "@/pages/public/Route";
import BoookingFormRoundTripPublic from "@/sections/home/BoookingFormRoundTripPublic";
import React from "react";
import { IRouteProps } from "./contacts";

export const publicRoutes: IRouteProps[] = [
  {
    path: "/",
    element: React.createElement(Home),
  },
  {
    path: "home",
    element: React.createElement(Home),
  },
  {
    path: "login",
    element: React.createElement(Login),
  },
  {
    path: "reset-password",
    element: React.createElement(ResetPassword),
  },
  {
    path: "about_us",
    element: React.createElement(AboutUs),
  },
  {
    path: "search_tickit",
    element: React.createElement(FindTickit),
  },
  {
    path: "route",
    element: React.createElement(Route),
  },
  {
    path: "notice",
    element: React.createElement(Notice),
  },
  {
    path: "blog",
    element: React.createElement(Blog),
  },
  {
    path: "contact",
    element: React.createElement(Contact),
  },
  {
    path: "payment-success/:transactionDetails",
    element: React.createElement(PaymentSuccess),
  },
  {
    path: "payment-failed",
    element: React.createElement(PaymentFailed),
  },
  {
    path: "payment-canceled",
    element: React.createElement(PaymentCancel),
  },
  {
    path: "public-seat-form",
    element: React.createElement(BoookingFormRoundTripPublic),
  },
];
