import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAuthValue from "../../hooks/useAuthValue";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const JobDetails = () => {
  const job = useLoaderData();
  const { user } = useAuthValue();
  const nav = useNavigate();
  const [startDate, setStartDate] = useState(new Date());

  const handleSubmitBids = async (e) => {
    e.preventDefault();
    if (user?.email === job.buyer.email)
      return toast.error("Action Not Permitted");
    const formData = new FormData(e.target);
    const inputValues = Object.fromEntries(formData.entries());

    const { price, ...rest } = inputValues;
    rest.jobId = job._id;
    rest.buyer = {
      email: job.buyer.email,
      name: job.buyer.name,
      photo: job.buyer.photo,
    };
    rest.bid_price = parseFloat(price);
    rest.bidder_name = user?.displayName;

    if (rest.bid_price < job?.min_price)
      return toast.error("Offer more or at least equal to Minimum price");

    const [day, month, year] = job.deadline.split("-");
    const parsedJobDeadline = new Date(`${year}-${month}-${day}`);
    const bidDeadline = startDate;

    if (bidDeadline > parsedJobDeadline)
      return toast.error("Bid deadline cannot exceed the job deadline.");

    rest.deadline = startDate.toLocaleDateString("en-GB");
    rest.status = "Pending";
    rest.category = job?.category;
    rest.job_title = job?.job_title;
    rest.bidder_email = user?.email;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/bid`,
        rest
      );
      if (data.insertedId) {
        toast.success(`Placed Bid for ${job?.job_title}`);
        nav(`/my-bids`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="px-4 py-10 bg-gradient-to-br from-white to-gray-100 min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "text-sm font-medium text-gray-800",
          style: {
            borderRadius: "10px",
            background: "#f0f9ff",
            color: "#333",
            padding: "12px 16px",
          },
        }}
      />

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Job Details */}
        <div className="flex-1 bg-white shadow-xl rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Deadline: {job?.deadline}
            </span>
            <span className="text-xs uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              {job?.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            {job?.job_title}
          </h1>
          <p className="text-gray-600 mb-4">{job?.description}</p>

          <div className="mb-4">
            <h3 className="font-bold text-gray-700 mb-2">Buyer Details:</h3>
            <div className="flex items-center gap-4">
              <img
                src={job?.buyer?.photo}
                alt={job?.buyer?.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <p className="text-sm text-gray-700">
                  Name: {job?.buyer?.name}
                </p>
                <p className="text-sm text-gray-700">
                  Email: {job?.buyer?.email}
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg font-medium text-gray-700">
            Budget Range: ${job?.min_price} - ${job?.max_price}
          </p>
        </div>

        {/* Bid Form */}
        <form
          onSubmit={handleSubmitBids}
          className="flex-1 bg-white shadow-xl rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Place a Bid
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-gray-700 font-medium mb-1"
              >
                Price ($)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="emailAddress"
                className="block text-gray-700 font-medium mb-1"
              >
                Your Email
              </label>
              <input
                id="emailAddress"
                type="email"
                name="email"
                defaultValue={user?.email}
                readOnly
                disabled
                className="w-full px-4 py-2 border bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300 rounded-lg"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label
                htmlFor="comment"
                className="block text-gray-700 font-medium mb-1"
              >
                Comment
              </label>
              <input
                id="comment"
                name="comment"
                type="text"
                placeholder="Optional comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Select Deadline
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="mt-6 text-end">
            <button
              type="submit"
              disabled={user?.email === job?.buyer?.email}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Place Bid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobDetails;
