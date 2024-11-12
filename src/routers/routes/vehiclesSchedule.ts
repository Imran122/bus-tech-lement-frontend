import CoachList from "@/pages/dashboard/vehiclesSchedule/coach/CoachList";
import CoachConfigurationList from "@/pages/dashboard/vehiclesSchedule/coach/configuration/CoachConfigurationList";
import FareList from "@/pages/dashboard/vehiclesSchedule/fare/FareList";
import RouteList from "@/pages/dashboard/vehiclesSchedule/route/RouteList";
import ScheduleList from "@/pages/dashboard/vehiclesSchedule/schedule/ScheduleList";
import SeatList from "@/pages/dashboard/vehiclesSchedule/seat/SeatList";
import StationList from "@/pages/dashboard/vehiclesSchedule/station/StationList";
import VehiclesList from "@/pages/dashboard/vehiclesSchedule/vehicles/VehiclesList";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const vehiclesSchedule: IRouteProps[] = [
  {
    path: "coach_list",
    element: React.createElement(CoachList),
  },
  {
    path: "schedule_list",
    element: React.createElement(ScheduleList),
  },

  {
    path: "vehicles_list",
    element: React.createElement(VehiclesList),
  },
  {
    path: "route_list",
    element: React.createElement(RouteList),
  },
  {
    path: "station_list",
    element: React.createElement(StationList),
  },
  {
    path: "coach_configs",
    element: React.createElement(CoachConfigurationList),
  },

  {
    path: "fare_list",
    element: React.createElement(FareList),
  },
  {
    path: "seat_list",
    element: React.createElement(SeatList),
  },
];
