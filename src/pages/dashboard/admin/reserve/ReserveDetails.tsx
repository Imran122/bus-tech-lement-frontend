import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleReserveQuery } from "@/store/api/reserve/reserveApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsReserveProps {
  id: number | null;
}

const ReserveDetails: FC<IDetailsReserveProps> = ({ id }) => {
  const { data: reserveData, isLoading: reserveLoading } = useGetSingleReserveQuery(id);
  const { translate } = useCustomTranslator();

  if (reserveLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }

  return (
    <DetailsWrapper
      heading={translate("রিজার্ভ ওভারভিউ", "Reserve Overview")}
      subHeading={translate(
        "আপনার রিজার্ভ তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your reserve information and recent activities."
      )}
    >
      <GridWrapper>
      <LabelDescription
          heading={translate("যাত্রীর নাম", "Passenger Name")}
          paragraph={reserveData?.data?.passengerName}
        />
        <LabelDescription
          heading={translate("যোগাযোগ নম্বর", "Contact No")}
          paragraph={reserveData?.data?.contactNo}
        />
        <LabelDescription
          heading={translate("ঠিকানা", "Address")}
          paragraph={reserveData?.data?.address}
        />
        <LabelDescription
          heading={translate("মোট অর্থ", "Amount")}
          paragraph={formatter({ type: "amount", amount: reserveData?.data?.amount })}
        />
        <LabelDescription
          heading={translate("পরিশোধিত অর্থ", "Paid Amount")}
          paragraph={formatter({ type: "amount", amount: reserveData?.data?.paidAmount })}
        />
        <LabelDescription
          heading={translate("বকেয়া অর্থ", "Due Amount")}
          paragraph={formatter({ type: "amount", amount: reserveData?.data?.dueAmount })}
        />
        <LabelDescription
          heading={translate("নিবন্ধন নম্বর", "Registration No")}
          paragraph={reserveData?.data?.registrationNo}
        />
        <LabelDescription
          heading={translate("রুট নাম", "Route Name")}
          paragraph={reserveData?.data?.route?.routeName}
        />
        <LabelDescription
          heading={translate("আসনের সংখ্যা", "No Of Seat")}
          paragraph={reserveData?.data?.noOfSeat}
        />
        <LabelDescription
          heading={translate("যাত্রা শুরু তারিখ", "From Date")}
          paragraph={formatter({ type: "date", dateTime: reserveData?.data?.fromDate })}
        />
        <LabelDescription
          heading={translate("যাত্রা শুরুর সময়", "From DateTime")}
          paragraph={reserveData?.data?.fromDateTime}
        />
        <LabelDescription
          heading={translate("যাত্রা শেষ তারিখ", "To Date")}
          paragraph={formatter({ type: "date", dateTime: reserveData?.data?.toDate })}
        />
        <LabelDescription
          heading={translate("যাত্রা শেষের সময়", "To DateTime")}
          paragraph={reserveData?.data?.toDateTime}
        />
        <LabelDescription
          heading={translate("মন্তব্য", "Remarks")}
          paragraph={reserveData?.data?.remarks || translate("কোন মন্তব্য নেই", "No remarks")}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default ReserveDetails;
