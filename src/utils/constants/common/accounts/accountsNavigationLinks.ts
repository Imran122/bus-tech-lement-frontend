import { IconType } from "react-icons/lib";
import {
  LuBell,
  LuBookOpen,
  LuBriefcase,
  LuBus,
  LuCar,
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
  LuUserCheck,
  LuUserCog,
} from "react-icons/lu";
import { INavigationLinks } from "../dashboardSidebarNavigation";

export interface IAccountsNavigationLinks {
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
const accountDashboardRootLinks = {
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
// VEHICLES & SCHEDULE MANAGEMENT
const accountsManagementLinks = {
  icon: LuCar,
  label: {
    bn: "হিসাব ব্যবস্থাপনা",
    en: "accounts_management",
  },
  key: "accounts_management",
  href: "accounts_management",
  subLinks: [
    {
      icon: LuBus,
      label: { bn: "হিসাব ব্যবস্থাপনা", en: "Accounts Management" },
      key: "accounts_management",
      href: "accounts_management",
    },
    {
      icon: LuUserCheck,
      label: { bn: "কোচ তালিকা", en: "Coach List" },
      key: "coach_list",
      href: "coach_list",
    },
  ],
};
const collectionManagementLinks = {
  icon: LuCircleDollarSign,
  label: { bn: "সংগ্রহ ব্যবস্থাপনা", en: "Collection Management" },
  key: "collection_management",
  href: "collection_management",
  subLinks: [
    {
      icon: LuListOrdered,
      label: { bn: "সংগ্রহ ব্যবস্থাপনা", en: "Collection Management" },
      key: "collection_management",
      href: "collection_management",
    },
    {
      icon: LuBriefcase,
      label: {
        bn: "সংগ্রহ সারাংশ",
        en: "Collection Summary",
      },
      key: "collection-summary",
      href: "collection-summary",
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

export const accountsNavigationLinks = [
  // CONTACT LINKS
  { ...accountDashboardRootLinks },
  // VEHICLES & SCHEDULE MANAGEMENT
  { ...accountsManagementLinks },
  { ...collectionManagementLinks },
  // FINANCE MANAGEMENT LINKS

  // EXPENDITURE MANAGEMENT LINKS

  // SETTINGS LINKS
  { ...settingsLinks },
];
