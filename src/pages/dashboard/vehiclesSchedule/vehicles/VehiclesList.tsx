import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
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
  useDeleteVehicleMutation,
  useGetVehiclesQuery,
} from "@/store/api/vehiclesSchedule/vehicleApi";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import formatter from "@/utils/helpers/formatter";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddVehicles from "./AddVehicles";
import UpdateVehicle from "./UpdateVehicle";

interface IVehiclesListProps {}
// src/types/dashboard/vehicleSchedule/vehicle.ts

export interface Vehicle {
  id: number;
  registrationNo: string;
  manufacturerCompany?: string;
  model?: string;
  chasisNo?: string;
  engineNo?: string;
  countryOfOrigin?: string;
  lcCode?: string;
  color?: string;
  deliveryToDipo?: string;
  deliveryDate?: string;
  orderDate?: string;
  // Add other fields as necessary
}
export interface IVehicleStateProps {
  search: string;
  addVehicleOpen: boolean;
  vehiclesList: Partial<Vehicle[]>;
}

const VehiclesList: FC<IVehiclesListProps> = () => {
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

  const [vehicleState, setVehicleState] = useState<IVehicleStateProps>({
    search: "",
    addVehicleOpen: false,
    vehiclesList: [],
  });

  const {
    data: vehiclesData,
    isLoading: vehiclesLoading,
    refetch,
  } = useGetVehiclesQuery({
    search: vehicleState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteVehicle] = useDeleteVehicleMutation();

  useEffect(() => {
    const customizeVehiclesData = vehiclesData?.data?.map(
      (vehicle: any, index: number) => ({
        ...vehicle,
        registrationNo: formatter({
          type: "words",
          words: vehicle?.registrationNo,
        }),
        index: generateDynamicIndexWithMeta(vehiclesData, index),
      })
    );

    setVehicleState((prevState) => ({
      ...prevState,
      vehiclesList: customizeVehiclesData || [],
    }));
    setQuery((prevState) => ({
      ...prevState,
      meta: vehiclesData?.meta,
    }));
  }, [vehiclesData]);

  const vehicleDeleteHandler = async (id: number) => {
    const result = await deleteVehicle(id);
    if (result?.data?.success) {
      toast({
        title: translate(
          "যানবাহন মুছে ফেলার বার্তা",
          "Message for deleting vehicle"
        ),
        description: toastMessage("delete", translate("যানবাহন", "vehicle")),
      });
      playSound("remove");
      refetch(); // Refresh the list after deletion
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "registrationNo",
      header: translate("রেজিস্ট্রেশন নম্বর", "Registration Number"),
    },
    {
      accessorKey: "manufacturerCompany",
      header: translate("প্রস্তুতকারক কোম্পানি", "Manufacturer Company"),
    },
    { accessorKey: "model", header: translate("মডেল", "Model") },
    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const vehicle = row.original as Vehicle;
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
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateVehicle id={vehicle?.id} />
                </DialogContent>
              </Dialog>
              <DeleteAlertDialog
                position="start"
                actionHandler={() => vehicleDeleteHandler(vehicle.id)}
                alertLabel={translate("যানবাহন", "Vehicle")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (vehiclesLoading) {
    return <TableSkeleton columns={4} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "যানবাহন তালিকা এবং সকল তথ্য উপাত্ত",
          "Vehicle list and all relevant information & data"
        )}
        heading={translate("যানবাহন", "Vehicle")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.vehicles.placeholder.bn,
                  searchInputLabelPlaceholder.vehicles.placeholder.en
                )}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const searchValue = e.target.value;
                  setVehicleState((prevState) => ({
                    ...prevState,
                    search: searchValue,
                  }));
                }}
              />
            </li>
            <li>
              <Dialog
                open={vehicleState.addVehicleOpen}
                onOpenChange={(isOpen) =>
                  setVehicleState((prev) => ({
                    ...prev,
                    addVehicleOpen: isOpen,
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
                      {translate("যানবাহন যুক্ত করুন", "Add Vehicle")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddVehicles
                    setVehicleState={(newState) => {
                      setVehicleState((prevState) => ({
                        ...prevState,
                        ...newState,
                        addVehicleOpen: false,
                      }));
                      refetch(); // Refresh the list after adding a new vehicle
                    }}
                  />
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
          data={vehicleState.vehiclesList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default VehiclesList;
