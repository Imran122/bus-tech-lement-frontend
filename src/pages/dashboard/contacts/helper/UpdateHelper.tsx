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
  AddUpdateHelperDataProps,
  addUpdateHelperSchema,
} from "@/schemas/contact/addUpdateHelperSchema";
import {
  useGetSingleHelperQuery,
  useUpdateHelperMutation,
} from "@/store/api/contact/helperApi";
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
import { addUpdateDriverForm } from "@/utils/constants/form/addUpdateDriver";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateHelperProps {
  id: number | null;
}

interface IUpdateHelperFormStateProps {
  photo: string;

  dateOfBirth: Date | null;

  dateOfBirthOpen: boolean;
}

const UpdateHelper: FC<IUpdateHelperProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [updateDriverFormState, setUpdateDriverFormState] =
    useState<IUpdateHelperFormStateProps>({
      photo: "",

      dateOfBirth: null,

      dateOfBirthOpen: false,
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateHelperDataProps>({
    resolver: zodResolver(addUpdateHelperSchema),
  });

  const { data: helperData, isLoading: helperLoading } =
    useGetSingleHelperQuery(id);

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});

  useEffect(() => {
    setValue("address", helperData?.data?.address || "");
    setValue("bloodGroup", helperData?.data?.bloodGroup || "");
    setValue("contactNo", helperData?.data?.contactNo || "");
    setValue(
      "dateOfBirth",
      helperData?.data?.dateOfBirth?.toLowerCase() === "n/a"
        ? null
        : new Date(helperData?.data?.dateOfBirth)
    );
    setValue(
      "email",
      helperData?.data?.email?.toLowerCase() === "n/a"
        ? ""
        : helperData?.data?.email
    );
    setValue("gender", helperData?.data?.gender || "");
    setValue("maritalStatus", helperData?.data?.maritalStatus);
    setValue("name", helperData?.data?.name || "");

    setValue("emergencyNumber", helperData?.data?.emergencyNumber || "");
    setValue("referenceBy", helperData?.data?.referenceBy || "");
    setValue("avatar", helperData?.data?.avatar || "");

    setUpdateDriverFormState((prevState: IUpdateHelperFormStateProps) => ({
      ...prevState,

      dateOfBirth:
        helperData?.data?.dateOfBirth?.toLowerCase() === "n/a"
          ? null
          : helperData?.data?.dateOfBirth,
    }));
  }, [helperData, setValue]);

  const [
    updateHelper,
    { isLoading: updateHelperLoading, error: addHelperError },
  ] = useUpdateHelperMutation();

  const onSubmit = async (data: AddUpdateHelperDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "email",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "bloodGroup",
      "address",
      "avatar",
    ]) as AddUpdateHelperDataProps;

    if (updateData?.avatar?.toString().includes("data:image/jpeg;base64")) {
      const result = await uploadPhoto(updateData?.avatar).unwrap();
      if (result?.success) {
        updateData.avatar = result?.data;
      }
    }

    const result = await updateHelper({ data: updateData, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "গাড়ি চালক সম্পাদনা করার বার্তা",
          "Message for updating driver"
        ),
        description: toastMessage("update", translate("সাহায্যকারী", "driver")),
      });
    }
  };

  if (helperLoading) {
    return <FormSkeleton inputs={15} columns={3} />;
  }

  return (
    <FormWrapper
      heading={translate("সাহায্যকারী সম্পাদনা করুন", "Update Helper")}
      subHeading={translate(
        "সিস্টেমে সাহায্যকারী সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing helper to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* FULL NAME */}
          <InputWrapper
            error={errors?.name?.message}
            labelFor="name"
            label={translate(
              addUpdateDriverForm.name.label.bn,
              addUpdateDriverForm.name.label.en
            )}
          >
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder={translate(
                addUpdateDriverForm.name.placeholder.bn,
                addUpdateDriverForm.name.placeholder.en
              )}
            />
          </InputWrapper>
          {/* EMAIL */}
          <InputWrapper
            error={errors?.email?.message}
            labelFor="email"
            label={translate(
              addUpdateDriverForm.email.label.bn,
              addUpdateDriverForm.email.label.en
            )}
          >
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder={translate(
                addUpdateDriverForm.email.placeholder.bn,
                addUpdateDriverForm.email.placeholder.en
              )}
            />
          </InputWrapper>
          {/* CONTACT NUMBER */}
          <InputWrapper
            error={errors?.contactNo?.message}
            labelFor="contact_number"
            label={translate(
              addUpdateDriverForm?.contactNo.label.bn,
              addUpdateDriverForm.contactNo.label.en
            )}
          >
            <Input
              {...register("contactNo")}
              id="contact_number"
              type="tel"
              placeholder={translate(
                addUpdateDriverForm.contactNo.placeholder.bn,
                addUpdateDriverForm.contactNo.placeholder.en
              )}
            />
          </InputWrapper>

          {/* EMERGENCY NUMBER */}
          <InputWrapper
            error={errors?.emergencyNumber?.message}
            labelFor="emergencyNumber"
            label={translate(
              addUpdateDriverForm.emergencyNumber.label.bn,
              addUpdateDriverForm.emergencyNumber.label.en
            )}
          >
            <Input
              {...register("emergencyNumber")}
              id="emergencyNumber"
              type="tel"
              placeholder={translate(
                addUpdateDriverForm.emergencyNumber.placeholder.bn,
                addUpdateDriverForm.emergencyNumber.placeholder.en
              )}
            />
          </InputWrapper>

          {/* REFERENCE BY */}

          <InputWrapper
            error={errors?.referenceBy?.message}
            labelFor="referenceBy"
            label={translate(
              addUpdateDriverForm.referenceBy.label.bn,
              addUpdateDriverForm.referenceBy.label.en
            )}
          >
            <Input
              {...register("referenceBy")}
              id="referenceBy"
              type="text"
              placeholder={translate(
                addUpdateDriverForm.referenceBy.placeholder.bn,
                addUpdateDriverForm.referenceBy.placeholder.en
              )}
            />
          </InputWrapper>
          {/* ADDRESS */}

          <InputWrapper
            error={errors?.address?.message}
            labelFor="address"
            label={translate(
              addUpdateDriverForm.address.label.bn,
              addUpdateDriverForm.address.label.en
            )}
          >
            <Input
              {...register("address")}
              id="address"
              type="text"
              placeholder={translate(
                addUpdateDriverForm.address.placeholder.bn,
                addUpdateDriverForm.address.placeholder.en
              )}
            />
          </InputWrapper>
          {/* AVATAR */}
          <InputWrapper
            labelFor="avatar"
            error={errors?.avatar?.message}
            label={translate(
              addUpdateDriverForm.avatar.label.bn,
              addUpdateDriverForm.avatar.label.en
            )}
          >
            <PhotoCropper
              ratio={3 / 4}
              id="avatar"
              setPhoto={(value: string | undefined) => {
                setUpdateDriverFormState(
                  (prevState: IUpdateHelperFormStateProps) => ({
                    ...prevState,
                    photo: value || "",
                  })
                );
                setValue("avatar", value);
                setError("avatar", { type: "", message: "" });
              }}
              photo={updateDriverFormState.photo}
              placeholder={translate(
                addUpdateDriverForm.avatar.placeholder.bn,
                addUpdateDriverForm.avatar.placeholder.en
              )}
            />
          </InputWrapper>
          {/* GENDER */}
          <InputWrapper
            labelFor="gender"
            error={errors?.gender?.message}
            label={translate(
              addUpdateDriverForm.gender.label.bn,
              addUpdateDriverForm.gender.label.en
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
                    addUpdateDriverForm?.gender.placeholder.bn,
                    addUpdateDriverForm.gender.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {genderOptions?.length > 0 &&
                  genderOptions?.map(
                    (
                      singleGender: IGenderOptionsProps,
                      genderIndex: number
                    ) => (
                      <SelectItem key={genderIndex} value={singleGender.key}>
                        {translate(
                          singleGender.label.bn,
                          singleGender.label.en
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
              addUpdateDriverForm.bloodGroup.label.bn,
              addUpdateDriverForm.bloodGroup.label.en
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
                    addUpdateDriverForm?.bloodGroup.placeholder.bn,
                    addUpdateDriverForm.bloodGroup.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {bloodGroupOptions?.length > 0 &&
                  bloodGroupOptions?.map(
                    (singleGroup: IBloodGroupsProps, bloodIndex: number) => (
                      <SelectItem key={bloodIndex} value={singleGroup.key}>
                        {translate(singleGroup.label.bn, singleGroup.label.en)}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* MARITAL STATUS */}
          <InputWrapper
            error={errors?.maritalStatus?.message}
            labelFor="marital_status"
            label={translate(
              addUpdateDriverForm.maritalStatus.label.bn,
              addUpdateDriverForm.maritalStatus.label.en
            )}
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
                    addUpdateDriverForm?.maritalStatus.placeholder.bn,
                    addUpdateDriverForm.maritalStatus.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {maritalStatusOptions?.length > 0 &&
                  maritalStatusOptions?.map(
                    (
                      singleMaritalStatus: IMaritalStatusOptionsProps,
                      maritalStatusIndex: number
                    ) => (
                      <SelectItem
                        key={maritalStatusIndex}
                        value={singleMaritalStatus.key}
                      >
                        {translate(
                          singleMaritalStatus.label.bn,
                          singleMaritalStatus.label.en
                        )}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* DATE OF BIRTH */}
          <InputWrapper
            error={errors?.dateOfBirth?.message}
            labelFor="date_of_birth"
            label={translate(
              addUpdateDriverForm.dateOfBirth.label.bn,
              addUpdateDriverForm.dateOfBirth.label.en
            )}
          >
            <Popover
              open={updateDriverFormState.dateOfBirthOpen}
              onOpenChange={(open) =>
                setUpdateDriverFormState(
                  (prevState: IUpdateHelperFormStateProps) => ({
                    ...prevState,
                    dateOfBirthOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger id="date_of_birth" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateDriverFormState.dateOfBirth &&
                      "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateDriverFormState?.dateOfBirth ? (
                    format(updateDriverFormState?.dateOfBirth, "PPP")
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
                  selected={updateDriverFormState?.dateOfBirth || new Date()}
                  onSelect={(date) => {
                    setValue("dateOfBirth", date);
                    setError("dateOfBirth", { type: "custom", message: "" });
                    setUpdateDriverFormState(
                      (prevState: IUpdateHelperFormStateProps) => ({
                        ...prevState,
                        dateOfBirthOpen: false,
                        dateOfBirth: date || null,
                      })
                    );
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        </GridWrapper>
        <Submit
          loading={updateHelperLoading || uploadPhotoLoading}
          errors={addHelperError}
          submitTitle={translate("সাহায্যকারী সম্পাদনা করুন", "Update Helper")}
          errorTitle={translate(
            "সাহায্যকারী সম্পাদনা করতে ত্রুটি",
            "Update Helper Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateHelper;
