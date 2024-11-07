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
  useDeleteStationMutation,
  useGetStationsQuery,
} from "@/store/api/vehiclesSchedule/stationApi";
import { Station } from "@/types/dashboard/vehicleeSchedule.ts/station";
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
import AddStation from "./AddStation";
import UpdateStation from "./UpdateStation";
interface IStationListProps {}

export interface IStationStateProps {
  search: string;
  addStationOpen: boolean;
  stationsList: Partial<Station[]>;
}

const StationList: FC<IStationListProps> = () => {
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

  const [stationState, setStationState] = useState<IStationStateProps>({
    search: "",
    addStationOpen: false,
    stationsList: [],
  });

  const { data: stationsData, isLoading: stationsLoading } =
    useGetStationsQuery({
      search: stationState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const [deleteStation] = useDeleteStationMutation({});

  useEffect(() => {
    const customizeStationsData = stationsData?.data?.map(
      (singleUser: Partial<Station>, userIndex: number) => ({
        ...singleUser,
        name: formatter({ type: "words", words: singleUser?.name }),
        index: generateDynamicIndexWithMeta(stationsData, userIndex),
      })
    );

    setStationState((prevState: IStationStateProps) => ({
      ...prevState,
      stationsList: customizeStationsData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: stationsData?.meta,
    }));
  }, [stationsData]);

  const stationDeleteHandler = async (id: number) => {
    const result = await deleteStation(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "স্টেশন মুছে ফেলার বার্তা",
          "Message for deleting station"
        ),
        description: toastMessage("delete", translate("স্টেশন", "station")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      accessorKey: "name",
      header: translate("পুরো নাম", "Station Name"),
    },

    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const station = row.original as Station;
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
              {/* UPDATE STATION */}
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
                  <UpdateStation id={station?.id} />
                </DialogContent>
              </Dialog>

              {/* STATION DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => stationDeleteHandler(station.id)}
                alertLabel={translate("স্টেশন", "Station")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (stationsLoading) {
    return <TableSkeleton columns={3} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "স্টেশন তালিকা এবং সকল তথ্য উপাত্ত",
          "Station list and all ralevnet information & data"
        )}
        heading={translate("স্টেশন", "Station")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.station.placeholder.bn,
                  searchInputLabelPlaceholder.station.placeholder.en
                )}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const searchValue = e.target.value;
                  setStationState((prevState) => ({
                    ...prevState,
                    search: searchValue,
                  }));
                }}
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
                      {translate("স্টেশন যুক্ত করুন", "Add Station")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddStation setStationState={setStationState} />
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
          data={stationState.stationsList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default StationList;
