import { useContext } from "react";
import AuthContext from "../provider/AuthContext";

const useAuthValue = () => {
  return useContext(AuthContext);
};

export default useAuthValue;
