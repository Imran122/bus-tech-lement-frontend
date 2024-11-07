import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { accountsNavigationLinks } from "@/utils/constants/common/accounts/accountsNavigationLinks";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { Package2, PanelLeft } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface IAccountsDashboardSidebarSmallDevicesProps {}

const AccountsDashboardSidebarSmallDevices: FC<
  IAccountsDashboardSidebarSmallDevicesProps
> = () => {
  const { locale } = useLocaleContext();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            to="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {accountsNavigationLinks.length > 0 &&
            accountsNavigationLinks.map(
              (singleLink: any, linkIndex: number) => (
                <Button
                  key={linkIndex}
                  variant={"outline"}
                  size={"default"}
                  className="justify-start"
                >
                  {locale == "bn"
                    ? singleLink?.label?.bn
                    : singleLink?.label?.en}
                </Button>
              )
            )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default AccountsDashboardSidebarSmallDevices;
