import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateSliderProps,
  addUpdateSliderSchema,
} from "@/schemas/slider/addupdateSliderSchema";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import {
  useGetSingleSliderQuery,
  useUpdateSliderMutation,
} from "@/store/api/slider/sliderApi";
import { addUpdateSliderForm } from "@/utils/constants/form/addUpdateSliderForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ISliderProps {
  id: number | null;
}

const UpdateSlider: FC<ISliderProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const { setValue, setError, handleSubmit } = useForm<AddUpdateSliderProps>({
    resolver: zodResolver(addUpdateSliderSchema),
  });

  const { data: singleSlider, isLoading: singleSliderLoading } =
    useGetSingleSliderQuery(id);
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const [updateSlider, { isLoading: sliderLoading, error: sliderError }] =
    useUpdateSliderMutation();

  const [sliderPhoto, setSliderPhoto] = useState<string | undefined>("");

  useEffect(() => {
    if (singleSlider) {
      const image = singleSlider.data?.image || "";
      setSliderPhoto(image);
      setValue("image", image);
    }
  }, [singleSlider, setValue]);

  const onSubmit = async (formData: AddUpdateSliderProps) => {
    if (formData.image) {
      const uploadResult = await uploadPhoto(formData.image).unwrap();

      // Check if the upload was successful
      if (uploadResult?.success) {
        formData.image = uploadResult.data;

        const addSliderResult = await updateSlider({
          id,
          data: formData,
        }).unwrap();

        if (addSliderResult?.success) {
          // Show success toast
          toast({
            title: translate(
              "স্লাইডার সফলভাবে হালনাগাত করা হয়েছে",
              "Slider Successfully Updated"
            ),
            description: toastMessage(
              "update",
              translate("স্লাইডার", "Slider")
            ),
          });
        }
      }
    } else {
      setError("image", { message: "Image is required" });
    }
  };

  if (singleSliderLoading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <FormWrapper
      heading={translate("স্লাইডার হালনাগাত করুন", "Update Slider")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন স্লাইডার হালনাগাত করার জন্য।",
        "Fill out the details below to update the slider."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputWrapper
            className="relative"
            labelFor="image"
            label={translate(
              addUpdateSliderForm.image.label.bn,
              addUpdateSliderForm.image.label.en
            )}
          >
            <div className="absolute right-3 bottom-2.5 z-50">
              <Images className="text-gray-400" />
            </div>
            <PhotoCropper
              ratio={3 / 4}
              id="avatar"
              setPhoto={(value: string | undefined) => {
                const photoValue = value || "";
                setSliderPhoto(photoValue);
                setValue("image", photoValue);
                setError("image", { type: "", message: "" });
              }}
              photo={sliderPhoto}
              placeholder={translate(
                addUpdateSliderForm.image.placeholder.bn,
                addUpdateSliderForm.image.placeholder.en
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={sliderLoading || uploadPhotoLoading}
          errors={sliderError}
          submitTitle={translate("স্লাইডার হালনাগাত করুন", "Update Slider")}
          errorTitle={translate(
            "স্লাইডার হালনাগাত করতে ত্রুটি",
            "Error Updating Slider"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateSlider;
