import { ILabelPlaceholder } from "./loginForm";

interface IAddUpdateRouteFormProps {
  routeType: ILabelPlaceholder;
  routeDirection: ILabelPlaceholder;
  kilo: ILabelPlaceholder;
  isPassengerInfoRequired: ILabelPlaceholder;
  via: ILabelPlaceholder;
  from: ILabelPlaceholder;
  to: ILabelPlaceholder;
  routeName: ILabelPlaceholder;
  viaStations: ILabelPlaceholder;
}

export const addUpdateRouteForm: IAddUpdateRouteFormProps = {
  routeType: {
    label: {
      en: "Route Type ",
      bn: "রুট টাইপ",
    },
    placeholder: {
      en: "Select route type",
      bn: "রুট টাইপ নির্বাচন করুন",
    },
  },
  routeDirection: {
    label: {
      en: "Route Direction",
      bn: "রুট দিক",
    },
    placeholder: {
      en: "Select route direction",
      bn: "রুট দিক নির্বাচন করুন",
    },
  },
  kilo: {
    label: {
      en: "Distance (Kilo)",
      bn: "দূরত্ব (কিমি)",
    },
    placeholder: {
      en: "Enter distance in kilo",
      bn: "কিমিতে দূরত্ব লিখুন",
    },
  },
  isPassengerInfoRequired: {
    label: {
      en: "Passenger Information Permission",
      bn: "যাত্রী তথ্যের অনুমতি",
    },
    placeholder: {
      en: "Select passenger information permission",
      bn: "যাত্রী তথ্যের অনুমতি নির্বাচন করুন",
    },
  },
  via: {
    label: {
      en: "Via",
      bn: "মাধ্যমে",
    },
    placeholder: {
      en: "Enter via",
      bn: "মাধ্যমে লিখুন",
    },
  },
  from: {
    label: {
      en: "Starting Station ✼",
      bn: "শুরু স্টেশন ✼",
    },
    placeholder: {
      en: "Select starting station",
      bn: "শুরু স্টেশন নির্বাচন করুন",
    },
  },
  to: {
    label: {
      en: "Destination Station ✼",
      bn: "গন্তব্য স্টেশন ✼",
    },
    placeholder: {
      en: "Select destination station",
      bn: "গন্তব্য স্টেশন নির্বাচন করুন",
    },
  },
  routeName: {
    label: {
      en: "Route Name (readonly) ✼",
      bn: "রুট নাম লিখুন ✼",
    },
    placeholder: {
      en: "Starting ➜ ending station ",
      bn: "শুরু ➜ শেষ স্টেশন",
    },
  },
  viaStations: {
    label: {
      en: "Via Stations ✼",
      bn: "মাধ্যমে স্টেশন ✼",
    },
    placeholder: {
      en: "Select via stations",
      bn: "মাধ্যমে স্টেশন নির্বাচন করুন",
    },
  },
};
