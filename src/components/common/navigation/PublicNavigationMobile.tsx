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
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { MdOutlineLogout } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
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
        className={`w-full  bg-gradient-to-tr from-primary/5 to-tertiary/5 duration-1000 py-1.5 fixed left-0 top-8  z-40 transition-all ${
          scrollY > 0 && "bg-white dark:bg-[#1f2128]"
        }`}
      >
        <div className="flex justify-between items-center px-5">
          <Link to={"/"}>
            {language === "en" ? (
              <img className="w-[80px]" src={logo} alt="logo" />
            ) : (
              <img className="w-[80px]" src={logobangla} alt="logo" />
            )}
          </Link>
          <ul className="flex justify-center items-center gap-3 mx-3">
            <li>
              <LocaleSwitcher />
            </li>
            <li>
              <ThemeSwitcher />
            </li>
          </ul>
          <div className="flex justify-end">
            <>
              {" "}
              <button onClick={toggleMenu}>
                <RxHamburgerMenu className="text-secondary text-2xl dark:text-[#f5f5f5]" />
              </button>
            </>
          </div>
        </div>
        <SidebarSlide isMenuOpen={isMenuOpen}>
          <div
            key="menu"
            className={`pb-10 bg-gray-100 dark:bg-[#1f2128] overflow-y-auto
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
                        isActive ? "text-primary" : ""
                      }
                      onClick={() => setSelected(singleLink?.key)}
                    >
                      <button
                        className={`${
                          selected === singleLink?.key ? "text-primary" : ""
                        } text-sm w-5/6 rounded-md transition-colors border px-2.5 py-0.5 gap-2`}
                      >
                        <span
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "relative z-10 leading-5 px-3 py-1.5 flex text-[16px] justify-start items-center",
                            selected === singleLink?.key && "text-primary"
                          )}
                        >
                          {<singleLink.icon className="mr-2" />}
                          {singleLink?.label}
                        </span>
                        {/* {selected === singleLink?.key && (
                          <motion.span
                            layoutId="pill-tab"
                            transition={{ type: "spring", duration: 0.5 }}
                            className="absolute inset-0 z-0 bg-gradient-to-tr from-primary to-tertiary text-primary-foreground rounded-full"
                          ></motion.span>
                        )} */}
                      </button>
                    </NavLink>
                  ))}
                  <li>
                    {email ? (
                      <div className="w-5/6">
                        <div className="border py-1.5  rounded-sm w-full">
                          <Link
                            onClick={()=>setIsMenuOpen(false)}
                            to={role + "/profile"}
                            className="flex items-center gap-2 px-5"
                          >
                            <RxDashboard className="text-sm"/>
                            {translate("ড্যাশবোর্ড", "Dashboard")}
                          </Link>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger
                            className={cn(
                              "w-full mt-5 flex bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-bg-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            )}
                          >
                            <span className="ml-0.5 flex items-center gap-1 px-3">
                              <MdOutlineLogout className="text-xl" />
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
                      </div>
                    ) : (
                      <Link to="login">
                        <Button
                         onClick={()=>setIsMenuOpen(false)}
                          className="flex justify-start items-center gap-2 w-5/6"
                          variant={"outline"}
                        >
                          <FiLogIn />
                          {translate("লগইন", "Login")}
                        </Button>
                      </Link>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
            <button onClick={toggleMenu} className="absolute top-3 right-3">
              <RxCross2 className="text-secondary dark:text-[#f5f5f5] text-2xl" />
            </button>
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
