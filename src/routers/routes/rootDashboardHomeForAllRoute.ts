import AccountDashboardHome from "@/pages/dashboard/accountsRole/accountDashboardHome/AccountDashboardHome";
import AdminDashboardHome from "@/pages/dashboard/admin/AdminDashboardHome";
import CounterDashboardHome from "@/pages/dashboard/counterRole/counterHome/CounterDashboardHome";
import SupervisorDashboardHome from "@/pages/dashboard/supervisor/SupervisorDashboardHome";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const rootDasboardHomeRoutesAll: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(AdminDashboardHome),
  },
];
export const rootCounterDasboardHomeRoutesAll: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(CounterDashboardHome),
  },
];
export const rootSupervisorDashboardHome: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(SupervisorDashboardHome),
  },
];
export const rootAccountsDashboardHome: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(AccountDashboardHome),
  },
];
