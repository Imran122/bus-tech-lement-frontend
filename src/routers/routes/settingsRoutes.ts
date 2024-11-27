import React from "react";
import { IRouteProps } from "./contacts";
import SliderList from "@/pages/dashboard/admin/slider/SliderList";
import AddContentManagement from "@/pages/dashboard/admin/ContentManagement/AddContentManagement";
import AboutUsList from "@/pages/dashboard/admin/aboutUs/AboutUsList";

export const settingsRoutes: IRouteProps[] = [
  {
    path: "cms",
    element: React.createElement(AddContentManagement),
  },
  {
    path: "slider_list",
    element: React.createElement(SliderList),
  },
  {
    path:"aboutus_list",
    element: React.createElement(AboutUsList)
  }

];
