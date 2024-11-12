import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import PhotoViewer from "@/components/common/photo/PhotoViewer";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
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

import {
  useDeleteHelperMutation,
  useGetHelpersQuery,
} from "@/store/api/contact/helperApi";
import { Helper } from "@/types/dashboard/contacts/helper";
import AddHelper from "./AddHelper";
import DetailsHelper from "./DetailsHelper";
import UpdateHelper from "./UpdateHelper";

interface IHelperListProps {}

export interface IHelperStateProps {
  search: string;
  addHelperOpen: boolean;
  helpersList: Helper[];
}

const HelperList: FC<IHelperListProps> = () => {
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
  const [helperState, setHelperState] = useState<IHelperStateProps>({
    search: "",
    addHelperOpen: false,
    helpersList: [],
  });

  const { data: helpersData, isLoading: helperLoading } = useGetHelpersQuery({
    search: helperState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteHelper] = useDeleteHelperMutation({});

  useEffect(() => {
    const customizeHelpersData = helpersData?.data?.map(
      (singleUser: Helper, userIndex: number) => ({
        ...singleUser,
        name: formatter({ type: "words", words: singleUser?.name }),
        dummyActive: singleUser?.active ? "Activate" : "Deactivate",
        index: generateDynamicIndexWithMeta(helpersData, userIndex),
      })
    );

    setHelperState((prevState: IHelperStateProps) => ({
      ...prevState,
      helpersList: customizeHelpersData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: helpersData?.meta,
    }));
  }, [helpersData]);

  const helperDeleteHandler = async (id: number) => {
    const result = await deleteHelper(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "সাহায্যকারী মুছে ফেলার বার্তা",
          "Message for deleting helper"
        ),
        description: toastMessage("delete", translate("সাহায্যকারী", "helper")),
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
        const helper = row.original as Helper;
        return (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-1"
              src={helper?.avatar}
              alt={`Image ${helper.name}`}
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
        const user = row.original as Helper & { dummyActive: string };
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
        const helper = row.original as Helper;
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
              {/* UPDATE helper */}
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
                  <UpdateHelper id={helper?.id} />
                </DialogContent>
              </Dialog>

              {/* DETAILS helper */}
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
                  <DetailsHelper id={helper?.id} />
                </DialogContent>
              </Dialog>

              {/* SUPERVISOR DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => helperDeleteHandler(helper?.id)}
                alertLabel={translate("সাহায্যকারী", "helper")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (helperLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ড্রাইভাদের তালিকা এবং সকল তথ্য উপাত্ত",
          "Helper list and all ralevnet information & data"
        )}
        heading={translate("সাহায্যকারী", "Helper")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setHelperState((prevState: IHelperStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.helper.placeholder.bn,
                  searchInputLabelPlaceholder.helper.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={helperState.addHelperOpen}
                onOpenChange={(open: boolean) =>
                  setHelperState((prevState: IHelperStateProps) => ({
                    ...prevState,
                    addHelperOpen: open,
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
                      {translate("সাহায্যকারী যুক্ত করুন", "Add helper")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddHelper setHelperState={setHelperState} />
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
          data={helperState.helpersList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default HelperList;
