import { Children, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLoaderData } from "react-router-dom";
import useAuthValue from "../../hooks/useAuthValue";
import axios from "axios";
import toast from "react-hot-toast";

const JobDetails = () => {
  const job = useLoaderData();
  const { user } = useAuthValue();

  const [startDate, setStartDate] = useState(new Date());

  const handleSubmitBids = async (e) => {
    if (user?.email === job.buyer.email)
      return toast.error("Action Not Permitted");
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValues = Object.fromEntries(formData.entries());

    const { price, ...rest } = inputValues;
    rest.jobId = job._id;
    rest.buyer_email = job.buyer.email;
    rest.bid_price = parseFloat(price);
    console.log(rest.bid_price, job?.min_price)
    if (rest.bid_price < job?.min_price)
      return toast.error(`Offer more or at least equal to Minimum price`);

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

    /*  try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/bid`,
        rest
      );
      if (data.insertedId) {
        toast.success(`Placed Bid for ${job?.job_title}`);
      }
    } catch (err) {
      console.log(err);
    } */
  };

  return (
    <div className="flex flex-col md:flex-row justify-around gap-5  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto ">
      {/* Job Details */}
      <div className="flex-1 px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]">
        {/* Deadline and Category */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-gray-800">
            Deadline: {job?.deadline}
          </span>
          <span className="px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full">
            {job?.category}
          </span>
        </div>

        {/* Job Title */}
        <div>
          <h1 className="mt-2 text-3xl font-semibold text-gray-800">
            {job?.job_title}
          </h1>

          {/* Job Description */}
          <p className="mt-2 text-lg text-gray-600">{job?.description}</p>

          {/* Buyer Info */}
          <p className="mt-6 text-sm font-bold text-gray-600">Buyer Details:</p>
          <div className="flex items-center gap-5">
            <div>
              <p className="mt-2 text-sm text-gray-600">
                Name: {job?.buyer?.name}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Email: {job?.buyer?.email}
              </p>
            </div>
            <div className="rounded-full overflow-hidden w-14 h-14">
              <img
                src={job?.buyer?.photo}
                alt={job?.buyer?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Price Range */}
          <p className="mt-6 text-lg font-bold text-gray-600">
            Range: ${job?.min_price} - ${job?.max_price}
          </p>
        </div>
      </div>
      {/* Place A Bid Form */}
      <section className="p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]">
        <h2 className="text-lg font-semibold text-gray-700 capitalize ">
          Place A Bid
        </h2>

        <form onSubmit={handleSubmitBids}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700 " htmlFor="price">
                Price
              </label>
              <input
                id="price"
                type="text"
                name="price"
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-gray-700 " htmlFor="emailAddress">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                name="email"
                readOnly
                disabled
                defaultValue={user?.email}
                className="block cursor-not-allowed w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md"
              />
            </div>

            <div>
              <label className="text-gray-700 " htmlFor="comment">
                Comment
              </label>
              <input
                id="comment"
                name="comment"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="text-gray-700">Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className="border p-2 rounded-md"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              disabled={user?.email === job?.buyer?.email}
              type="submit"
              className="px-8 py-2.5 disabled:bg-gray-300 disabled:cursor-not-allowed leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Place Bid
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default JobDetails;
