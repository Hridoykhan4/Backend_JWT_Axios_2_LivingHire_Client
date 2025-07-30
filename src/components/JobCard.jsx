import { Link } from "react-router-dom";

const JobCard = ({ job = {} }) => {
  return (
    <Link
      to={`/job/${job?._id}`}
      className="w-full max-w-sm px-5 py-4 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
    >
      {/* Buyer Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={job?.buyer?.photo}
          alt={job?.buyer?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">
            {job?.buyer?.name}
          </p>
          <p className="text-xs text-gray-500">{job?.buyer?.email}</p>
        </div>
      </div>

      {/* Deadline and Category */} 
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">Deadline: {job?.deadline}</span>
        <span className="px-3 py-[2px] text-[10px] font-semibold text-blue-800 bg-blue-100 rounded-full shadow-sm">
          {job?.category}
        </span>
      </div>

      {/* Job Title */}
      <h1 className="text-lg font-semibold text-gray-900 leading-tight">
        {job?.job_title}
      </h1>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
        {job?.description}
      </p>

      {/* Price & Bids */}
      <div className="mt-4 flex flex-col gap-1">
        <p className="text-sm font-semibold text-green-700">
          💰 Range: ${job?.min_price} - ${job?.max_price}
        </p>
        <p className="text-sm text-gray-700">📥 Total Bids: {job?.bid_count}</p>
      </div>
    </Link>
  );
};

export default JobCard;
