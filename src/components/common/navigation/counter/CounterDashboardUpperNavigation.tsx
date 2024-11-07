/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import { ITickitBookingStateProps } from "@/pages/dashboard/counterRole/tickit/TickitBooking";
import TickitSearchDashboard from "@/pages/dashboard/counterRole/tickit/TickitSearchDashboard";
import {
  selectCounterSearchFilter,
  setCoachType,
  setDate,
  setDestinationCounterId,
  setFromCounterId,
  setSchedule,
} from "@/store/api/counter/counterSearchFilterSlice";
import {
  counterNavigationLinks,
  ICounterNavigationLinks,
} from "@/utils/constants/common/counter/counterNavigationLinks";
import { useDispatch, useSelector } from "react-redux";
import PageTransition from "../../effect/PageTransition";
import { Label } from "../../typography/Label";
import LocaleSwitcher from "../LocaleSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import CounterDashboardSidebarSmallDevices from "./CounterDashboardSidebarSmallDevices";
interface ICounterDashboardUpperNavigationProps {}
// types.ts

const CounterDashboardUpperNavigation: FC<
  ICounterDashboardUpperNavigationProps
> = () => {
  const location = useLocation();
  const { route } = useAppContext();
  const { translate } = useCustomTranslator();
  const { role, avatar } = shareAuthentication();
  const subNavigation = counterNavigationLinks?.find(
    (singleSubNavigation: ICounterNavigationLinks) =>
      singleSubNavigation.key === route
  ) as any;
  const dispatch = useDispatch();

  const bookingState = useSelector(selectCounterSearchFilter);

  const setBookingState = (newState: Partial<ITickitBookingStateProps>) => {
    if (newState.fromCounterId !== undefined) {
      dispatch(setFromCounterId(newState.fromCounterId));
    }
    if (newState.destinationCounterId !== undefined) {
      dispatch(setDestinationCounterId(newState.destinationCounterId));
    }
    if (newState.schedule !== undefined) {
      dispatch(setSchedule(newState.schedule));
    }
    if (newState.coachType !== undefined) {
      dispatch(setCoachType(newState.coachType));
    }
    if (newState.date !== undefined) {
      //@ts-ignore
      dispatch(setDate(newState.date));
    }
  };
  console.log("@navbar seelctdata@", bookingState);
  return (
    <header className="sticky !h-14 !bg-muted/30 backdrop-blur-md !w-[98.7%] ml-[13px] rounded-md top-[7px] z-30 flex items-center gap-4 !px-2 sm:border-0 sm:bg-transparent transition-all  duration-300">
      {/* DASHBOARD SIDEBAR FOR SMALL DEVICES */}
      <CounterDashboardSidebarSmallDevices />
      {/* NAVIGATION LINKS */}

      <nav className="justify-between w-full items-center flex">
        <ul className="hidden lg:flex gap-x-2 items-center">
          {subNavigation?.subLinks?.length > 0 &&
            subNavigation?.subLinks?.map(
              (singleNav: ICounterNavigationLinks, navIndex: number) => (
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

        <ul className="pt-9">
          <li>
            <TickitSearchDashboard
              bookingState={bookingState}
              setBookingState={setBookingState}
            />
          </li>
        </ul>

        <ul className="flex gap-x-2 items-center">
          <li>
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

export default CounterDashboardUpperNavigation;
