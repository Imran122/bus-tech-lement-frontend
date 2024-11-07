import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AddUserDataProps,
  addUserSchema,
} from "@/schemas/contact/addUpdateUserSchema";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetAllUserRoleListQuery } from "@/store/api/contact/roleApi";
import { useAddUserMutation } from "@/store/api/contact/userApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import {
  bloodGroupOptions,
  IBloodGroupsProps,
} from "@/utils/constants/common/bloodGroupOptions";
import {
  genderOptions,
  IGenderOptionsProps,
} from "@/utils/constants/common/genderOptions";
import {
  IMaritalStatusOptionsProps,
  maritalStatusOptions,
} from "@/utils/constants/common/maritalStatusOptions";
import addUpdateUserForm from "@/utils/constants/form/addUpdateUserForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, LucideEye, LucideEyeOff } from "lucide-react";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IUserStateProps } from "./UserList";
interface IAddUserProps {
  setUserState: (
    userState: (prevState: IUserStateProps) => IUserStateProps
  ) => void;
}
interface IAddUserFormStateProps {
  photo: string;
  date: Date | null;
  calendarOpen: boolean;
  password: boolean;
  rePassword: boolean;
}

const AddUser: FC<IAddUserProps> = ({ setUserState }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const [addUserFormState, setAddUserFormState] =
    useState<IAddUserFormStateProps>({
      photo: "",
      date: null,
      calendarOpen: false,
      password: false,
      rePassword: false,
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddUserDataProps>({
    resolver: zodResolver(addUserSchema),
  });
  const { data: roleListData, isLoading: roleLoading } =
    useGetAllUserRoleListQuery({});
  const { data: counterList, isLoading: counterLoading } = useGetCountersQuery(
    {}
  );
  const [addUser, { isLoading: addUserLoading, error: addUserError }] =
    useAddUserMutation({});

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});

  const onSubmit = async (data: AddUserDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "contactNo",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "bloodGroup",
      "address",
      "avatar",
      "email",
    ]) as AddUserDataProps;

    if (updateData?.avatar) {
      const result = await uploadPhoto(updateData?.avatar).unwrap();
      if (result?.success) {
        updateData.avatar = result?.data;
      }
    }

    const result = await addUser(updateData);
    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যবহারকারী যোগ করার বার্তা",
          "Message for adding user"
        ),
        description: toastMessage("add", translate("ব্যবহারকারী", "user")),
      });

      setUserState((prevState: IUserStateProps) => ({
        ...prevState,
        addUserOpen: false,
      }));
    }
  };
  //console.log("roleListData", roleListData);
  if (roleLoading || counterLoading) {
    <FormSkeleton columns={7} />;
  }
  return (
    <FormWrapper
      heading={translate("ব্যবহারকারী যোগ করুন", "Add User")}
      subHeading={translate(
        "সিস্টেমে নতুন ব্যবহারকারী যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new user to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* FULL NAME */}
          <InputWrapper
            labelFor="userName"
            label={translate(
              addUpdateUserForm.userName.label.bn,
              addUpdateUserForm.userName.label.en
            )}
            error={errors?.userName?.message}
          >
            <Input
              {...register("userName")}
              id="userName"
              type="text"
              placeholder={translate(
                addUpdateUserForm.userName.placeholder.bn,
                addUpdateUserForm.userName.placeholder.en
              )}
            />
          </InputWrapper>
          {/* selec counter */}
          <InputWrapper
            error={errors?.counterId?.message}
            labelFor="counterId"
            label={translate("কাউন্টার ✼", "Counter ✼")}
          >
            <Controller
              name="counterId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="counterId" className="w-full">
                    <SelectValue
                      placeholder={translate(
                        addUpdateUserForm.counterId.placeholder.bn,
                        addUpdateUserForm.counterId.placeholder.en
                      )}
                    >
                      {field.value
                        ? counterList?.data?.find(
                            (counter: any) => counter.id === Number(field.value)
                          )?.name
                        : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {counterList?.data && counterList.data.length > 0 ? (
                      counterList.data.map((type: any) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-counter">
                        {translate(
                          "কোনও কাউন্টার ধরন উপলব্ধ নেই",
                          "No Counter Available"
                        )}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>
          {/* selec role */}
          <InputWrapper
            error={errors?.roleId?.message}
            labelFor="permissionType"
            label={translate("ভূমিকা ✼", "Role ✼")}
          >
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))} // Ensure the value is a number
                >
                  <SelectTrigger id="roleId" className="w-full">
                    <SelectValue
                      placeholder={translate(
                        addUpdateUserForm.roleId.placeholder.bn,
                        addUpdateUserForm.roleId.placeholder.en
                      )}
                    >
                      {field.value
                        ? roleListData?.data?.find(
                            (role: any) => role.id === Number(field.value)
                          )?.name
                        : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roleListData?.data && roleListData.data.length > 0 ? (
                      roleListData.data.map((type: any) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-role">
                        {translate(
                          "কোনও ভূমিকা ধরন উপলব্ধ নেই",
                          "No Role Types Available"
                        )}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>

          {/* ACCOUNT PASSWORD */}
          <InputWrapper
            labelFor="password"
            label={translate(
              addUpdateUserForm.password.label.bn,
              addUpdateUserForm.password.label.en
            )}
            error={errors?.password?.message}
          >
            <div className="relative">
              <Input
                {...register("password")}
                className="pr-10"
                id="password"
                type={addUserFormState.password ? "password" : "text"}
                placeholder={translate(
                  addUpdateUserForm.password.placeholder.bn,
                  addUpdateUserForm.password.placeholder.en
                )}
              />
              <button
                type="button"
                className="text-lg absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-muted"
                onClick={() =>
                  setAddUserFormState((prevState: IAddUserFormStateProps) => ({
                    ...prevState,
                    password: !prevState.password,
                  }))
                }
              >
                {addUserFormState.password ? (
                  <LucideEye className="h-5 w-5" />
                ) : (
                  <LucideEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </InputWrapper>
          {/* ACCOUNT RE_PASSWORD  */}
          <InputWrapper
            labelFor="re_password"
            label={translate(
              addUpdateUserForm.rePassword.label.bn,
              addUpdateUserForm.rePassword.label.en
            )}
            error={errors?.rePassword?.message}
          >
            <div className="relative">
              <Input
                {...register("rePassword")}
                type={addUserFormState.password ? "password" : "text"}
                id="re_password"
                placeholder={translate(
                  addUpdateUserForm.rePassword.placeholder.bn,
                  addUpdateUserForm.rePassword.placeholder.en
                )}
              />
              <button
                type="button"
                className="text-lg absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-muted"
                onClick={() =>
                  setAddUserFormState((prevState: IAddUserFormStateProps) => ({
                    ...prevState,
                    rePassword: !prevState.rePassword,
                  }))
                }
              >
                {addUserFormState.rePassword ? (
                  <LucideEye className="h-5 w-5" />
                ) : (
                  <LucideEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </InputWrapper>
          {/* ACCOUNT EMAIL */}
          <InputWrapper
            error={errors?.email?.message}
            labelFor="email"
            label={translate(
              addUpdateUserForm.email.label.bn,
              addUpdateUserForm.email.label.en
            )}
          >
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder={translate(
                addUpdateUserForm.email.placeholder.bn,
                addUpdateUserForm.email.placeholder.en
              )}
            />
          </InputWrapper>
          {/* CONTACT NUMBER */}
          <InputWrapper
            labelFor="contact_number"
            label={translate(
              addUpdateUserForm.contactNo.label.bn,
              addUpdateUserForm.contactNo.label.en
            )}
            error={errors?.contactNo?.message}
          >
            <Input
              {...register("contactNo")}
              id="contact_number"
              type="tel"
              placeholder={translate(
                addUpdateUserForm.contactNo.placeholder.bn,
                addUpdateUserForm.contactNo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* ACTIVITY ROLE */}

          {/* DATE OF BIRTH */}
          <InputWrapper
            labelFor="date_of_birth"
            label={translate(
              addUpdateUserForm.dateOfBirth.label.bn,
              addUpdateUserForm.dateOfBirth.label.en
            )}
          >
            <Popover
              open={addUserFormState.calendarOpen}
              onOpenChange={(open) =>
                setAddUserFormState((prevState: IAddUserFormStateProps) => ({
                  ...prevState,
                  calendarOpen: open,
                }))
              }
            >
              <PopoverTrigger id="date_of_birth" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !addUserFormState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addUserFormState.date ? (
                    format(addUserFormState.date, "PPP")
                  ) : (
                    <span>
                      {translate("একটি তারিখ নির্বাচন করুন", "Pick a date")}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={addUserFormState?.date || new Date()}
                  onSelect={(date) => {
                    setValue("dateOfBirth", date);
                    setError("dateOfBirth", { type: "custom", message: "" });
                    setAddUserFormState(
                      (prevState: IAddUserFormStateProps) => ({
                        ...prevState,
                        calendarOpen: false,
                        date: date || null,
                      })
                    );
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
          {/* GENDER */}
          <InputWrapper
            error={errors?.gender?.message}
            labelFor="gender"
            label={translate(
              addUpdateUserForm.gender.label.bn,
              addUpdateUserForm.gender.label.en
            )}
          >
            <Select
              value={watch("gender") || ""}
              onValueChange={(value: "Male" | "Female") => {
                setValue("gender", value);
                setError("gender", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="gender" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateUserForm.gender.placeholder.bn,
                    addUpdateUserForm.gender.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {genderOptions?.length > 0 &&
                  genderOptions.map((singleGender: IGenderOptionsProps) => (
                    <SelectItem key={singleGender.key} value={singleGender.key}>
                      {translate(singleGender.label.bn, singleGender.label.en)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* MARITAL STATUS */}
          <InputWrapper
            labelFor="marital_status"
            label={translate(
              addUpdateUserForm.maritalStatus.label.bn,
              addUpdateUserForm.maritalStatus.label.en
            )}
            error={errors?.maritalStatus?.message}
          >
            <Select
              value={watch("maritalStatus") || ""}
              onValueChange={(value: "Married" | "Unmarried") => {
                setValue("maritalStatus", value);
                setError("maritalStatus", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="marital_status" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateUserForm.maritalStatus.placeholder.bn,
                    addUpdateUserForm.maritalStatus.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {maritalStatusOptions?.length > 0 &&
                  maritalStatusOptions.map(
                    (singleStatus: IMaritalStatusOptionsProps) => (
                      <SelectItem
                        key={singleStatus.key}
                        value={singleStatus.key}
                      >
                        {translate(
                          singleStatus.label.bn,
                          singleStatus.label.en
                        )}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* BLOOD GROUP */}
          <InputWrapper
            error={errors?.bloodGroup?.message}
            labelFor="blood_group"
            label={translate(
              addUpdateUserForm.bloodGroup.label.bn,
              addUpdateUserForm.bloodGroup.label.en
            )}
          >
            <Select
              value={watch("bloodGroup") || ""}
              onValueChange={(value: string) => {
                setValue("bloodGroup", value);
                setError("bloodGroup", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="blood_group" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateUserForm.bloodGroup.placeholder.bn,
                    addUpdateUserForm.bloodGroup.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {bloodGroupOptions?.length > 0 &&
                  bloodGroupOptions.map(
                    (singleBloodGroup: IBloodGroupsProps) => (
                      <SelectItem
                        key={singleBloodGroup.key}
                        value={singleBloodGroup.key}
                      >
                        {translate(
                          singleBloodGroup.label.bn,
                          singleBloodGroup.label.en
                        )}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* ADDRESS */}
          <InputWrapper
            error={errors?.address?.message}
            labelFor="address"
            label={translate(
              addUpdateUserForm.address.label.bn,
              addUpdateUserForm.address.label.en
            )}
          >
            <Input
              {...register("address")}
              id="address"
              type="text"
              placeholder={translate(
                addUpdateUserForm.address.placeholder.bn,
                addUpdateUserForm.address.placeholder.en
              )}
            />
          </InputWrapper>

          {/* AVATAR */}

          <InputWrapper
            labelFor="avatar"
            label={translate(
              addUpdateUserForm.avatar.label.bn,
              addUpdateUserForm.avatar.label.en
            )}
          >
            <PhotoCropper
              ratio={3 / 4}
              id="avatar"
              setPhoto={(value: string | undefined) => {
                setAddUserFormState((prevState: IAddUserFormStateProps) => ({
                  ...prevState,
                  photo: value || "",
                }));
                setValue("avatar", value);
                setError("avatar", { type: "", message: "" });
              }}
              photo={addUserFormState.photo}
              placeholder={translate(
                addUpdateUserForm.avatar.placeholder.bn,
                addUpdateUserForm.avatar.placeholder.en
              )}
            />
          </InputWrapper>
        </GridWrapper>

        <Submit
          loading={addUserLoading || uploadPhotoLoading}
          errors={addUserError}
          submitTitle={translate("ব্যবহারকারী যুক্ত করুন", "Add User")}
          errorTitle={translate(
            "ব্যবহারকারী যোগ করতে ত্রুটি",
            "Add User Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddUser;
