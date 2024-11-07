import { LuGitFork, LuListOrdered, LuTarget, LuUsers } from "react-icons/lu";
export interface INavigationLinks {
  icon?: string;
  label: {
    bn: string;
    en: string;
  };
  key: string;
  href: string;
  subLinks?: INavigationLinks[];
}

// USER MANAGEMENT LINKS
export const userManagement = {
  icon: LuUsers,
  label: { bn: "ব্যবহারকারী অ্যাকাউন্ট ব্যবস্থাপনা", en: "User Management" },
  key: "user_management",
  href: "user_management",
  subLinks: [
    {
      icon: LuListOrdered,
      label: { bn: "সদস্য তালিকা", en: "User List" },
      key: "users_list",
      href: "users_list",
    },
    {
      icon: LuGitFork,
      label: { bn: "শাখা তালিকা", en: "Branch List" },
      key: "branch_list",
      href: "branch_list",
    },
    {
      icon: LuTarget,
      label: { bn: "শাখা তালিকা", en: "Branch Targets" },
      key: "branch_targets",
      href: "branch_targets",
    },
  ],
};

export const navigationLinks = [{ ...userManagement }];

// Define the type for the locale
type Locale = "bn" | "en";

// Ensure PUBLIC_NAVIGATION_LINKS has the correct structure
export const publicNavigationLinks: Record<
  Locale,
  { icon: any; label: string; key: string; href: string }[]
> = {
  bn: [
    {
      icon: LuTarget,
      label: "হোম",
      key: "/",
      href: "/",
    },
    {
      icon: LuTarget,
      label: "সেবা",
      key: "/services",
      href: "/seervices",
    },

    {
      icon: LuTarget,
      label: "আমাদের সম্পর্কে",
      key: "/about_us",
      href: "/about_us",
    },
    {
      icon: LuTarget,
      label: "গমনপথ",
      key: "/route",
      href: "/route",
    },
    {
      icon: LuTarget,
      label: "বিজ্ঞপ্তি",
      key: "/notice",
      href: "/notice",
    },
    {
      icon: LuTarget,
      label: "ব্লগ",
      key: "/blog",
      href: "/blog",
    },
    {
      icon: LuTarget,
      label: "যোগাযোগ",
      key: "/contact",
      href: "/contact",
    },
    {
      icon: LuTarget,
      label: "টিকিট খুঁজুন",
      key: "/search_tickit",
      href: "/search_tickit",
    },
  ],
  en: [
    {
      icon: LuTarget,
      label: "Home",
      key: "/",
      href: "/",
    },
    {
      icon: LuTarget,
      label: "services",
      key: "/services",
      href: "/services",
    },

    {
      icon: LuTarget,
      label: "About us",
      key: "/about_us",
      href: "/about_us",
    },
    {
      icon: LuTarget,
      label: "Route",
      key: "/route",
      href: "/route",
    },
    {
      icon: LuTarget,
      label: "Notice",
      key: "/notice",
      href: "/notice",
    },
    {
      icon: LuTarget,
      label: "Blog",
      key: "/blog",
      href: "/blog",
    },
    {
      icon: LuTarget,
      label: "Contact",
      key: "/contact",
      href: "/contact",
    },
    {
      icon: LuTarget,
      label: "Find Tickit",
      key: "/search_tickit",
      href: "/search_tickit",
    },
  ],
};
