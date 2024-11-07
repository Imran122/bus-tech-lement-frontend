import AccountsManagement from "@/pages/dashboard/accountsRole/accountsManagement/AccountsManagement";
import CollectionList from "@/pages/dashboard/accountsRole/collectionManagement/CollectionList";
import UserProfile from "@/pages/dashboard/contacts/user/UserProfile";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const accountsAllLink: IRouteProps[] = [
  {
    path: "profile",
    element: React.createElement(UserProfile),
  },
  {
    path: "accounts_management",
    element: React.createElement(AccountsManagement),
  },
  {
    path: "collection_management",
    element: React.createElement(CollectionList),
  },
];
