import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useAppContext } from "@/utils/hooks/useAppContext";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { LuUserCircle } from "react-icons/lu";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  ISupervisorNavigationLinks,
  supervisorNavigationLinks,
} from "@/utils/constants/common/supervisor/supervisorNavigationLinks";
import PageTransition from "../../effect/PageTransition";
import { Label } from "../../typography/Label";
import LocaleSwitcher from "../LocaleSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import SupervisorDashboardSidebarSmallDevices from "./SupervisorDashboardSidebarSmallDevices";
interface ISupervisorDashboardUpperNavigationProps {}

const SupervisorDashboardUpperNavigation: FC<
  ISupervisorDashboardUpperNavigationProps
> = () => {
  const location = useLocation();
  const { route } = useAppContext();
  const { translate } = useCustomTranslator();
  const { role, avatar } = shareAuthentication();
  const subNavigation = supervisorNavigationLinks?.find(
    (singleSubNavigation: ISupervisorNavigationLinks) =>
      singleSubNavigation.key === route
  ) as any;

  return (
    <header className="sticky !h-14 !bg-muted/30 backdrop-blur-md !w-[98.7%] ml-[13px] rounded-md top-[7px] z-30 flex items-center gap-4 !px-2 sm:border-0 sm:bg-transparent transition-all  duration-300">
      {/* DASHBOARD SIDEBAR FOR SMALL DEVICES */}
      <SupervisorDashboardSidebarSmallDevices />
      {/* NAVIGATION LINKS */}

      <nav className="justify-between w-full flex">
        <ul className="hidden lg:flex gap-x-2 items-center">
          {subNavigation?.subLinks?.length > 0 &&
            subNavigation?.subLinks?.map(
              (singleNav: ISupervisorNavigationLinks, navIndex: number) => (
                <li key={navIndex}>
                  <PageTransition>
                    <NavLink
                      to={"/" + role + "/" + singleNav.href}
                      className={({ isActive, isPending }) =>
                        isPending
                          ? "pending"
                          : isActive
                          ? "active_link"
                          : "inactive_link"
                      }
                    >
                      <Label className="cursor-pointer" size="sm">
                        {translate(singleNav.label.bn, singleNav.label.en)}
                      </Label>
                    </NavLink>
                  </PageTransition>
                </li>
              )
            )}
        </ul>
        <ul className="flex gap-x-2 items-center">
          <li className="flex gap-1 items-center">
            Language
            <LocaleSwitcher />
          </li>
          <li>
            <ThemeSwitcher />
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="size-9" variant="ghost" size="icon">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="overflow-hidden rounded-full size-5 border"
                    />
                  ) : (
                    <LuUserCircle className="size-[22px]" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {translate("আমার প্রোফাইল", "My Account")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className={cn(
                    location.pathname.includes("profile") &&
                      "bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                >
                  <Link to={"../" + role + "/profile"}>
                    {translate("প্রোফাইল", "Profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={"/"}>{translate("হোম", "Home")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default SupervisorDashboardUpperNavigation;
