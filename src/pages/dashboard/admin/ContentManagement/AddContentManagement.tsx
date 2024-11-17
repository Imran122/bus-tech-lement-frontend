import FileInputArray from "@/components/common/form/FileInputArray";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateCompanyProps,
  addUpdateCompanySchema,
} from "@/schemas/cms/addEditCmsSchema";
import {
  useGetSingleCMSQuery,
  useUpdateCMSMutation,
} from "@/store/api/cms/contentManagementApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { cmsForm } from "@/utils/constants/form/addUpdateCmsForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePenLine, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddContentManagement = () => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [editOpen, setEditOpen] = useState<Record<string, boolean>>({
    companyName: false,
    companyNameBangla: false,
    address: false,
    addressBangla: false,
    city: false,
    cityBangla: false,
    postalCode: false,
    supportNumber1: false,
    supportNumber2: false,
    facebook: false,
    instagram: false,
    twitter: false,
    linkedin: false,
  });

  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [companyLogoBanglaFile, setCompanyLogoBanglaFile] =
    useState<File | null>(null);
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
  const [footerLogoBanglaFile, setFooterLogoBanglaFile] = useState<File | null>(
    null
  );

  const [editStates, setEditStates] = useState<Record<string, boolean>>({
    companyLogo: false,
    companyLogoBangla: false,
    footerLogo: false,
    footerLogoBangla: false,
  });
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const [editCms, { isLoading, error }] = useUpdateCMSMutation();
  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );

  const toggleEditState = (field: string) => {
    setEditStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const toggleEditOpen = (field: string) => {
    setEditOpen((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateCompanyProps>({
    resolver: zodResolver(addUpdateCompanySchema),
  });

  useEffect(() => {
    if (singleCms?.data) {
      Object.entries(singleCms?.data).forEach(([key, value]) => {
        setValue(key as keyof AddUpdateCompanyProps, value as string);
      });
    }
  }, [singleCms, setValue]);

  const onSubmit = async (data: AddUpdateCompanyProps) => {
    try {
      let companyLogo = "";
      let companyLogoBangla = "";
      let footerLogo = "";
      let footerLogoBangla = "";

      if (companyLogoFile) {
        try {
          const uploadResponse = await uploadPhoto(companyLogoFile).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            companyLogo = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (companyLogoBanglaFile) {
        try {
          const uploadResponse = await uploadPhoto(
            companyLogoBanglaFile
          ).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            companyLogoBangla = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (footerLogoFile) {
        try {
          const uploadResponse = await uploadPhoto(footerLogoFile).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            footerLogo = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (footerLogoBanglaFile) {
        try {
          const uploadResponse = await uploadPhoto(
            footerLogoBanglaFile
          ).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            footerLogoBangla = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      const updatedData = {
        ...data,
        companyLogo,
        companyLogoBangla,
        footerLogo,
        footerLogoBangla,
      };
      const updateData = removeFalsyProperties(updatedData, [
        "companyLogo",
        "companyLogoBangla",
        "footerLogo",
        "footerLogoBangla",
        "companyName",
        "companyNameBangla",
        "address",
        "addressBangla",
        "city",
        "cityBangla",
        "postalCode",
        "supportNumber1",
        "supportNumber2",
        "facebook",
        "instagram",
        "twitter",
        "linkedin",
      ]) as AddUpdateCompanyProps;

      // After processing all images, proceed with CMS update
      const result = await editCms({
        id: singleCms?.data?.id,
        data: updateData,
      }).unwrap();
      if (result?.success) {
        toast({
          title: translate("সিএমএস আপডেট বার্তা", "CMS Update Message"),
          description: toastMessage("update", translate("সিএমএস", "CMS")),
        });
        setEditStates({
          companyLogo: false,
          companyLogoBangla: false,
          footerLogo: false,
          footerLogoBangla: false,
        });
        setEditOpen({
          companyName: false,
          companyNameBangla: false,
          address: false,
          addressBangla: false,
          city: false,
          cityBangla: false,
          postalCode: false,
          supportNumber1: false,
          supportNumber2: false,
          facebook: false,
          instagram: false,
          twitter: false,
          linkedin: false,
        });
      }
    } catch (error) {
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "সিএমএস আপডেট করতে ব্যর্থ হয়েছে।",
          "Failed to update CMS."
        ),
        variant: "destructive",
      });
    }
  };

  if (singleCmsLoading) {
    return <TableSkeleton columns={4} />;
  }

  return (
    <FormWrapper
      heading={translate("সিএমএস দেখুন সম্পাদনা করুন", "View & Edit CMS")}
      subHeading={translate(
        "সিস্টেমে সিএমএস সম্পাদনা করতে নিচের বিস্তারিত পরিবর্তন করুন।",
        "Modify the details below to edit the CMS in the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
          <InputWrapper
            labelFor="companyLogo"
            label={translate("কোম্পানির লোগো", "Company Logo")}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[232px]"}
                id="companyLogo"
                label={translate(
                  "কোম্পানির লোগো নির্বাচন করুন",
                  "Select Company Logo"
                )}
                value={singleCms?.data?.companyLogo || ""}
                setFile={setCompanyLogoFile}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("companyLogo", previewUrl);
                  } else {
                    setValue("companyLogo", "");
                  }
                }}
                disabled={!editStates.companyLogo}
              />
              <div className="flex gap-3 items-center">
                <Button
                  onClick={() => toggleEditState("companyLogo")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.companyLogo
                    ? <X className="h-6 w-6 text-red-600" /> 
                    : <FilePenLine className="h-6 w-6 text-green-600" />}
                </Button>

                {/* Conditionally render the Submit button when the edit state is active */}
                {editStates.companyLogo && (
                  <Submit
                    className="mt-0 pt-0"
                    loading={isLoading || uploadPhotoLoading}
                    errors={error}
                    icon={<FilePenLine className="h-6 w-5 text-gray-100" />} 
                    errorTitle={translate(
                      "সিএমএস আপডেট করতে ত্রুটি",
                      "Error updating CMS"
                    )}
                  />
                )}
              </div>
            </div>
          </InputWrapper>

          {/* Company Logo Bangla */}
          <InputWrapper
            labelFor="companyLogoBangla"
            label={translate("কোম্পানির লোগো(বাংলা)", "Company Logo (Bangla)")}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[232px]"}
                id="companyLogoBangla"
                label={translate(
                  "কোম্পানির লোগো নির্বাচন করুন(বাংলা)",
                  "Select Company Logo (Bangla)"
                )}
                value={singleCms?.data?.companyLogoBangla || ""}
                setFile={setCompanyLogoBanglaFile}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("companyLogoBangla", previewUrl);
                  } else {
                    setValue("companyLogoBangla", "");
                  }
                }}
                disabled={!editStates.companyLogoBangla}
              />
              <div className="flex gap-3 items-center">
                <Button
                  onClick={() => toggleEditState("companyLogoBangla")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.companyLogoBangla
                    ? <X className="h-6 w-6 text-red-600" /> 
                    : <FilePenLine className="h-6 w-6 text-green-600" />}
                </Button>
                {editStates.companyLogoBangla && (
                  <Submit
                    className="mt-0 pt-0"
                    loading={isLoading || uploadPhotoLoading}
                    errors={error}
                    icon={<FilePenLine className="h-6 w-5 text-gray-100" />}
                    errorTitle={translate(
                      "সিএমএস আপডেট করতে ত্রুটি",
                      "Error updating CMS"
                    )}
                  />
                )}
              </div>
            </div>
          </InputWrapper>

          {/* Footer Logo */}
          <InputWrapper
            labelFor="footerLogo"
            label={translate("ফুটার লোগো", "Footer Logo")}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[232px]"}
                id="footerLogo"
                label={translate(
                  "ফুটার লোগো নির্বাচন করুন",
                  "Select Footer Logo"
                )}
                value={singleCms?.data?.footerLogo || ""}
                setFile={setFooterLogoFile}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("footerLogo", previewUrl);
                  } else {
                    setValue("footerLogo", "");
                  }
                }}
                disabled={!editStates.footerLogo}
              />
              <div className="flex gap-3 items-center">
                <Button
                  onClick={() => toggleEditState("footerLogo")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.footerLogo
                    ? <X className="h-6 w-6 text-red-600" /> 
                    : <FilePenLine className="h-6 w-6 text-green-600" />}
                </Button>
                {editStates.footerLogo && (
                  <Submit
                    className="mt-0 pt-0"
                    loading={isLoading || uploadPhotoLoading}
                    errors={error}
                    icon={<FilePenLine className="h-6 w-5 text-gray-100" />}
                    errorTitle={translate(
                      "সিএমএস আপডেট করতে ত্রুটি",
                      "Error updating CMS"
                    )}
                  />
                )}
              </div>
            </div>
          </InputWrapper>

          {/* Footer Logo Bangla */}
          <InputWrapper
            labelFor="footerLogoBangla"
            label={translate("ফুটার লোগো(বাংলা)", "Footer Logo (Bangla)")}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[232px]"}
                id="footerLogoBangla"
                label={translate(
                  "ফুটার লোগো নির্বাচন করুন(বাংলা)",
                  "Select Footer Logo (Bangla)"
                )}
                value={singleCms?.data?.footerLogoBangla || ""}
                setFile={setFooterLogoBanglaFile}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("footerLogoBangla", previewUrl);
                  } else {
                    setValue("footerLogoBangla", "");
                  }
                }}
                disabled={!editStates.footerLogoBangla}
              />
              <div className="flex gap-3 items-center">
                <Button
                  onClick={() => toggleEditState("footerLogoBangla")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.footerLogoBangla
                    ? <X className="h-6 w-6 text-red-600" /> 
                    : <FilePenLine className="h-6 w-6 text-green-600" />}
                </Button>
                {editStates.footerLogoBangla && (
                  <Submit
                    className="mt-0 pt-0"
                    loading={isLoading || uploadPhotoLoading}
                    errors={error}
                    icon={<FilePenLine className="h-6 w-5 text-gray-100" />}
                    errorTitle={translate(
                      "সিএমএস আপডেট করতে ত্রুটি",
                      "Error updating CMS"
                    )}
                  />
                )}
              </div>
            </div>
          </InputWrapper>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* Dynamically render fields */}
          {Object.entries(cmsForm).map(([key, { label, placeholder }]) => (
            <InputWrapper
              key={key}
              error={(errors as any)[key]?.message}
              labelFor={key}
              label={translate(label.bn, label.en)}
              className="relative mt-10"
            >
              <div className="flex flex-col items-center gap-3">
                <input
                  id={key}
                  {...register(key as keyof AddUpdateCompanyProps)}
                  type="text"
                  placeholder={translate(placeholder.bn, placeholder.en)}
                  className="border p-2 rounded w-full"
                  disabled={!editOpen[key]}
                />
                <div className="flex gap-1 items-center absolute top-0 right-1 bottom-2 z-10">
                  <Button
                    onClick={() => toggleEditOpen(key)}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    {editOpen[key]
                      ? <X className="h-6 w-6 text-red-600" /> 
                      : <FilePenLine className="h-6 w-6 text-green-600" />}
                  </Button>
                  {editOpen[key] && (
                    <Submit
                      className="mt-0 pt-0"
                      loading={isLoading || uploadPhotoLoading}
                      errors={error}
                      icon={<FilePenLine className="h-6 w-5 text-gray-100" />}
                      errorTitle={translate(
                        "সিএমএস আপডেট করতে ত্রুটি",
                        "Error updating CMS"
                      )}
                    />
                  )}
                </div>
              </div>
            </InputWrapper>
          ))}
        </div>
      </form>
    </FormWrapper>
  );
};

export default AddContentManagement;
