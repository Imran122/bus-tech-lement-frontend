/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/store/api/contact/userApi";
import { User } from "@/types/dashboard/contacts/user";
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
import AddUser from "./AddUser";
import DetailsUser from "./DetailsUser";
import UpdateUser from "./UpdateUser";

export const dummyData = [];
interface IUserListProps {}
export interface IUserStateProps {
  search: string;
  addUserOpen: boolean;
  usersList: Partial<User[]>;
  userId: number | null;
}

const UserList: FC<IUserListProps> = () => {
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
  const [userState, setUserState] = useState<IUserStateProps>({
    search: "",
    addUserOpen: false,
    usersList: [],
    userId: null,
  });

  const { data: usersData, isLoading: userLoading } = useGetUsersQuery({
    search: userState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteUser] = useDeleteUserMutation({});
  console.log("mmmmmmm9;--", usersData);
  useEffect(() => {
    const customizeUsersData = usersData?.data?.map(
      (singleUser: User, userIndex: number) => ({
        ...singleUser,
        name: formatter({ type: "words", words: singleUser?.userName }),
        role: formatter({ type: "words", words: singleUser?.role.name }),
        dummyActive: singleUser?.active ? "Activate" : "Deactivate",
        index: generateDynamicIndexWithMeta(usersData, userIndex),
      })
    );

    setUserState((prevState: IUserStateProps) => ({
      ...prevState,
      usersList: customizeUsersData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: usersData?.meta,
    }));
  }, [usersData]);

  const userDeleteHandler = async (id: number) => {
    const result = await deleteUser(id);

    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যবহারকারী মুছে ফেলার বার্তা",
          "Message for deleting user"
        ),
        description: toastMessage("delete", translate("ব্যবহারকারী", "user")),
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
        const user = row.original as User;

        return (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-1"
              src={user?.avatar}
              alt={`Image ${user.userName}`}
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
      header: translate("ভূমিকা", "Role"),
      cell: ({ row }) => {
        //@ts-ignore
        const user = row?.original?.data as User;
        return (
          <Badge
            size="sm"
            shape="pill"
            variant={
              user?.role?.name.toLowerCase() === "admin"
                ? "tertiary"
                : user?.role?.name.toLowerCase() === "supervisor"
                ? "primary"
                : "warning"
            }
          >
            {user?.role?.name}
          </Badge>
        );
      },
    },
    {
      header: translate("অবস্থা", "Status"),
      cell: ({ row }) => {
        const user = row.original as User & { dummyActive: string };
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
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original as User;
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

              {/* UPDATE USER */}
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
                  <UpdateUser id={user?.id} />
                </DialogContent>
              </Dialog>

              {/* DETAILS USER */}
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
                  <DetailsUser id={user?.id} />
                </DialogContent>
              </Dialog>

              {/* USER DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => userDeleteHandler(user.id)}
                alertLabel={translate("ব্যবহারকারী", "User")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (userLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ব্যবহারকারীদের তালিকা এবং সকল তথ্য উপাত্ত",
          "User list and all ralevnet information & data"
        )}
        heading={translate("ব্যবহারকারী", "User")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUserState((prevState: IUserStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="w-[300px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.user.placeholder.bn,
                  searchInputLabelPlaceholder.user.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={userState.addUserOpen}
                onOpenChange={(open: boolean) =>
                  setUserState((prevState: IUserStateProps) => ({
                    ...prevState,
                    addUserOpen: open,
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
                  <AddUser setUserState={setUserState} />
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
          data={userState.usersList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default UserList;
