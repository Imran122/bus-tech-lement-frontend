import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleCoachQuery } from "@/store/api/vehiclesSchedule/coachApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsCounterProps {
  id: number | null;
}

const DetailsCoach: FC<IDetailsCounterProps> = ({ id }) => {
  const { data: coachData, isLoading: coachLoading } =
    useGetSingleCoachQuery(id);
  const { translate } = useCustomTranslator();

  if (coachLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }

  return (
    <DetailsWrapper
      heading={translate("কোচ ওভারভিউ", "Coach Overview")}
      subHeading={translate(
        "আপনার কোচ তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your coach information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: coachData?.data?.createdAt,
          })}
        />
        <LabelDescription
          heading={translate("হালনাগাদ হয়েছে", "Update At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: coachData?.data?.updatedAt,
          })}
        />
        <LabelDescription
          heading={translate("নিবন্ধন নম্বর", "Registration No")}
          paragraph={coachData?.data?.registrationNo}
        />
        <LabelDescription
          heading={translate("উত্পাদনকারী কোম্পানি", "Manufacturer Company")}
          paragraph={coachData?.data?.manufacturerCompany}
        />
        <LabelDescription
          heading={translate("মডেল", "Model")}
          paragraph={coachData?.data?.model}
        />
        <LabelDescription
          heading={translate("চেসিস নম্বর", "Chassis No")}
          paragraph={coachData?.data?.chasisNo}
        />
        <LabelDescription
          heading={translate("ইঞ্জিন নম্বর", "Engine No")}
          paragraph={coachData?.data?.engineNo}
        />
        <LabelDescription
          heading={translate("উৎপত্তি দেশ", "Country Of Origin")}
          paragraph={coachData?.data?.countryOfOrigin}
        />
        <LabelDescription
          heading={translate("এলসি কোড", "LC Code")}
          paragraph={coachData?.data?.lcCode}
        />
        <LabelDescription
          heading={translate("ডিপোতে বিতরণ", "Delivery To Dipo")}
          paragraph={coachData?.data?.deliveryToDipo}
        />
        <LabelDescription
          heading={translate("বিতরণের তারিখ", "Delivery Date")}
          paragraph={formatter({
            type: "date",
            dateTime: coachData?.data?.deliveryDate,
          })}
        />
        <LabelDescription
          heading={translate("রঙ", "Color")}
          paragraph={coachData?.data?.color}
        />
        <LabelDescription
          heading={translate("আসনের সংখ্যা", "No Of Seat")}
          paragraph={coachData?.data?.noOfSeat}
        />
        <LabelDescription
          heading={translate("কোচের ধরন", "Coach Type")}
          paragraph={coachData?.data?.coachType}
        />
        <LabelDescription
          heading={translate("অর্থায়িত", "Financed By")}
          paragraph={coachData?.data?.financedBy}
        />
        <LabelDescription
          heading={translate("শর্তাবলী", "Terms")}
          paragraph={coachData?.data?.terms}
        />
        <LabelDescription
          heading={translate("সক্রিয়", "Active")}
          paragraph={coachData?.data?.active ? "Activate" : "Deactivated"}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsCoach;
