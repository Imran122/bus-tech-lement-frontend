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
  UpdateUserDataProps,
  updateUserSchema,
} from "@/schemas/contact/addUpdateUserSchema";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetAllUserRoleListQuery } from "@/store/api/contact/roleApi";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/store/api/contact/userApi";
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
import { skipToken } from "@reduxjs/toolkit/query"; // Import skipToken
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface IUpdateUserProps {
  id: number | null;
}
interface IUpdateUserFormStateProps {
  photo: string;
  date: Date | null;
  calendarOpen: boolean;
}

const UpdateUser: FC<IUpdateUserProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const [updateUserFormState, setUpdateUserFormState] =
    useState<IUpdateUserFormStateProps>({
      photo: "",
      date: null,
      calendarOpen: false,
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUserDataProps>({
    resolver: zodResolver(updateUserSchema),
  });

  const { data: userData, isLoading: userLoading } = useGetSingleUserQuery(
    id ?? skipToken
  );
  const { data: roleListData, isLoading: roleLoading } =
    useGetAllUserRoleListQuery({});
  const { data: counterList, isLoading: counterLoading } = useGetCountersQuery(
    {}
  );
  const [updateUser, { isLoading: updateUserLoading, error: updateUserError }] =
    useUpdateUserMutation({});

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  //
  //
  useEffect(() => {
    if (userData?.data) {
      //

      //
      setValue("address", userData?.data.address || "");
      setValue("userName", userData?.data?.userName || "");
      setValue("gender", userData?.data?.gender || "");
      setValue("bloodGroup", userData?.data?.bloodGroup || "");
      setValue("contactNo", userData?.data?.contactNo || "");
      setValue("dateOfBirth", new Date(userData?.data?.dateOfBirth) || null);
      setValue("maritalStatus", userData?.data?.maritalStatus || "");
      const roleId = userData?.data?.role?.id || ""; // Access roleId from the role object
      //
      setValue("roleId", roleId);
      const counterId = userData?.data?.counter?.id;
      setValue("counterId", counterId || "");
      //
      setUpdateUserFormState((prevState: IUpdateUserFormStateProps) => ({
        ...prevState,
        date: userData?.data?.dateOfBirth,
      }));
    }
  }, [userData, setValue]);

  const onSubmit = async (data: UpdateUserDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "contactNo",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "bloodGroup",
      "address",
      "avatar",
      "roleId",
      "counterId",
    ]) as AddUserDataProps;

    if (updateData?.avatar) {
      const result = await uploadPhoto(updateData?.avatar).unwrap();
      if (result?.success) {
        updateData.avatar = result?.data;
      }
    }

    const result = await updateUser({ data: updateData, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যবহারকারী সম্পাদনা করার বার্তা",
          "Message for updating user"
        ),
        description: toastMessage("update", translate("ব্যবহারকারী", "user")),
      });
    }
  };

  if (userLoading || roleLoading || counterLoading) {
    return <FormSkeleton columns={3} inputs={9} />;
  }

  return (
    <FormWrapper
      heading={translate("ব্যবহারকারীর সম্পাদনা করুন", "Update User Profile")}
      subHeading={translate(
        "সিস্টেমে ব্যবহারকারীর তথ্য সম্পাদনা করতে নিচের নির্দেশনা গুলো অনুসরণ করুন।",
        "Follow the instructions to update user profile information in the system"
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
          {/* EMAIL */}
          <InputWrapper
            labelFor="email"
            label={translate(
              addUpdateUserForm.email.label.bn,
              addUpdateUserForm.email.label.en
            )}
          >
            <Input
              readOnly
              value={userData?.email || ""}
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
          {/* DATE OF BIRTH */}

          <InputWrapper
            labelFor="date_of_birth"
            label={translate(
              addUpdateUserForm.dateOfBirth.label.bn,
              addUpdateUserForm.dateOfBirth.label.en
            )}
          >
            <Popover
              open={updateUserFormState.calendarOpen}
              onOpenChange={(open) =>
                setUpdateUserFormState(
                  (prevState: IUpdateUserFormStateProps) => ({
                    ...prevState,
                    calendarOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger id="date_of_birth" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateUserFormState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateUserFormState.date instanceof Date &&
                  !isNaN(updateUserFormState.date.getTime())
                    ? format(updateUserFormState.date, "PPP")
                    : translate("একটি তারিখ নির্বাচন করুন", "Pick a date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={updateUserFormState?.date || new Date()}
                  onSelect={(date) => {
                    setValue("dateOfBirth", date);
                    setError("dateOfBirth", { type: "custom", message: "" });
                    setUpdateUserFormState(
                      (prevState: IUpdateUserFormStateProps) => ({
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
          {/* role id */}
          <InputWrapper
            error={errors?.roleId?.message}
            labelFor="roleId"
            label={translate("ভূমিকা ✼", "Role ✼")}
          >
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="roleId" className="w-full">
                    <SelectValue>
                      {roleListData?.data?.find(
                        (type: any) => type.id === Number(watch("roleId"))
                      )?.name ||
                        translate("কোনও ভূমিকা নেই", "No Role Available")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roleListData?.data.map((type: any) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>
          {/* Counter ID */}
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
                  //@ts-ignore
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="counterId" className="w-full">
                    <SelectValue>
                      {counterList?.data?.find(
                        (type: any) => type.id === Number(field.value)
                      )?.name ||
                        translate("কাউন্টার নির্বাচন করুন", "Select Counter")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {counterList?.data && counterList.data.length > 0 ? (
                      counterList.data.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-counter">
                        {translate(
                          "কোনও কাউন্টার উপলব্ধ নেই",
                          "No Counter Available"
                        )}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
                setUpdateUserFormState(
                  (prevState: IUpdateUserFormStateProps) => ({
                    ...prevState,
                    photo: value || "",
                  })
                );
                setValue("avatar", value);
                setError("avatar", { type: "", message: "" });
              }}
              photo={updateUserFormState.photo}
              placeholder={translate(
                addUpdateUserForm.avatar.placeholder.bn,
                addUpdateUserForm.avatar.placeholder.en
              )}
            />
          </InputWrapper>
        </GridWrapper>
        <Submit
          loading={updateUserLoading || uploadPhotoLoading}
          errors={updateUserError}
          submitTitle={translate("ব্যবহারকারী সম্পাদনা করুন", "Update User")}
          errorTitle={translate(
            "ব্যবহারকারী সম্পাদনা করতে ত্রুটি",
            "Update User Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateUser;
