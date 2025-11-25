import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useState } from "react";

const statusStyles = {
  Pending: "bg-yellow-100/60 text-yellow-500",
  "In Progress": "bg-emerald-100/60 text-emerald-500",
  Rejected: "bg-red-100/60 text-red-500",
};
const dotColors = {
  Pending: "bg-yellow-500",
  "In Progress": "bg-emerald-500",
  Rejected: "bg-red-500",
};
const ViewApplicants = () => {
  const loadedApplicants = useLoaderData();
  const [applications, setApplications] = useState(loadedApplicants);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosSecure.patch(`/update-bidStatus/${id}`, {
        status,
      });
      return { data, id, status };
    },
    onSuccess: ({ data, id, status }) => {
      // Easy system
      // refetch()
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );

      if (data?.modifiedCount) {
        toast.success(`Updated Successfully`, {
          position: "top-right",
          className: "font-semibold text-xl",
        });
        // Now hard One for auto refetching from any components
        queryClient.invalidateQueries({ queryKey: ["bid-requests"] });
        queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      }
    },
    onError: (err) => console.log(err),
  });

  console.log(applications);

  const handleStatus = async (id, prevState, status) => {
    if (prevState === status) return console.log(`Gajati hai kya`);
    await mutateAsync({ id, status });
  };

  if (applications.length === 0)
    return (
      <p className="text-red-600 font-semibold mt-5 text-center">
        No Applications Yet !!{" "}
      </p>
    );

  return (
    <div className="overflow-x-auto mt-10">
      <table className="table divide-y divide-gray-200">
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
              className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500"
            >
              <div className="flex items-center gap-x-3">
                <span>Email</span>
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
                <span>Price</span>
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
              Status
            </th>

            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 ">
          {applications.map((bid) => (
            <tr key={bid._id}>
              <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                {bid.job_title}
              </td>
              <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                {bid?.bidder_email}
              </td>

              <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                {bid.deadline}
              </td>

              <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                ${bid?.bid_price}
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div className="flex items-center gap-x-2">
                  <p
                    className={`px-3 py-1  ${
                      dotColors[bid.category]
                    } text-xs  rounded-full`}
                  >
                    {bid?.category}
                  </p>
                </div>
              </td>
              <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                    statusStyles[bid.status]
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                  <h2 className="text-sm font-normal ">{bid?.status}</h2>
                </div>
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div className="flex items-center gap-x-6">
                  {/* Accept button: In Progress */}
                  <button
                    onClick={() =>
                      handleStatus(bid._id, bid.status, "In Progress")
                    }
                    disabled={bid.status === "Complete"}
                    className="text-gray-500 transition-colors duration-200  disabled:text-gray-500 disabled:cursor-not-allowed hover:text-yellow-500 focus:outline-none"
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
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </button>

                  {/* Reject button */}
                  <button
                    onClick={() =>
                      handleStatus(bid._id, bid.status, "Rejected")
                    }
                    disabled={bid.status === "Complete"}
                    className="text-gray-500 transition-colors duration-200  disabled:text-gray-500 disabled:cursor-not-allowed hover:text-yellow-500 focus:outline-none"
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
                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplicants;
