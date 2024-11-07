import { appConfiguration } from "../constants/common/appConfiguration";

interface ILocalStorageDataProps {
  sidebar?: string;
  route?: string;
}

export const shareWithLocal = (
  option: "set" | "get" | "remove",
  key: keyof ILocalStorageDataProps,
  value?: unknown
): unknown => {
  const storageKey = appConfiguration.appCode;

  // RETRIEVE THE EXISTING DATA OBJECT FROM LOCAL STORAGE

  const storedData = localStorage.getItem(storageKey);
  const dataObject: ILocalStorageDataProps = storedData
    ? JSON.parse(storedData)
    : {};

  if (option === "set") {
    // ADD OR UPDATE THE KEY-VALUE PAIR
    dataObject[key] = value as string | undefined;
    localStorage.setItem(storageKey, JSON.stringify(dataObject));
    return;
  }

  if (option === "get") {
    return dataObject[key] || null; // RETURN THE VALUE FOR THE KEY, OR NULL IF IT DOESN'T EXIST
  }

  if (option === "remove") {
    delete dataObject[key]; // REMOVE THE KEY-VALUE PAIR
    localStorage.setItem(storageKey, JSON.stringify(dataObject));
    return;
  }
};
