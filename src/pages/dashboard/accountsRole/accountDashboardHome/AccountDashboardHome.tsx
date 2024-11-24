import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";
import { LuClipboardCopy, LuClipboardPaste } from "react-icons/lu";
import CounterReportsList from "./CounterReportsList";
import SupervisorReportList from "./SupervisorReportList";

interface AccountHomeListProps {}

const AccountDashboardHome: FC<AccountHomeListProps> = () => {
  return (
    <section className="mt-2">
      <Tabs defaultValue="supervisor-report_list" className="my-2">
        <TabsList className="border">
          <TabsTrigger value="supervisor-report_list" className="font-bold">
            <LuClipboardCopy className="button-icon-size mr-1" />
            Supervisor Reports
          </TabsTrigger>
          <TabsTrigger value="counter-report_list" className="font-bold">
            {" "}
            <LuClipboardPaste className="button-icon-size mr-1" />
            Counter Reports
          </TabsTrigger>
        </TabsList>
        {/* CONFIG LIST CONTAINER  */}
        <TabsContent className="mt-8" value="supervisor-report_list">
          <SupervisorReportList />
        </TabsContent>
        {/* UPATE CONFIG LIST CONTAINER */}
        <TabsContent className="mt-8" value="counter-report_list">
          <CounterReportsList />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AccountDashboardHome;
