import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateSliderProps,
  addUpdateSliderSchema,
} from "@/schemas/slider/addupdateSliderSchema";
import { addUpdateSliderForm } from "@/utils/constants/form/addUpdateSliderForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { ISliderStateProps } from "./SliderList";
import { useAddSliderMutation } from "@/store/api/slider/sliderApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { Images } from "lucide-react";

interface IAddSliderProps {
  setSliderState: (
    userState: (prevState: ISliderStateProps) => ISliderStateProps
  ) => void;
}

const AddSlider: FC<IAddSliderProps> = ({ setSliderState }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const { setValue, setError, handleSubmit } = useForm<AddUpdateSliderProps>({
    resolver: zodResolver(addUpdateSliderSchema),
  });

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const [addSlider, { isLoading: sliderLoading, error: sliderError }] =
    useAddSliderMutation();

  const onSubmit = async (formData: AddUpdateSliderProps) => {
    if (formData.image) {
      const uploadResult = await uploadPhoto(formData.image).unwrap();

      // Check if the upload was successful
      if (uploadResult?.success) {
        formData.image = uploadResult.data;

        const addSliderResult = await addSlider(formData).unwrap();

        if (addSliderResult?.success) {
          // Show success toast
          toast({
            title: translate(
              "স্লাইডার সফলভাবে যোগ করা হয়েছে",
              "Slider Successfully Added"
            ),
            description: toastMessage("add", translate("স্লাইডার", "Slider")),
          });

          // Close the slider form
          setSliderState((prevState) => ({
            ...prevState,
            addSliderOpen: false,
          }));
        }
      }
    } else {
      setError("image", { message: "Image is required" });
    }
  };

  const [sliderPhoto, setSliderPhoto] = useState<string | undefined>("");

  return (
    <FormWrapper
      heading={translate("নতুন স্লাইডার যোগ করুন", "Add New Slider")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন নতুন স্লাইডার যোগ করার জন্য।",
        "Fill out the details below to add a new slider."
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
              <Images className="text-gray-400"/>
            </div>
            <PhotoCropper
              ratio={undefined}
              id="image"
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
          submitTitle={translate("স্লাইডার যোগ করুন", "Add Slider")}
          errorTitle={translate(
            "স্লাইডার যোগ করতে ত্রুটি",
            "Error Adding Slider"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddSlider;
