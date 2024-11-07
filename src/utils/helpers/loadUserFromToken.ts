import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";
import { setUser } from "../../store/api/user/userSlice";
interface DecodedToken {
  id: string;
  email: string;
  name: string;
  address?: string;
  role: string;
  counter?: Counter;
}

export const loadUserFromToken = async (dispatch: any) => {
  const token = Cookies.get("__t_beta__token");

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log("decoded token: ", decoded);
      dispatch(
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,

          address: decoded.counter?.address || "",
          role: decoded.role,
        })
      );
    } catch (error) {
      console.error("Invalid token or error in jwt decoding", error);
    }
  } else {
    // Dispatch an empty user object to avoid `null`
    dispatch(setUser({ id: "", email: "", name: "", address: "", role: "" }));
  }
};
