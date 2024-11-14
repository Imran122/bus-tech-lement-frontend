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
import { useDeleteReserveMutation, useGetReserveQuery} from "@/store/api/reserve/reserveApi";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import UpdateReserve from "./UpdateReserve";
import { Reserve } from "@/types/dashboard/vehicleeSchedule.ts/reserve";
import AddResurb from "./AddResurb";
import formatter from "@/utils/helpers/formatter";
import ReserveDetails from "./ReserveDetails";

interface IReserveListProps {}
export interface IReserveStateProps {
  search: string;
  addReserveOpen: boolean;
  reserveList: Reserve[];
  calenderFromOpen: boolean;
  calenderToOpen:boolean;
  fromDate:Date| null;
  toDate:Date | null;
  fromDateTime:Date | null,
  toDateTime:Date | null,
}

const ReserveList: FC<IReserveListProps> = () => {
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
  const [reserveState, setReserveState] = useState<IReserveStateProps>({
    search: "",
    addReserveOpen: false,
    reserveList: [],
    calenderFromOpen:false,
    calenderToOpen:false,
    fromDate:null,
    toDate:null,
    fromDateTime:null,
    toDateTime:null,
  });

  const { data: reserveData, isLoading: reserveLoading } = useGetReserveQuery({
    search: reserveState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteReserve] = useDeleteReserveMutation({});

  useEffect(() => {
    const customizedReserveData = reserveData?.data?.map(
      (reserve:Reserve, userIndex: number) => ({
        ...reserve,
        index: generateDynamicIndexWithMeta(reserveData, userIndex),
        fromDate:formatter({
          type:"date",
          dateTime:reserve?.toDate
        }),
        toDate:formatter({
          type:"date",
          dateTime:reserve?.toDate
        }),
        route:reserve?.route?.routeName
      })
    );

    setReserveState((prevState: IReserveStateProps) => ({
      ...prevState,
      reserveList: customizedReserveData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: reserveData?.meta,
    }));
  }, [reserveData]);

  const reserveDeleteHandler = async (id: number) => {
    const result = await deleteReserve(id);

    if (result.data?.success) {
      toast({
        title: translate("রিজার্ভ মুছে ফেলার বার্তা", "Message for deleting reserve"),
        description: toastMessage("delete", translate("রিজার্ভ", "Reserve")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    { accessorKey: "registrationNo", header: translate("রেজিস্ট্রেশন নম্বর", "Registration No") },
    // { accessorKey: "route", header: translate("রুট", "Route") },
    // { accessorKey: "noOfSeat", header: translate("আসন সংখ্যা", "Number of Seat") },
    // { accessorKey: "fromDate", header: translate("শুরুর তারিখ", "From Date") },
    // { accessorKey: "fromDateTime", header: translate("শুরুর সময়", "From Date Time") },
    // { accessorKey: "toDate", header: translate("শেষের তারিখ", "To Date") },
    // { accessorKey: "toDateTime", header: translate("শেষের সময়", "To Date Time") },
    { accessorKey: "passengerName", header: translate("যাত্রীর নাম", "Passenger Name") },
    { accessorKey: "contactNo", header: translate("যোগাযোগ নম্বর", "Contact No") },
    // { accessorKey: "address", header: translate("ঠিকানা", "Address") },
    { accessorKey: "amount", header: translate("পরিমাণ", "Amount") },
    { accessorKey: "paidAmount", header: translate("প্রদত্ত পরিমাণ", "Paid Amount") },
    { accessorKey: "dueAmount", header: translate("বাকি পরিমাণ", "Due Amount") },
    // { accessorKey: "remarks", header: translate("মন্তব্য", "Remarks") },
    
    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const reserve = row.original as Reserve;
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
              {/* UPDATE RESERVE */}
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
                <DialogContent size="lg">
                  <UpdateReserve id={reserve?.id}/>
                </DialogContent>
              </Dialog>
              {/* DETAILS RESERVE */}
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
                  <ReserveDetails id={reserve?.id} />
                </DialogContent>
              </Dialog>
             

              {/* USER DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => reserveDeleteHandler(reserve?.id)}
                alertLabel={translate("রিজার্ভ", "Reserve")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (reserveLoading) {
    return <TableSkeleton columns={6} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "রিজার্ভ তালিকা এবং সকল তথ্য উপাত্ত",
          "Reserve list and all ralevnet information & data"
        )}
        heading={translate("রিজার্ভ", "Reserve")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReserveState((prevState: IReserveStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.reserve.placeholder.bn,
                  searchInputLabelPlaceholder.reserve.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={reserveState.addReserveOpen}
                onOpenChange={(open: boolean) =>
                  setReserveState((prevState: IReserveStateProps) => ({
                    ...prevState,
                    addReserveOpen: open,
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
                      {translate("রিজার্ভ যুক্ত করুন", "Add Reserve")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddResurb setReserveState={setReserveState} reserveState={reserveState}/>
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
          data={reserveState.reserveList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default ReserveList;
