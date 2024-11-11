import DashboardSidebarLargeDevices from "@/components/common/navigation/DashboardSidebarLargeDevices";
import DashboardUpperNavigation from "@/components/common/navigation/DashboardUpperNavigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import UpdateCoachConfigNavigationForm from "@/pages/dashboard/vehiclesSchedule/coach/configuration/UpdateCoachConfigNavigationForm";
import { closeModal } from "@/store/api/user/coachConfigModalSlice";
import { useAppContext } from "@/utils/hooks/useAppContext";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

interface IDashboardLayoutProps {}

const DashboardLayout: FC<IDashboardLayoutProps> = () => {
  const { sidebarOpen } = useAppContext();
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    (state: RootState) => state.coachConfigModal.isModalOpen
  );
  return (
    <TooltipProvider>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-4xl px-10 py-6 mx-auto bg-background rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => dispatch(closeModal())}
              aria-label="Close Modal"
            >
              &times;
            </button>
            <UpdateCoachConfigNavigationForm id={null} />
          </div>
        </div>
      )}
      <main
        className={cn("flex min-h-screen w-full flex-col", useFontShifter())}
      >
        {/* DASHBOARD SIDEBAR FOR LARGE DEVICES */}
        <DashboardSidebarLargeDevices />
        <section
          className={cn(
            "flex flex-col sm:gap-4 transition-all",
            sidebarOpen ? "sm:pl-[280px]" : "sm:pl-14"
          )}
        >
          {/* DASHBOARD UPPER NAVIGATION */}
          <DashboardUpperNavigation />
          {/* DASHBOARD PLAYGROUND */}
          <section className="bg-muted/30 backdrop-blur-sm !w-[98.7%] ml-[13px] -mt-[2.5px] mb-1.5 rounded-md min-h-screen p-4 sm:px-6 sm:py-0 md:gap-8 overflow-x-hidden overflow-y-auto">
            <Outlet />
          </section>
        </section>
      </main>
    </TooltipProvider>
  );
};

export default DashboardLayout;
