import { IconType } from "react-icons/lib";
import {
  LuBell,
  LuBookOpen,
  LuBriefcase,
  LuCircleDollarSign,
  LuContact2,
  LuGlobe,
  LuInfo,
  // LuLayers,
  LuListOrdered,
  LuSettings,
  LuShield,
  LuTag,
  LuUser,
  LuUserCog,
} from "react-icons/lu";

export interface ISupervisorNavigationLinks {
  icon?: IconType;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href: string;
  subLinks?: ISupervisorNavigationLinks[];
}
const superviosrDashboardRootLinks = {
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
const supervisorManagementLinks = {
  icon: LuCircleDollarSign,
  label: {
    bn: "সুপারভাইজার ব্যবস্থাপনা",
    en: "Supervisor Management",
  },
  key: "supervisor-management",
  href: "supervisor-management",
  subLinks: [
    {
      icon: LuListOrdered,
      label: {
        bn: "সুপারভাইজার ক্রয়-বিক্রয় ব্যবস্থাপনা",
        en: "Supervisor Sales Management",
      },
      key: "supervisor-management",
      href: "supervisor-management",
    },
  ],
};
const superviosorReportLinks = {
  icon: LuCircleDollarSign,
  label: {
    bn: "সুপারভাইজার রিপোর্ট",
    en: "Supervisor Report",
  },
  key: "supervisor-report",
  href: "supervisor-report",
  subLinks: [
    {
      icon: LuListOrdered,
      label: {
        bn: "সুপারভাইজার রিপোর্ট",
        en: "Supervisor Report",
      },
      key: "supervisor-report",
      href: "supervisor-report",
    },
  ],
};

const expenseManagementLinks = {
  icon: LuCircleDollarSign,
  label: {
    bn: "ব্যয় ব্যবস্থাপনা",
    en: "Expense Management",
  },
  key: "expense-management",
  href: "expense-management",
  subLinks: [
    {
      icon: LuBriefcase,
      label: {
        bn: "ব্যয় বিভাগ",
        en: "Expense Categorey",
      },
      key: "expense-categorey",
      href: "expense-categorey",
    },
    {
      icon: LuListOrdered,
      label: {
        bn: "ব্যয় ব্যবস্থাপনা",
        en: "Expense Management",
      },
      key: "expense-management",
      href: "expense-management",
    },
  ],
};
// DETAILS REPORTS LIST

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

export const supervisorNavigationLinks = [
  { ...superviosrDashboardRootLinks },
  { ...supervisorManagementLinks },
  { ...superviosorReportLinks },

  { ...expenseManagementLinks },
  { ...settingsLinks },
];
