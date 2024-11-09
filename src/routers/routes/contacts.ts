import CounterList from "@/pages/dashboard/contacts/counter/CounterList";
import DriverList from "@/pages/dashboard/contacts/driver/DriverList";
import PermissionTypeAndUserPermissionList from "@/pages/dashboard/contacts/user/PermissionTypeAndUserPermissionList";
import Role from "@/pages/dashboard/contacts/user/role/Role";
import UserList from "@/pages/dashboard/contacts/user/UserList";
import UserProfile from "@/pages/dashboard/contacts/user/UserProfile";
import CoachList from "@/pages/dashboard/vehiclesSchedule/coach/CoachList";
import RouteList from "@/pages/dashboard/vehiclesSchedule/route/RouteList";
import ScheduleList from "@/pages/dashboard/vehiclesSchedule/schedule/ScheduleList";
import VehiclesList from "@/pages/dashboard/vehiclesSchedule/vehicles/VehiclesList";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const contactsRoutes: IRouteProps[] = [
  {
    path: "driver_list",
    element: React.createElement(DriverList),
  },
  {
    path: "user_list",
    element: React.createElement(UserList),
  },
  {
    path: "permission_list",
    element: React.createElement(PermissionTypeAndUserPermissionList),
  },
  {
    path: "coach_list",
    element: React.createElement(CoachList),
  },
  {
    path: "schedule_list",
    element: React.createElement(ScheduleList),
  },
  {
    path: "counter_list",
    element: React.createElement(CounterList),
  },
  {
    path: "vehicle_list",
    element: React.createElement(VehiclesList),
  },
  {
    path: "route_list",
    element: React.createElement(RouteList),
  },
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
  {
    path: "role",
    element: React.createElement(Role),
  },
];
