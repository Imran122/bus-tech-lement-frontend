import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import { cn } from "@/lib/utils";
import AddVehicles from "./AddVehicles";
import { dummyData } from "../../contacts/user/UserList";

interface IVehiclesListProps {}

// interface IVehiclesProps {
//   search: string;
//   actionData: any;
// }

interface IVehiclesListColumns {}

const VehiclesList: FC<IVehiclesListProps> = () => {
  const { translate } = useCustomTranslator();
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
  // const [supervisorState, setSuperVisorState] = useState<IVehiclesProps>({
  //   search: "",
  //   actionData: {},
  // });

  const supervisorDeleteHandler = async () => {};

  const columns: ColumnDef<IVehiclesListColumns>[] = [
    {
      accessorKey: "name",
      header: "name",
    },
    {
      accessorKey: "email",
      header: "email",
    },
    {
      accessorKey: "contactNo",
      header: "contactNo",
    },
    {
      accessorKey: "dateOfBirth",
      header: "dateOfBirth",
    },

    {
      accessorKey: "gender",
      header: "gender",
    },

    {
      header: "Action",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original as any;
        console.log(user);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                // onMouseEnter={() =>
                //   setSuperVisorState(
                //     (previousState: ISupervisorStateProps) => ({
                //       ...previousState,
                //       actionData: user,
                //     })
                //   )
                // }
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
              {/* EDIT PRODUCT INFORMATION */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1200px] max-h-[90%] overflow-y-auto"></DialogContent>
              </Dialog>

              {/* USER DETAILS */}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]"></DialogContent>
              </Dialog>

              {/* SUPERVISOR DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                actionHandler={supervisorDeleteHandler}
                alertLabel={translate("ড্রাইভার", "Driver")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "যানবাহনের তালিকা এবং সকল তথ্য উপাত্ত",
          " Vehicles list and all ralevnet information & data"
        )}
        heading={translate("যানবাহন", "Vehicles")}
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
              />
            </li>
            <li>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="outline"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate("যানবাহন যুক্ত করুন", "Add Vehicles")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <AddVehicles />
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
                  className={cn("w-[100px] space-y-2", useFontShifter())}
                  align="end"
                >
                  <DropdownMenuItem>
                    {translate("পিডিএফ", "Pdf")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
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
          data={dummyData}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default VehiclesList;