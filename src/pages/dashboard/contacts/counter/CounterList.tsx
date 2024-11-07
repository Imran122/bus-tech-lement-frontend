import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { LuDownload, LuPlus } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import {
  useDeleteCounterMutation,
  useGetCountersQuery,
} from "@/store/api/contact/counterApi";
import AddCounter from "./AddCounter";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { useToast } from "@/components/ui/use-toast";
import { playSound } from "@/utils/helpers/playSound";
import UpdateCounter from "./UpdateCounter";
import formatter from "@/utils/helpers/formatter";
import DetailsCounter from "./DetailsCounter";
import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";

interface ICounterListProps {}
export interface ICounterStateProps {
  search: string;
  addCounterOpen: boolean;
  countersList: Counter[];
}

const CounterList: FC<ICounterListProps> = () => {
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const { toast } = useToast();
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
  const [counterState, setCounterState] = useState<ICounterStateProps>({
    search: "",
    addCounterOpen: false,
    countersList: [],
  });

  const { data: countersData, isLoading: counterLoading } = useGetCountersQuery(
    {
      search: counterState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    }
  );

  const [deleteCounter] = useDeleteCounterMutation({});

  useEffect(() => {
    const customizeCountersData = countersData?.data?.map(
      (singleUser: Counter, userIndex: number) => ({
        ...singleUser,
        name: formatter({
          type: "words",
          words: singleUser?.name,
        }),
        dummyType: singleUser?.type?.replace("_", " "),
        dummyPrimaryContactPersonName: formatter({
          type: "words",
          words: singleUser?.primaryContactPersonName,
        }),
        dummyStatus: singleUser?.status ? "Activate" : "Deactivate",
        index: generateDynamicIndexWithMeta(countersData, userIndex),
      })
    );

    setCounterState((prevState: ICounterStateProps) => ({
      ...prevState,
      countersList: customizeCountersData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: countersData?.meta,
    }));
  }, [countersData]);

  const counterDeleteHandler = async (id: number) => {
    const result = await deleteCounter(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "কাউন্টার মুছে ফেলার বার্তা",
          "Message for deleting counter"
        ),
        description: toastMessage("delete", translate("কাউন্টার", "counter")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "name",
      header: translate("কাউন্টারের নাম", "Counter Name"),
    },
    {
      accessorKey: "mobile",
      header: translate("যোগাযোগ নম্বর", "Mobile No"),
    },
    {
      accessorKey: "dummyPrimaryContactPersonName",
      header: translate("যোগাযোগকারী ব্যক্তি", "Contact Person"),
    },
    {
      accessorKey: "dummyType",
      header: translate("ধরণ", "Type"),
    },
    {
      header: translate("অবস্থা", "Status"),
      cell: ({ row }) => {
        const user = row.original as Counter & { dummyStatus: string };
        return (
          <Badge
            size="sm"
            shape="pill"
            variant={user?.status ? "success" : "destructive"}
          >
            {user.dummyStatus}
          </Badge>
        );
      },
    },

    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const counter = row.original as Counter;
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
                {translate("কার্যক্রম", "Action")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* UPDATE COUNTER */}
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
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateCounter id={counter?.id} />
                </DialogContent>
              </Dialog>

              {/* UPDATE COUNTER */}
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
                  <DetailsCounter id={counter?.id} />
                </DialogContent>
              </Dialog>

              {/* COUNTER DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => counterDeleteHandler(counter?.id)}
                alertLabel={translate("ব্যবহারকারী", "User")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (counterLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "কাউন্টারের তালিকা এবং সকল তথ্য উপাত্ত",
          "Counter list and all ralevnet information & data"
        )}
        heading={translate("কাউন্টার", "Counter")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCounterState((prevState: ICounterStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.counter.placeholder.bn,
                  searchInputLabelPlaceholder.counter.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={counterState.addCounterOpen}
                onOpenChange={(open: boolean) =>
                  setCounterState((prevState: ICounterStateProps) => ({
                    ...prevState,
                    addCounterOpen: open,
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
                      {translate("ব্যবহারকারী যুক্ত করুন", "Add User")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddCounter setCounterState={setCounterState} />
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
          data={counterState.countersList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default CounterList;
