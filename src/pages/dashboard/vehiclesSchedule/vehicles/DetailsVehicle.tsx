import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleVehicleQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface IDetailsVehicleProps {
  id: number | null;
}

const DetailsVehicle: FC<IDetailsVehicleProps> = ({ id }) => {
  const { data: vehicleData, isLoading } = useGetSingleVehicleQuery(id);
  const { translate } = useCustomTranslator();

  if (isLoading) {
    return <DetailsSkeleton columns={2} items={10} />;
  }

  const vehicle = vehicleData?.data;

  // Helper for rendering image fields with PhotoProvider
  const renderImageField = (label: string, src?: string) => (
    <PhotoProvider>
      <LabelDescription
        heading={label}
        //@ts-ignore
        paragraph={
          src ? (
            <PhotoView src={src}>
              <img
                src={src}
                alt={label}
                className="w-20 h-20 object-cover border border-gray-300 rounded cursor-pointer"
              />
            </PhotoView>
          ) : (
            "N/A"
          )
        }
      />
    </PhotoProvider>
  );

  return (
    <DetailsWrapper
      heading={translate("যানবাহনের তথ্য", "Vehicle Details")}
      subHeading={translate(
        "আপনার যানবাহনের বিস্তারিত তথ্য এবং সাম্প্রতিক আপডেটগুলি দেখুন।",
        "View detailed information and recent updates about your vehicle."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("নিবন্ধন নম্বর", "Registration No")}
          paragraph={vehicle?.registrationNo || "N/A"}
        />
        <LabelDescription
          heading={translate("প্রস্তুতকারক কোম্পানি", "Manufacturer Company")}
          paragraph={vehicle?.manufacturerCompany || "N/A"}
        />
        <LabelDescription
          heading={translate("মডেল", "Model")}
          paragraph={vehicle?.model || "N/A"}
        />
        <LabelDescription
          heading={translate("চেসিস নম্বর", "Chassis No")}
          paragraph={vehicle?.chasisNo || "N/A"}
        />
        <LabelDescription
          heading={translate("ইঞ্জিন নম্বর", "Engine No")}
          paragraph={vehicle?.engineNo || "N/A"}
        />
        <LabelDescription
          heading={translate("উৎপত্তি দেশ", "Country of Origin")}
          paragraph={vehicle?.countryOfOrigin || "N/A"}
        />
        <LabelDescription
          heading={translate("এলসি কোড", "LC Code")}
          paragraph={vehicle?.lcCode || "N/A"}
        />
        <LabelDescription
          heading={translate("ডিপোতে ডেলিভারি", "Delivery to Depot")}
          paragraph={vehicle?.deliveryToDipo || "N/A"}
        />
        <LabelDescription
          heading={translate("ডেলিভারি তারিখ", "Delivery Date")}
          paragraph={
            vehicle?.deliveryDate
              ? formatter({ type: "date", dateTime: vehicle?.deliveryDate })
              : "N/A"
          }
        />
        <LabelDescription
          heading={translate("অর্ডার তারিখ", "Order Date")}
          paragraph={
            vehicle?.orderDate
              ? formatter({ type: "date", dateTime: vehicle?.orderDate })
              : "N/A"
          }
        />
        {renderImageField(
          translate("নিবন্ধন ফাইল", "Registration File"),
          vehicle?.registrationFile
        )}
        {renderImageField(
          translate("ফিটনেস সার্টিফিকেট", "Fitness Certificate"),
          vehicle?.fitnessCertificate
        )}
        {renderImageField(
          translate("ট্যাক্স টোকেন", "Tax Token"),
          vehicle?.taxToken
        )}
        {renderImageField(
          translate("রুট পারমিট", "Route Permit"),
          vehicle?.routePermit
        )}
        <LabelDescription
          heading={translate("রঙ", "Color")}
          paragraph={vehicle?.color || "N/A"}
        />
        <LabelDescription
          heading={translate("অ্যাক্টিভ", "Active")}
          paragraph={
            vehicle?.active ? translate("হ্যাঁ", "Yes") : translate("না", "No")
          }
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Created At")}
          paragraph={
            vehicle?.createdAt
              ? formatter({ type: "date&time", dateTime: vehicle?.createdAt })
              : "N/A"
          }
        />
        <LabelDescription
          heading={translate("হালনাগাদ হয়েছে", "Updated At")}
          paragraph={
            vehicle?.updatedAt
              ? formatter({ type: "date&time", dateTime: vehicle?.updatedAt })
              : "N/A"
          }
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsVehicle;
