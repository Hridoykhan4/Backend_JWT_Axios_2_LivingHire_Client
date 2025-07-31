import { Link } from "react-router-dom";

const JobCard = ({ job = {} }) => {
  return (
    <Link
      to={`/job/${job?._id}`}
      className="w-full max-w-sm mx-auto px-6 py-5 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.025] transition-all duration-300 border border-transparent hover:border-blue-200 group"
    >
      {/* Buyer Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={job?.buyer?.photo}
          alt={job?.buyer?.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {job?.buyer?.name}
          </p>
          <p className="text-xs text-gray-500">{job?.buyer?.email}</p>
        </div>
      </div>

      {/* Deadline & Category */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">
          🗓 Deadline: {job?.deadline}
        </span>
        <span className="px-3 py-[2px] text-[11px] font-medium text-blue-700 bg-blue-100 rounded-full shadow-sm">
          {job?.category}
        </span>
      </div>

      {/* Job Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
        {job?.job_title}
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-3">
        {job?.description}
      </p>

      {/* Price & Bid Info */}
      <div className="mt-4 flex flex-col gap-1">
        <p className="text-sm font-semibold text-green-700">
          💰 ${job?.min_price} - ${job?.max_price}
        </p>
        <p className="text-sm text-gray-700">
          📥 Bids: <span className="font-medium">{job?.bid_count}</span>
        </p>
      </div>
    </Link>
  );
};

export default JobCard;
