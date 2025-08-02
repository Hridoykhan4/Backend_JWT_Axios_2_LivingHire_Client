import axios from "axios";
import { useEffect } from "react";
import useAuthValue from "./useAuthValue";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
const useAxiosSecure = () => {
  const { logOut } = useAuthValue();
  const nav = useNavigate();
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          logOut().then(() => {
            nav(`/login`);
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
        axiosInstance.interceptors.response.eject(interceptor)
    }  

  }, [logOut, nav]);
  
  
  return axiosInstance;
};

export default useAxiosSecure;
