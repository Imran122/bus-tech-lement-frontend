import AccountsManagement from "@/pages/dashboard/accountsRole/accountsManagement/AccountsManagement";
import CollectionList from "@/pages/dashboard/accountsRole/collectionManagement/CollectionList";
import AccountsExpenseCategoryList from "@/pages/dashboard/accountsRole/expenseManagement/expenseCategorey/AccountsExpenseCategoryList";
import AccountantExpenseSubCategoreyList from "@/pages/dashboard/accountsRole/expenseManagement/expenseSubCategorey/AccountantExpenseSubCategoreyList";
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
    path: "expense_category_account",
    element: React.createElement(AccountsExpenseCategoryList),
  },
  {
    path: "expense_sub_category_account",
    element: React.createElement(AccountantExpenseSubCategoreyList),
  },
  {
    path: "collection_management",
    element: React.createElement(CollectionList),
  },
];
