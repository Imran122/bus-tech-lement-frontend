import { IconType } from "react-icons/lib";
import {
  LuAlignStartVertical,
  LuArmchair,
  LuArrowDownUp,
  LuArrowRightFromLine,
  LuBadgeDollarSign,
  LuBarChart2,
  LuBarChartHorizontal,
  LuBell,
  LuBookOpen,
  LuBriefcase,
  LuBus,
  LuCalendar,
  LuCar,
  LuCircleDollarSign,
  LuClipboardList,
  LuContact2,
  LuCreditCard,
  LuDollarSign,
  LuGlobe,
  LuInfo,
  // LuLayers,
  LuListOrdered,
  LuMerge,
  LuReceipt,
  LuSettings,
  LuShield,
  LuTag,
  LuUser,
  LuUserCheck,
  LuUserCircle,
  LuUserCog,
} from "react-icons/lu";

export interface INavigationLinks {
  icon?: IconType;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href: string;
  subLinks?: INavigationLinks[];
}

// CONTACTS LINKS

const dashboardRootLinks = {
  icon: LuContact2,
  label: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  key: "dashboard",
  href: "dashboard",
  subLinks: [
    {
      icon: LuUserCog,
      label: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
      key: "dashboard",
      href: "dashboard",
    },
  ],
};
const contactsManagementLinks = {
  icon: LuContact2,
  label: { bn: "ব্যবহারকারীর ব্যবস্থাপনা", en: "User Management" },
  key: "user_management",
  href: "user_management",
  subLinks: [
    {
      icon: LuUserCog,
      label: { bn: "ব্যবহারকারীর তালিকা", en: "User List" },
      key: "user_list",
      href: "user_list",
    },
    {
      icon: LuUserCheck,
      label: { bn: "ড্রাইভার তালিকা", en: "Driver List" },
      key: "driver_list",
      href: "driver_list",
    },
    {
      icon: LuUserCheck,
      label: { bn: "সাহায্যকারী তালিকা", en: "Helper List" },
      key: "helper_list",
      href: "helper_list",
    },
    {
      icon: LuUserCheck,
      label: { bn: "কাউন্টার তালিকা", en: "Counter List" },
      key: "counter_list",
      href: "counter_list",
    },
    {
      icon: LuUserCheck,
      label: { bn: "অনুমতি তালিকা", en: "Permission List" },
      key: "permission_list",
      href: "permission_list",
    },
    {
      icon: LuUserCheck,
      label: { bn: "ভূমিকা", en: "Role" },
      key: "role",
      href: "role",
    },
  ],
};

// VEHICLES & SCHEDULE MANAGEMENT
const vehicleAndScheduleManagementLinks = {
  icon: LuCar,
  label: {
    bn: "যানবাহন এবং সময়সূচী",
    en: "Vehicle and Schedule",
  },
  key: "vehicle_schedule",
  href: "vehicle_schedule",
  subLinks: [
    {
      icon: LuMerge,
      label: { bn: "স্টেশনের তালিকা ", en: "Station List" },
      key: "station_list",
      href: "station_list",
    },
    {
      icon: LuDollarSign,
      label: { bn: "ভাড়ার তালিকা ", en: "Fare List" },
      key: "fare_list",
      href: "fare_list",
    },

    {
      icon: LuMerge,
      label: { bn: "রুট তালিকা", en: "Route List" },
      key: "route_list",
      href: "route_list",
    },
    {
      icon: LuBus,
      label: { bn: "সময়সূচী তালিকা", en: "Schedule List" },
      key: "schedule_list",
      href: "schedule_list",
    },
    {
      icon: LuArmchair,
      label: { bn: "যানবাহন তালিকা ", en: "Vehicle List" },
      key: "vehicle_list",
      href: "vehicle_list",
    },
    {
      icon: LuUserCheck,
      label: { bn: "কোচ তালিকা", en: "Coach List" },
      key: "coach_list",
      href: "coach_list",
    },
    {
      icon: LuUserCheck,
      label: { bn: "কোচ কনফিগস", en: "Coach Configs" },
      key: "coach_configs",
      href: "coach_configs",
    },
  ],
};

// FINANCE MANAGEMENT LIST
const financialManagementLinks = {
  icon: LuCircleDollarSign,
  label: { bn: "আর্থিক ব্যবস্থাপনা", en: "Financial Management" },
  key: "financial",
  href: "financial",
  subLinks: [
    {
      icon: LuListOrdered,
      label: { bn: "অ্যাকাউন্ট তালিকা", en: "Account List" },
      key: "account_list",
      href: "account_list",
    },
    {
      icon: LuBriefcase,
      label: {
        bn: "অংশীদারদের তালিকা",
        en: "Partners List",
      },
      key: "partner_list",
      href: "partner_list",
    },
    {
      icon: LuArrowDownUp,
      label: { bn: "অর্থ তালিকা", en: "Finance List" },
      key: "finance_list",
      href: "finance_list",
    },
    {
      icon: LuBarChartHorizontal,
      label: { bn: "ব্যালান্স শীট", en: "Balance Sheet" },
      key: "balance_sheet",
      href: "balance_sheet",
    },
    {
      icon: LuBarChart2,
      label: { bn: "নগদ প্রবাহ", en: "Cash Flow" },
      key: "cash_flow",
      href: "cash_flow",
    },
  ],
};

