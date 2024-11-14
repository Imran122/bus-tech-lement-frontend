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
import { cn } from "@/lib/utils";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import { dummyData } from "../contacts/user/UserList";
import AddExpense from "./AddExpense";

interface IExpenseListProps {}

// interface IDriverStateProps {
//   search: string;
//   actionData: any;
// }

interface IExpenseListColumns {}

const ExpenseList: FC<IExpenseListProps> = () => {
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
  // const [supervisorState, setSuperVisorState] = useState<IDriverStateProps>({
  //   search: "",
  //   actionData: {},
  // });

  const supervisorDeleteHandler = async () => {};

  const columns: ColumnDef<IExpenseListColumns>[] = [
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
        //@ts-ignore
        const user = row.original as any;

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
                alertLabel={translate("খরচ", "Expense")}
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
          "খরচের তালিকা এবং সকল তথ্য উপাত্ত",
          "Expense list and all ralevnet information & data"
        )}
        heading={translate("খরচ", "Expense")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.driver.placeholder.bn,
                  searchInputLabelPlaceholder.driver.placeholder.en
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
                      {translate("খরচ যুক্ত করুন", "Add Expense")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <AddExpense />
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

export default ExpenseList;
