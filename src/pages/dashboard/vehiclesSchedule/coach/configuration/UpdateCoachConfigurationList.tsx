
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  useGetUpdateCoachConfigurationsQuery,
  useUpdateCoachConfigurationMutation,
} from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { fallback } from "@/utils/constants/common/fallback";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import UpdateCoachConfigarationDetails from "./UpdateCoachConfigerationDetails";
import { UpdateCoachConfiguration } from "@/types/dashboard/vehicleeSchedule.ts/updateCoachConfig";

interface IUpdateCoachConfigurationListProps {}
export interface ICoachConfigurationStateProps {
  search: string;
  updateCoachConfigurationsList: UpdateCoachConfiguration[];
}

const UpdateCoachConfigurationList: FC<IUpdateCoachConfigurationListProps> = () => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: 0,
      size: 10,
      total: 100,
      totalPage: 10,
    },
  });
  const [coachConfigurationState, setCoachConfigurationState] =
    useState<ICoachConfigurationStateProps>({
      search: "",
      updateCoachConfigurationsList: [],
    });

    console.log("update coach",coachConfigurationState.updateCoachConfigurationsList )

  const {
    data: coachConfigurationsData,
    isLoading: coachConfigurationsLoading,
  } = useGetUpdateCoachConfigurationsQuery({
    search: coachConfigurationState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  // const [deleteCoachConfiguration] = useDeleteCoachConfigurationMutation({});
  const [updateCoachConfiguration] = useUpdateCoachConfigurationMutation();

  useEffect(() => {
    const customizeCoachConfigurationData = coachConfigurationsData?.data?.map(
      (
        singleCoachConfiguration: UpdateCoachConfiguration,
        configurationIndex: number
      ) => ({
        ...singleCoachConfiguration,
        coachNo: singleCoachConfiguration?.coachNo || fallback.notFound.en,
        registrationNo:
          singleCoachConfiguration?.registrationNo || fallback.notFound.en,
        schedule: singleCoachConfiguration?.schedule || fallback.notFound.en,
        type: singleCoachConfiguration?.type || fallback.notFound.en,
        coachType: singleCoachConfiguration.coachType,
        dummySaleStatus: singleCoachConfiguration?.active
          ? "Accept"
          : "Decline",
        index: generateDynamicIndexWithMeta(
          coachConfigurationsData,
          configurationIndex
        ),
      })
    );
    console.log("coachConfigurationsData", coachConfigurationsData);
    setCoachConfigurationState((prevState: ICoachConfigurationStateProps) => ({
      ...prevState,
      updateCoachConfigurationsList: customizeCoachConfigurationData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: coachConfigurationsData?.meta,
    }));
  }, [coachConfigurationsData]);

  const handleToggleSaleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const result = await updateCoachConfiguration({
        id,
        data: { saleStatus: !currentStatus },
      });
      if (result.data?.success) {
        toast({
          title: currentStatus
            ? translate(
                "কনফিগারেইশন নিষ্ক্রিয় করা হয়েছে",
                "Configuration deactivated"
              )
            : translate(
                "কনফিগারেইশন সক্রিয় করা হয়েছে",
                "Configuration activated"
              ),
          description: toastMessage(
            "update",
            translate("কোচ কনফিগারেইশন", "coach configuration")
          ),
        });
        // Update local state to reflect the change
        setCoachConfigurationState((prevState) => ({
          ...prevState,
          coachConfigurationsList: prevState.updateCoachConfigurationsList.map(
            (config) =>
              config.id === id
                ? { ...config, saleStatus: !currentStatus }
                : config
          ),
        }));
      }
    } catch (error) {
      toast({
        title: translate("কোচ যোগ করতে ত্রুটি", "Failed to update status"),
        description: toastMessage("add", translate("কোচ", "coach")),
      });
    }
  };

  // const coachConfigurationDeleteHandler = async (id: number) => {
  //   const result = await deleteCoachConfiguration(id);

  //   if (result.data?.success) {
  //     toast({
  //       title: translate(
  //         "কোচ কনফিগারেইশন মুছে ফেলার বার্তা",
  //         "Message for deleting coach configuration"
  //       ),
  //       description: toastMessage(
  //         "delete",
  //         translate("কোচ কনফিগারেইশন", "coach configuration")
  //       ),
  //     });
  //     playSound("remove");
  //   }
  // };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      accessorKey: "coachNo",
      header: translate("কোচ নম্বর", "Coach No"),
    },

    {
      accessorKey: "registrationNo",
      header: translate("রেজিস্ট্রেশন নম্বর", "Registration No"),
    },

    {
      accessorKey: "departureDate",
      header: translate("তারিখ", "Date"),
    },
    {
      accessorKey: "schedule",
      header: translate("সময়সূচী", "Schedule"),
    },
    {
      accessorKey: "type",
      header: translate("ধরণ", "Type"),
    },

    {
      header: translate("বিক্রয়ের অবস্থা", "Sale Status"),
      cell: ({ row }) => {
        const coachConfig = row.original as UpdateCoachConfiguration & {
          dummySaleStatus: string;
        };
        return (
          <Button
            variant={coachConfig?.active ? "success" : "destructive"}
            shape="pill"
            className="flex justify-center px-4 py-1"
            size="xs"
            onClick={() =>
              handleToggleSaleStatus(coachConfig.id, coachConfig?.active)
            }
          >
            {coachConfig?.active
              ? translate("বিক্রয় সক্রিয় করুন", "Activate Sale")
              : translate("বিক্রয় নিষ্ক্রিয় করুন", "Deactivate Sale")}
          </Button>
        );
      },
    },
    {
      accessorKey: "coachType",
      header: translate("কোচ ধরন", "Coach Type"),
    },
    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const coachConfig = row.original as UpdateCoachConfiguration;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রমগুলো", "Actions")}
              </DropdownMenuLabel>
              {/* UPDATE COACH */}
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("সম্পাদনা করুন", "Update")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateCoachConfiguration id={coachConfig?.id} />
                </DialogContent>
              </Dialog> */}

              {/* DETAILS COACH */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("বিস্তারিত", "Details")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateCoachConfigarationDetails id={coachConfig?.id} />
                </DialogContent>
              </Dialog>

              {/* USER DELETE ALERT DIALOG */}
              {/* <DeleteAlertDialog
                position="start"
                actionHandler={() =>
                  coachConfigurationDeleteHandler(coachConfig?.id)
                }
                alertLabel={translate("কোচ কনফিগারেইশন", "Coach Configuration")}
              /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (coachConfigurationsLoading) {
    return <TableSkeleton columns={8} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "কোচ কনফিগারেইশনের হালনাগাদ তালিকা এবং সকল তথ্য উপাত্ত",
          "Coach configuration list and all ralevnet information & data"
        )}
        heading={translate("কোচ কনফিগারেইশন হালনাগাদ", "Update Coach Configuration")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCoachConfigurationState(
                    (prevState: ICoachConfigurationStateProps) => ({
                      ...prevState,
                      search: e.target.value,
                    })
                  )
                }
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.coachConfiguration.placeholder.bn,
                  searchInputLabelPlaceholder.coachConfiguration.placeholder.en
                )}
              />
            </li>
         
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", " Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    {translate("পিডিএফ", "Pdf")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {translate("এক্সেল", "Excel")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>
        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={coachConfigurationState.updateCoachConfigurationsList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default UpdateCoachConfigurationList;