// EXPENDITURE MANAGEMENT LIST
const expenditureManagementLinks = {
  icon: LuArrowRightFromLine,
  label: { bn: "ব্যয় ব্যবস্থাপনা", en: "Expenditure Management" },
  key: "expenditure",
  href: "expenditure",
  subLinks: [
    {
      icon: LuListOrdered,
      label: { bn: "ব্যয় তালিকা", en: "Expense List" },
      key: "expense_list",
      href: "expense_list",
    },
    {
      icon: LuAlignStartVertical,
      label: { bn: "ব্যয় বিভাগ", en: "Expense Category" },
      key: "expense_category_list",
      href: "expense_category_list",
    },
    // {
    //   icon: LuLayers,
    //   label: { bn: "ব্যয়ের উপবিভাগ", en: "Expense Sub-category" },
    //   key: "expense_subcategory_list",
    //   href: "expense_subcategory_list",
    // },
  ],
};
const FulelManagementLinks = {
  icon: LuCircleDollarSign,
  label: {
    bn: "জ্বালানী ব্যবস্থাপনা",
    en: "Fule Management",
  },
  key: "fuel-management",
  href: "fuel-management",
  subLinks: [
    {
      icon: LuListOrdered,
      label: {
        bn: "জ্বালানী ব্যবস্থাপনা",
        en: "Fuel Management",
      },
      key: "fuel-management",
      href: "fuel-management",
    },
    {
      icon: LuBriefcase,
      label: {
        bn: "জ্বালানী বিক্রয় সারাংশ",
        en: "Fule Sales Summary",
      },
      key: "fuel-sales-summary",
      href: "fuel-sales-summary",
    },
  ],
};
// DETAILS REPORTS LIST
const reportingSuiteLinks = {
  icon: LuClipboardList,
  label: { bn: "রিপোর্টিং স্যুট", en: "Reporting Suite" },
  key: "reporting_suite",
  href: "reporting_suite",
  subLinks: [
    {
      icon: LuBadgeDollarSign,
      label: { bn: "আজকের প্রতিবেদন", en: "Today's Report" },
      key: "reporting_suite",
      href: "reporting_suite",
    },
    {
      icon: LuBadgeDollarSign,
      label: {
        bn: "ব্যবহারকারী অনুজয়ে বিক্রয় প্রতিবেদন",
        en: "User Wise Sales Report",
      },
      key: "user_wise_report",
      href: "user_wise_report",
    },
    {
      icon: LuCreditCard,
      label: { bn: "পেমেন্ট প্রতিবেদন", en: "Payment Report" },
      key: "payment_report",
      href: "payment_report",
    },
    {
      icon: LuReceipt,
      label: { bn: "ব্যয় প্রতিবেদন", en: "Expense Report" },
      key: "expense_report",
      href: "expense_report",
    },
    {
      icon: LuCalendar,
      label: { bn: "ডে-বুক প্রতিবেদন", en: "Daybook Report" },
      key: "daybook_report",
      href: "daybook_report",
    },
    {
      icon: LuUserCircle,
      label: { bn: "বিনিয়োগকারী প্রতিবেদন", en: "Investor Report" },
      key: "investor_report",
      href: "investor_report",
    },
  ],
};

const settingsLinks = {
  icon: LuSettings,
  label: { bn: "সেটিংস", en: "Settings" },
  key: "settings",
  href: "settings",
  subLinks: [
    {
      icon: LuUser,
      label: { bn: "ব্যবহারকারী সেটিংস", en: "User Settings" },
      key: "user_settings",
      href: "user_settings",
    },
    {
      icon: LuShield,
      label: { bn: "নিরাপত্তা সেটিংস", en: "Security Settings" },
      key: "security_settings",
      href: "security_settings",
    },
    {
      icon: LuBell,
      label: { bn: "বিজ্ঞপ্তি সেটিংস", en: "Notification Settings" },
      key: "notification_settings",
      href: "notification_settings",
    },
    {
      icon: LuGlobe,
      label: { bn: "ভাষা সেটিংস", en: "Language Settings" },
      key: "language_settings",
      href: "language_settings",
    },
    {
      icon: LuInfo,
      label: { bn: "অ্যাপ্লিকেশন তথ্য", en: "Application Info" },
      key: "application_info",
      href: "application_info",
    },
    {
      icon: LuBookOpen,
      label: { bn: "পরিচিতি", en: "About" },
      key: "about",
      href: "about",
    },
    {
      icon: LuTag,
      label: { bn: "সংস্করণ", en: "Version" },
      key: "version",
      href: "version",
    },
  ],
};

export const adminNavigationLinks = [
  // CONTACT LINKS
  { ...dashboardRootLinks },
  { ...contactsManagementLinks },
  // VEHICLES & SCHEDULE MANAGEMENT
  { ...vehicleAndScheduleManagementLinks },

  // FINANCE MANAGEMENT LINKS
  { ...financialManagementLinks },
  // EXPENDITURE MANAGEMENT LINKS
  { ...expenditureManagementLinks },
  // REPORTS SUITE LINKS
  { ...reportingSuiteLinks },
  { ...FulelManagementLinks },
  // SETTINGS LINKS
  { ...settingsLinks },
];
