import AccountDashboardHome from "@/pages/dashboard/accountsRole/accountDashboardHome/AccountDashboardHome";
import AdminDashboardHome from "@/pages/dashboard/admin/AdminDashboardHome";
import CancelTicketRequestList from "@/pages/dashboard/admin/cancelRequest/CancelTicketRequestList";
import AddFuelPayment from "@/pages/dashboard/admin/fuel/AddFuelPayment";
import CounterWiseReport from "@/pages/dashboard/counterRole/counter-wise-report/CounterWiseReport";
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
  {
    path: "today_cancel_request",
    element: React.createElement(CancelTicketRequestList),
  },
  {
    path: "due_payment",
    element: React.createElement(AddFuelPayment),
  },
];
export const rootCounterDasboardHomeRoutesAll: IRouteProps[] = [
  {
    path: "dashboard",
    element: React.createElement(CounterDashboardHome),
  },
  {
    path: "coach-wise-report",
    element: React.createElement(CounterWiseReport),
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
