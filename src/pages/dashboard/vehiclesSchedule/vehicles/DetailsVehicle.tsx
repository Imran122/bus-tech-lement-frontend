import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { useGetSingleVehicleQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsVehicleProps {
  id: number | null;
}

const DetailsVehicle: FC<IDetailsVehicleProps> = ({ id }) => {
  const { data: vehicleData, isLoading } = useGetSingleVehicleQuery(id);
  const { translate } = useCustomTranslator();

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  const vehicle = vehicleData?.data;

  // Helper for rendering image fields
  const renderImageField = (label: string, src?: string) => {
    return (
      <div className="space-y-1 relative">
        <h3 className="font-semibold text-sm text-gray-600">{label}</h3>
        {src ? (
          <div className="relative group inline-block align-middle">
            {/* Small thumbnail */}
            <img
              src={src}
              alt={label}
              className="w-10 h-10 object-cover border border-gray-300 rounded cursor-pointer"
            />
            {/* Larger preview on hover */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block w-[300px] h-[200px] bg-white border border-gray-300 rounded shadow-lg z-50 p-1">
              <img
                src={src}
                alt={`${label} Preview`}
                className="w-[300px] h-[200px] object-cover rounded"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-800">N/A</p>
        )}
      </div>
    );
  };

  const renderField = (label: string, value?: string | null) => (
    <div className="space-y-1">
      <h3 className="font-semibold text-sm text-gray-600">{label}</h3>
      <p className="text-sm text-gray-900">{value || "N/A"}</p>
    </div>
  );

  const renderDateField = (label: string, dateValue?: string | null) => (
    <div className="space-y-1">
      <h3 className="font-semibold text-sm text-gray-600">{label}</h3>
      <p className="text-sm text-gray-900">
        {dateValue ? formatter({ type: "date", dateTime: dateValue }) : "N/A"}
      </p>
    </div>
  );

  const renderDateTimeField = (label: string, dateValue?: string | null) => (
    <div className="space-y-1">
      <h3 className="font-semibold text-sm text-gray-600">{label}</h3>
      <p className="text-sm text-gray-900">
        {dateValue
          ? formatter({ type: "date&time", dateTime: dateValue })
          : "N/A"}
      </p>
    </div>
  );

  return (
    <DetailsWrapper
      heading={translate("যানবাহনের তথ্য", "Vehicle Details")}
      subHeading={translate(
        "আপনার যানবাহনের বিস্তারিত তথ্য ও সাম্প্রতিক আপডেটগুলো পরীক্ষা করুন।",
        "Review the detailed information of your vehicle."
      )}
    >
      {/* Remove overflow-hidden here and ensure position:relative if needed */}
      <section className="p-6 border max-w-6xl mx-auto bg-white rounded shadow relative">
        <div className="grid grid-cols-2 gap-6">
          {renderField(
            translate("নিবন্ধন নম্বর", "Registration No"),
            vehicle?.registrationNo
          )}
          {renderField(
            translate("প্রস্তুতকারক কোম্পানি", "Manufacturer Company"),
            vehicle?.manufacturerCompany
          )}
          {renderField(translate("মডেল", "Model"), vehicle?.model)}
          {renderField(
            translate("চেসিস নম্বর", "Chasis No"),
            vehicle?.chasisNo
          )}
          {renderField(
            translate("ইঞ্জিন নম্বর", "Engine No"),
            vehicle?.engineNo
          )}
          {renderField(
            translate("উৎপত্তি দেশ", "Country of Origin"),
            vehicle?.countryOfOrigin
          )}
          {renderField(translate("এলসি কোড", "LC Code"), vehicle?.lcCode)}
          {renderField(
            translate("ডিপোতে ডেলিভারি", "Delivery to Dipo"),
            vehicle?.deliveryToDipo
          )}

          {renderDateField(
            translate("ডেলিভারি তারিখ", "Delivery Date"),
            vehicle?.deliveryDate
          )}
          {renderDateField(
            translate("অর্ডার তারিখ", "Order Date"),
            vehicle?.orderDate
          )}

          {/* Images */}
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

          {renderField(translate("রঙ", "Color"), vehicle?.color)}
          {renderField(
            translate("অ্যাক্টিভ", "Active"),
            vehicle?.active ? translate("হ্যাঁ", "Yes") : translate("না", "No")
          )}

          {renderDateTimeField(
            translate("তৈরি হয়েছে", "Created At"),
            vehicle?.createdAt
          )}
          {renderDateTimeField(
            translate("হালনাগাদ হয়েছে", "Updated At"),
            vehicle?.updatedAt
          )}
        </div>
      </section>
    </DetailsWrapper>
  );
};

export default DetailsVehicle;
