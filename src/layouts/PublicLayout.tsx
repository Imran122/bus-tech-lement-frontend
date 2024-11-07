import PublicNavigation from "@/components/common/navigation/PublicNavigation";
import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { FC } from "react";
import { Outlet } from "react-router-dom";

interface IPublicLayoutProps {}

const PublicLayout: FC<IPublicLayoutProps> = () => {
  return (
    <main className={cn("bg-background text-foreground ", useFontShifter())}>
      <PublicNavigation />

      <section className="my-20">
        <Outlet />
      </section>

      <div>footer</div>
    </main>
  );
};

export default PublicLayout;
