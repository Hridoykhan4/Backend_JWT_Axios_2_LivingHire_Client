import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import useAuthValue from "../../hooks/useAuthValue";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const UpdateJob = () => {
  const job = useLoaderData() || {};
  const nav = useNavigate();
  const { id } = useParams();
  const { user } = useAuthValue();
  const {
    job_title,
    category,
    description,
    min_price,
    max_price,
    deadline,
    bid_count,
    buyer,
  } = job || {};

  const [startDate, setStartDate] = useState(() =>
    deadline ? new Date(deadline.split("-").reverse().join("-")) : new Date()
  );

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    const { min_price, max_price, ...others } = formValues;
    others.min_price = parseFloat(min_price);
    others.max_price = parseFloat(max_price);
    others.deadline = startDate
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");
    others.bid_count = bid_count;
    others.buyer = {
      email: buyer.email,
      name: user?.displayName,
      photo: user?.photoURL,
    };

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/job/${id}`,
        others
      );
      if (data.modifiedCount) {
        toast.success("✅ Job updated successfully!");
        nav("/my-posted-jobs");
      }
    } catch (err) {
      toast.error(`❌ Failed to update: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-white to-gray-100 flex justify-center items-center">
      <Toaster position="top-center" />

      <section className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Update Job
        </h2>

        <form
          onSubmit={handleUpdateJob}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label
              htmlFor="job_title"
              className="block text-gray-700 font-medium mb-1"
            >
              Job Title
            </label>
            <input
              defaultValue={job_title}
              id="job_title"
              name="job_title"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              value={buyer.email}
              readOnly
              type="email"
              className="w-full px-4 py-2 border bg-gray-100 text-gray-600 border-gray-300 rounded-md cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Deadline
            </label>
            <DatePicker
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-1"
            >
              Category
            </label>
            <select
              name="category"
              id="category"
              defaultValue={category}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Web Development">Web Development</option>
              <option value="Graphics Design">Graphics Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="min_price"
              className="block text-gray-700 font-medium mb-1"
            >
              Minimum Price ($)
            </label>
            <input
              defaultValue={min_price}
              id="min_price"
              name="min_price"
              type="number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="max_price"
              className="block text-gray-700 font-medium mb-1"
            >
              Maximum Price ($)
            </label>
            <input
              defaultValue={max_price}
              id="max_price"
              name="max_price"
              type="number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Job Description
            </label>
            <textarea
              defaultValue={description}
              id="description"
              name="description"
              rows="4"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div className="md:col-span-2 text-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdateJob;
