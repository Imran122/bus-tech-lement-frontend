import { ILabelPlaceholder } from "./loginForm";

interface IAddUpdateCoachConfigurationFromProps {
  coachNo: ILabelPlaceholder;
  registrationNo: ILabelPlaceholder;
  routeId: ILabelPlaceholder;
  fromCounterId: ILabelPlaceholder;
  destinationCounterId: ILabelPlaceholder;
  departureDate: ILabelPlaceholder;
  seatPlan: ILabelPlaceholder;
  coachType: ILabelPlaceholder;
  schedule: ILabelPlaceholder;
  coachClass: ILabelPlaceholder;
  type: ILabelPlaceholder;
  saleStatus: ILabelPlaceholder;
  holdingTime: ILabelPlaceholder;
  fareAllowed: ILabelPlaceholder;
  vipTimeOut: ILabelPlaceholder;
  seats: ILabelPlaceholder;
  supervisorId: ILabelPlaceholder;
  fareId: ILabelPlaceholder;
  driverId: ILabelPlaceholder;
  tokenAvailable: ILabelPlaceholder;
}

export const addUpdateCoachConfigurationForm: IAddUpdateCoachConfigurationFromProps =
  {
    supervisorId: {
      label: {
        en: "Supervisor ✼",
        bn: "সুপারভাইজর ✼",
      },
      placeholder: {
        en: "Select supervisor",
        bn: "সুপারভাইজর নির্বাচন করুন",
      },
    },
    tokenAvailable: {
      label: {
        en: "Token Availabe ✼",
        bn: "টোকেন পরিমাণ ✼",
      },
      placeholder: {
        en: "Token Availabe",
        bn: "টোকেন পরিমাণ",
      },
    },
    driverId: {
      label: {
        en: "Driver ✼",
        bn: "চালক ✼",
      },
      placeholder: {
        en: "Select Driver",
        bn: "চালক নির্বাচন করুন",
      },
    },
    departureDate: {
      label: {
        en: "Departure Date ✼",
        bn: "সুপারভাইজর ✼",
      },
      placeholder: {
        en: "Select departure date",
        bn: "সুপারভাইজর নির্বাচন করুন",
      },
    },
    coachNo: {
      label: {
        en: "Coach Number ✼",
        bn: "কোচ নম্বর ✼",
      },
      placeholder: {
        en: "Enter coach number",
        bn: "কোচ নম্বর লিখুন",
      },
    },
    registrationNo: {
      label: {
        en: "Select Registration Number",
        bn: "নিবন্ধন নম্বর নির্বাচন করুন",
      },
      placeholder: {
        en: "Select registration number",
        bn: "নিবন্ধন নম্বর নির্বাচন করুন",
      },
    },
    routeId: {
      label: {
        en: "Route ✼",
        bn: "রুট ✼",
      },
      placeholder: {
        en: "Select route",
        bn: "রুট নির্বাচন করুন",
      },
    },
    fromCounterId: {
      label: {
        en: "Starting Counter ✼",
        bn: "শুরু করার কাউন্টার ✼",
      },
      placeholder: {
        en: "Select starting counter",
        bn: "শুরু করার কাউন্টার নির্বাচন করুন",
      },
    },
    destinationCounterId: {
      label: {
        en: "Ending Counter ✼",
        bn: "গন্তব্য কাউন্টার ✼",
      },
      placeholder: {
        en: "Select ending counter",
        bn: "গন্তব্য কাউন্টার নির্বাচন করুন",
      },
    },
    seatPlan: {
      label: {
        en: "Seat Plan ✼",
        bn: "আসন বিন্যাস ✼",
      },
      placeholder: {
        en: "Enter seat plan",
        bn: "আসন বিন্যাস লিখুন",
      },
    },
    coachType: {
      label: {
        en: "Coach Type ✼",
        bn: "কোচের ধরন ✼",
      },
      placeholder: {
        en: "Select coach type",
        bn: "কোচের ধরন নির্বাচন করুন",
      },
    },
    coachClass: {
      label: {
        en: "Coach Class ✼",
        bn: "কোচ ✼",
      },
      placeholder: {
        en: "Select coach class",
        bn: "কোচ নির্বাচন করুন",
      },
    },
    schedule: {
      label: {
        en: "Schedule ✼",
        bn: "সময়সূচী ✼",
      },
      placeholder: {
        en: "Select schedule",
        bn: "সময়সূচী নির্বাচন করুন",
      },
    },
    type: {
      label: {
        en: "Type ✼",
        bn: "ধরন ✼",
      },
      placeholder: {
        en: "Select type",
        bn: "ধরন নির্বাচন করুন",
      },
    },
    saleStatus: {
      label: {
        en: "Sale Status ✼",
        bn: "বিক্রয় অবস্থা ✼",
      },
      placeholder: {
        en: "Select sale status",
        bn: "বিক্রয় অবস্থা নির্বাচন করুন",
      },
    },
    fareId: {
      label: {
        en: "Fare Amount ✼",
        bn: "ভাড়ার পরিমাণ ✼",
      },
      placeholder: {
        en: "Select fare amount",
        bn: "ভাড়ার পরিমাণ নির্বাচন করুন",
      },
    },
    holdingTime: {
      label: {
        en: "Holding Time",
        bn: "হোল্ডিং সময়",
      },
      placeholder: {
        en: "Enter holding time",
        bn: "হোল্ডিং সময় লিখুন",
      },
    },
    fareAllowed: {
      label: {
        en: "Fare Allowed",
        bn: "ভাড়া অনুমোদিত",
      },
      placeholder: {
        en: "Enter fare allowed",
        bn: "ভাড়া অনুমোদিত লিখুন",
      },
    },
    vipTimeOut: {
      label: {
        en: "VIP Time Out",
        bn: "ভিআইপি সময় আউট",
      },
      placeholder: {
        en: "Enter VIP time out",
        bn: "ভিআইপি সময় আউট লিখুন",
      },
    },

    seats: {
      label: {
        en: "Seats ",
        bn: "আসন ",
      },
      placeholder: {
        en: "Enter seats",
        bn: "আসন লিখুন",
      },
    },
  };
