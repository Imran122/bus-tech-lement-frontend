export interface ILabelPlaceholder {
    label: {
      en: string;
      bn: string;
    };
    placeholder: {
      en: string;
      bn: string;
    };
  }
  
  interface IImageUploadFormProps {
    image: ILabelPlaceholder;
  }
  
  export const addUpdateSliderForm: IImageUploadFormProps = {
    image: {
      label: {
        en: "Image ✼",
        bn: "ছবি ✼",
      },
      placeholder: {
        en: "Upload an image",
        bn: "একটি ছবি আপলোড করুন",
      },
    },
  };
  