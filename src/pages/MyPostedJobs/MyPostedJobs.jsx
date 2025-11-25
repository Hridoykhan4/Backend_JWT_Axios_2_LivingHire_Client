/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthValue from "../../hooks/useAuthValue";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyPostedJobs = () => {
  const axiosSecure = useAxiosSecure();
  const [myPostedJobs, setMyPostedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const { user } = useAuthValue();
  const [loading, setLoading] = useState(true);

  const getPostedJobs = async () => {
    setLoading(true);
    try {
      if (!user) return;
      const { data } = await axiosSecure(`/jobs/${user.email}`);
      setMyPostedJobs(data);
      setAllJobs(data);
    } catch (err) {
      toast.error("Failed to load", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPostedJobs();
  }, [user]);

  if (!user?.email) return <LoadingSpinner />;

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/job/${id}`
      );
      if (data.deletedCount) {
        toast.success("Successfully Removed The Job");
        // refresh UI
        getPostedJobs();
        // setMyPostedJobs((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterByCategory = (e) => {
    const category = e.target.value;
    if (category === "All") {
      setMyPostedJobs(allJobs);
    } else {
      const filter = allJobs.filter((job) => job.category === category);
      setMyPostedJobs(filter);
    }
  };

  return (
    <section className="container  px-4 mx-auto pt-12">
      <div className="flex items-center gap-x-3 ">
        <h2 className="text-lg font-medium text-gray-800 ">My Posted Jobs</h2>

        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full ">
          {myPostedJobs.length} Job
        </span>

        {myPostedJobs.length > 5 && (
          <div className="ms-auto">
            <select
              onChange={handleFilterByCategory}
              defaultValue=""
              className="select select-info"
            >
              <option value="" disabled={true}>
                Filter By Category
              </option>
              <option value={`All`}>All</option>
              <option value={`Web Development`}>Web</option>
              <option value={`Graphics Design`}>Graphics</option>
              <option value={`Digital Marketing`}>Marketing</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner></LoadingSpinner>
      ) : myPostedJobs.length > 0 ? (
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200  md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        <div className="flex items-center gap-x-3">
                          <span>Title</span>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        <span>Deadline</span>
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        <button className="flex items-center gap-x-2">
                          <span>Price Range</span>
                        </button>
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Total Applicants
                      </th>

                      <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 ">
                    {myPostedJobs.map((job) => (
                      <tr key={job._id}>
                        <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                          {job?.job_title}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                          {job?.deadline}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                          ${job?.min_price}-${job?.max_price}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-2">
                            <p
                              className={`px-3 py-1 ${
                                job?.category === "Web Development"
                                  ? "text-blue-500 bg-blue-100/60"
                                  : job?.category === "Digital Marketing"
                                  ? `text-yellow-500 bg-yellow-100/60`
                                  : "text-green-500 bg-green-100/60"
                              }  text-xs  rounded-full`}
                            >
                              {job?.category}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                          {job?.totalApplicants || 0}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            <button
                              onClick={() => handleDelete(job?._id)}
                              className="text-gray-500 transition-colors duration-200   hover:text-red-500 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </button>

                            <Link
                              to={`/update/${job._id}`}
                              className="text-gray-500 transition-colors duration-200   hover:text-yellow-500 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                            </Link>
                            <Link
                              to={`/viewApplicants/${job._id}`}
                              className="text-gray-500 transition-colors duration-200   hover:text-yellow-500 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h2>No Job has posted yet,OOpps!</h2>
      )}
    </section>
  );
};

export default MyPostedJobs;
