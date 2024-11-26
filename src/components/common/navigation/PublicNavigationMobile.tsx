import { useEffect, useState } from "react";
import logobangla from "../../../assets/logobangla.png";
import logo from "../../../assets/longeng.png";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { publicNavigationLinks } from "@/utils/constants/common/publicNavigation";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { shareWithCookies } from "@/utils/helpers/shareWithCookies";
import SidebarSlide from "./SidebarSlide";
import { motion } from "framer-motion";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LuUserCircle } from "react-icons/lu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const PublicNavigationMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };
  const { locale } = useLocaleContext();
  const navigate = useNavigate();
  const { translate, locale: language } = useCustomTranslator();
  const { email, role } = shareAuthentication();
  const publicLinks = publicNavigationLinks[locale] as any;
  const { avatar } = shareAuthentication();

  const [selected, setSelected] = useState(publicLinks[0].key);

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    window.addEventListener("scroll", () => setScrollY(window.scrollY));
    return () => {
      window.removeEventListener("scroll", () => setScrollY(window.scrollY));
    };
  }, []);
  // LOGOUT HANDLER
  const handleLogout = async () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <>
      <div
        className={`w-full bg-gradient-to-tr from-primary/5 to-tertiary/5 duration-1000 py-1.5 fixed left-0 top-8  z-50 transition-all ${
          scrollY > 0 && "bg-white"
        }`}
      >
        <div className="flex justify-between items-center px-5">
          <div>
            {language === "en" ? (
              <img className="h-[60px]" src={logo} alt="logo" />
            ) : (
              <img className="h-[60px]" src={logobangla} alt="logo" />
            )}
          </div>
          <ul className="flex justify-center items-center gap-3 mx-3">
            <li>
              <LocaleSwitcher />
            </li>
            <li>
              <ThemeSwitcher />
            </li>
            <li>
              {email ? (
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
                      {translate("আমার একাউন্ট", "My Account")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={role + "/profile"}>
                        {translate("ড্যাশবোর্ড", "Dashboard")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={role + "/settings"}>
                        {translate("সেটিংস", "Settings")}
                      </Link>
                    </DropdownMenuItem>

                    <AlertDialog>
                      <AlertDialogTrigger
                        className={cn(
                          "w-full flex bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-bg-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        )}
                      >
                        <span className="ml-0.5">
                          {translate("লগআউট", "Logout")}
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {translate(
                              "আপনি কি একদম নিশ্চিত?",
                              "Are you absolutely sure?"
                            )}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {translate(
                              "আপনি লগআউট করতে চান? আপনি আপনার সেশন শেষ করতে যাচ্ছেন।",
                              "Are you sure you want to log out? You are about to end your session."
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {translate("বাতিল করুন", "Cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleLogout()}>
                            {translate("নিশ্চিত করুন", "Confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="login">
                  <Button>{translate("লগইন", "Login")}</Button>
                </Link>
              )}
            </li>
          </ul>
          <div className="flex justify-end">
            {isMenuOpen ? (
              <>
                <button onClick={toggleMenu}>
                  <RxCross2 className="text-secondary text-2xl" />
                </button>
              </>
            ) : (
              <>
                {" "}
                <button onClick={toggleMenu}>
                  <RxHamburgerMenu className="text-secondary text-2xl" />
                </button>
              </>
            )}
          </div>
        </div>
        <SidebarSlide isMenuOpen={isMenuOpen}>
          <div
            key="menu"
            className={`pb-10 bg-gray-100 overflow-y-auto
             `}
          >
            <div className="shadow-sm hover:text-primary-100 min-h-screen mt-4 pl-5">
              <nav>
                <ul className="flex flex-col gap-5 pl-4 pt-5">
                  {publicLinks.map((singleLink: any) => (
                    <NavLink
                      to={singleLink.href}
                      key={singleLink.key}
                      className={({ isActive }) =>
                        isActive
                          ? "text-foreground"
                          : " rounded-full"
                      }
                      onClick={() => setSelected(singleLink?.key)}
                    >
                      <button
                        className={`${
                          selected === singleLink?.key
                            ? "text-foreground"
                            : "hover:bg-primary/15 rounded-full"
                        } text-sm transition-colors px-2.5 py-0.5 rounded-full relative flex items-center gap-2`}
                      >
                        <span
                          className={cn(
                            "relative z-10 leading-5 px-3 py-1.5 flex text-[18px] justify-center items-center",
                            selected === singleLink?.key &&
                              "text-primary-foreground"
                          )}
                        >
                          {singleLink?.label}
                        </span>
                        {selected === singleLink?.key && (
                          <motion.span
                            layoutId="pill-tab"
                            transition={{ type: "spring", duration: 0.5 }}
                            className="absolute inset-0 z-0 bg-gradient-to-tr from-primary to-tertiary text-primary-foreground rounded-full"
                          ></motion.span>
                        )}
                      </button>
                    </NavLink>
                  ))}
                </ul>
              </nav>
            </div>
            {/* <button onClick={toggleMenu} className="absolute top-5 right-5">
              <RxCross2 className="text-secondary text-2xl" />
            </button> */}
          </div>
        </SidebarSlide>
      </div>
      {/* Blur Background */}
      <div
        className={`${
          isMenuOpen
            ? "fixed inset-0 bg-black/50 backdrop-blur-md z-10"
            : "hidden"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default PublicNavigationMobile;
