import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import { cn } from "@/lib/utils";
import AddDriver from "./AddDriver";
import {
  useDeleteDriverMutation,
  useGetDriversQuery,
} from "@/store/api/contact/driverApi";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { Badge } from "@/components/ui/badge";
import PhotoViewer from "@/components/common/photo/PhotoViewer";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { useToast } from "@/components/ui/use-toast";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { playSound } from "@/utils/helpers/playSound";
import UpdateDriver from "./UpdateDriver";
import formatter from "@/utils/helpers/formatter";
import DetailsDriver from "./DetailsDriver";
import { Driver } from "@/types/dashboard/contacts/driver";

interface IDriverListProps {}

export interface IDriverStateProps {
  search: string;
  addDriverOpen: boolean;
  driversList: Driver[];
}

const DriverList: FC<IDriverListProps> = () => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
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
  const [driverState, setDriverState] = useState<IDriverStateProps>({
    search: "",
    addDriverOpen: false,
    driversList: [],
  });

  const { data: driversData, isLoading: driverLoading } = useGetDriversQuery({
    search: driverState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteDriver] = useDeleteDriverMutation({});

  useEffect(() => {
    const customizeDriversData = driversData?.data?.map(
      (singleUser: Driver, userIndex: number) => ({
        ...singleUser,
        name: formatter({ type: "words", words: singleUser?.name }),
        dummyActive: singleUser?.active ? "Activate" : "Deactivate",
        index: generateDynamicIndexWithMeta(driversData, userIndex),
      })
    );

    setDriverState((prevState: IDriverStateProps) => ({
      ...prevState,
      driversList: customizeDriversData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: driversData?.meta,
    }));
  }, [driversData]);

  const driverDeleteHandler = async (id: number) => {
    const result = await deleteDriver(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "ড্রাইভার মুছে ফেলার বার্তা",
          "Message for deleting driver"
        ),
        description: toastMessage("delete", translate("ড্রাইভার", "driver")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "avatar",
      header: translate("অবতার", "Avatar"),
      cell: ({ row }) => {
        const driver = row.original as Driver;
        return (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-1"
              src={driver?.avatar}
              alt={`Image ${driver.name}`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "licensePhoto",
      header: translate("লাইসেন্স", "License"),
      cell: ({ row }) => {
        const driver = row.original as Driver;
        return (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-1"
              src={driver?.licensePhoto}
              alt={`license photo -- ${driver.name}`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: translate("পুরো নাম", "Full Name"),
    },

    {
      accessorKey: "contactNo",
      header: translate("যোগাযোগ নম্বর", "Contact No"),
    },

    {
      header: translate("অবস্থা", "Status"),
      cell: ({ row }) => {
        const user = row.original as Driver & { dummyActive: string };
        return (
          <Badge
            size="sm"
            shape="pill"
            variant={user?.active ? "success" : "destructive"}
          >
            {user.dummyActive}
          </Badge>
        );
      },
    },

    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const driver = row.original as Driver;
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
              <DropdownMenuSeparator />
              {/* UPDATE DRIVER */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("সম্পাদনা করুন", "Update")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1000px] max-h-[90%] overflow-y-auto">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateDriver id={driver?.id} />
                </DialogContent>
              </Dialog>

              {/* DETAILS DRIVER */}
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
                <DialogContent className="sm:max-w-[1000px] max-h-[90%] overflow-y-auto">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <DetailsDriver id={driver?.id} />
                </DialogContent>
              </Dialog>

              {/* SUPERVISOR DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => driverDeleteHandler(driver?.id)}
                alertLabel={translate("ড্রাইভার", "Driver")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (driverLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ড্রাইভাদের তালিকা এবং সকল তথ্য উপাত্ত",
          "Driver list and all ralevnet information & data"
        )}
        heading={translate("ড্রাইভার", "Driver")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDriverState((prevState: IDriverStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.driver.placeholder.bn,
                  searchInputLabelPlaceholder.driver.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={driverState.addDriverOpen}
                onOpenChange={(open: boolean) =>
                  setDriverState((prevState: IDriverStateProps) => ({
                    ...prevState,
                    addDriverOpen: open,
                  }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="outline"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate("ড্রাইভার যুক্ত করুন", "Add Driver")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddDriver setDriverState={setDriverState} />
                </DialogContent>
              </Dialog>
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
          data={driverState.driversList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default DriverList;
