import useAuthValue from "../../hooks/useAuthValue";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";
const BidRequests = () => {
  // const [bids, setBids] = useState([]);
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const getBidJobs = async () => {
    const { data } = await axiosSecure(`/bid-requests/${user?.email}`);
    return data;
  };
  const {
    isPending,
    error,
    isError,
    data: bids = [],
  } = useQuery({
    queryKey: ["bid-requests", user?.email],
    queryFn: () => getBidJobs(),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosSecure.patch(`/update-bidStatus/${id}`, {
        status,
      });
      return data;
    },
    onSuccess: () => {
      // Easy system
      // refetch()

      // Now hard One for auto refetching from any components
      queryClient.invalidateQueries({ queryKey: ["bid-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-bids"] }); 

      toast.success(`Updated Successfully`, {
        position: "top-right",
        className: "font-semibold text-xl",
      });
    },
  });

  const handleStatus = async (id, prevState, status) => {
    if (prevState === status) return console.log(`Gajati hai kya`);
    await mutateAsync({ id, status });
  };

  if (isPending) return <LoadingSpinner></LoadingSpinner>;
  if (isError)
    return (
      <p className="text-center text-red-600  underline font-semibold ">
        Error: {error.message}
      </p>
    );


  return (
    <section className="container px-4 mx-auto pt-12">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium text-gray-800 ">Bid Requests</h2>

        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full ">
          {bids?.length} Requests
        </span>
      </div>

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
                  {bids.map((bid) => (
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
                              bid.category === "Web Development"
                                ? `text-blue-500 bg-blue-100/60`
                                : bid.category === "Graphics Design"
                                ? "text-emerald-500 bg-emerald-100/60"
                                : "text-pink-500 bg-pink-100/60"
                            } text-xs  rounded-full`}
                          >
                            {bid?.category}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 
                            ${
                              bid.status === "Pending" &&
                              "bg-yellow-100/60 text-yellow-500"
                            }
                            ${
                              bid.status === "In Progress" &&
                              "bg-emerald-100/60 text-emerald-500"
                            }
                            ${
                              bid.status === "Rejected" &&
                              "bg-red-100/60 text-red-500"
                            }
                              `}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                          <h2 className="text-sm font-normal ">
                            {bid?.status}
                          </h2>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default BidRequests;
