import React from "react";
import { IRouteProps } from "./contacts";
import SliderList from "@/pages/dashboard/admin/slider/SliderList";

export const settingsRoutes: IRouteProps[] = [
  {
    path: "slider_list",
    element: React.createElement(SliderList),
  },

];
