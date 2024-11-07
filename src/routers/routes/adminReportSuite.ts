import FuelCompanyList from "@/pages/dashboard/admin/fuel/FuelCompanyList";
import ReportSuite from "@/pages/dashboard/admin/reportSuite/ReportSuite";
import UserWiseSalesReportAdmin from "@/pages/dashboard/admin/reportSuite/UserWiseSalesReportAdmin";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const adminReportingSuite: IRouteProps[] = [
  {
    path: "reporting_suite",
    element: React.createElement(ReportSuite),
  },
  {
    path: "user_wise_report",
    element: React.createElement(UserWiseSalesReportAdmin),
  },
  {
    path: "fuel-management",
    element: React.createElement(FuelCompanyList),
  },
];
