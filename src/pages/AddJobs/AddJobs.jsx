import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAuthValue from "../../hooks/useAuthValue";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddJobs = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { user } = useAuthValue();
  const nav = useNavigate();

  const handleAddJob = async (e) => {
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
    others.buyer = {
      email: user?.email,
      name: user?.displayName,
      photo: user?.photoURL,
    };
    others.bid_count = 0;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs`,
        others
      );
      if (data.insertedId) {
        toast.success(`🛠️ Job posted successfully!`);
        nav(`/my-posted-jobs`);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to post job");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-white to-gray-100 flex justify-center items-center">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "text-sm font-semibold text-gray-800",
          style: {
            borderRadius: "10px",
            background: "#f0f9ff",
            padding: "12px 16px",
          },
        }}
      />

      <section className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Post a New Job
        </h2>

        <form
          onSubmit={handleAddJob}
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
              id="job_title"
              name="job_title"
              type="text"
              required
              placeholder="Ex: Build a React app"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              defaultValue={user?.email}
              readOnly
              id="emailAddress"
              type="email"
              className="w-full px-4 py-2 border bg-gray-100 text-gray-600 border-gray-300 rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Deadline
            </label>
            <DatePicker
              required
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              required
              name="category"
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select category</option>
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
              required
              id="min_price"
              name="min_price"
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              required
              id="max_price"
              name="max_price"
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              required
              id="description"
              name="description"
              rows="4"
              placeholder="Explain what needs to be done..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            ></textarea>
          </div>

          <div className="md:col-span-2 text-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Post Job
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddJobs;
