import JobCard from "../../components/JobCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const itemsPerPage = 10;
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [
    ...Array(numberOfPages)
      .keys()
      .map((e) => e + 1),
  ];

  useEffect(() => {
    const getJobsCount = async () => {
      const { data } = await axiosSecure(
        `/jobs-count?filter=${filter}&search=${search.trim()}`
      );
      setCount(data?.count);
    };

    getJobsCount();
  }, [axiosSecure, filter, search]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axiosSecure(
        `/jobs-paginated?page=${currentPage}&size=${itemsPerPage}&filter=${filter}&sort=${sort}&search=${search.trim()}`
      );
      setJobs(data);
    };

    getData();
  }, [axiosSecure, currentPage, itemsPerPage, filter, sort, search]);

  const handleReset = () => {
    setFilter("");
    setSort("");
    setSearch("");
    setSearchText("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchText);
    setCurrentPage(1);
  };

  return (
    <div className="container px-6 py-10 mx-auto min-h-[calc(100vh-306px)] flex flex-col justify-between">
      <div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5 ">
          <div>
            <select
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              value={filter}
              name="category"
              id="category"
              className="border p-4 rounded-lg"
            >
              <option value="">Filter By Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Graphics Design">Graphics Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
          </div>

          <form onSubmit={handleSearch}>
            <div className="flex p-1 overflow-hidden border rounded-lg    focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
              <input
                className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent"
                type="text"
                name="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Enter Job Title"
                aria-label="Enter Job Title"
              />

              <button
                disabled={!searchText.trim()}
                type="submit"
                className="px-1 md:px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-gray-700 rounded-md disabled:text-gray-100 disabled:hover:bg-gray-600 disabled:cursor-not-allowed hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
              >
                Search
              </button>
            </div>
          </form>
          <div>
            <select
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              value={sort}
              name="category"
              id="category"
              className="border p-4 rounded-md"
            >
              <option value="">Sort By Bid Price</option>
              <option value="dsc">Descending Order</option>
              <option value="asc">Ascending Order</option>
            </select>
          </div>
          <button onClick={handleReset} className="btn">
            Reset
          </button>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard job={job} key={job._id}></JobCard>
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-wrap gap-4 justify-center items-center mt-9">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 mx-1 text-gray-700 disabled:text-gray-500 capitalize bg-gray-200 rounded-md disabled:cursor-not-allowed disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:bg-blue-500  hover:text-white"
        >
          <div className="flex items-center -mx-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>

            <span className="mx-1">previous</span>
          </div>
        </button>

        {pages.map((btnNum) => (
          <button
            onClick={() => {
              setCurrentPage(btnNum);
            }}
            className={`${
              currentPage === btnNum ? "bg-blue-500 text-white" : ""
            } px-4 py-2 mx-1 transition-colors duration-300 transform  rounded-md sm:inline hover:bg-blue-500  hover:text-white`}
            key={btnNum}
          >
            {btnNum}
          </button>
        ))}

        {/* Next button */}
        <button
          disabled={currentPage === numberOfPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-gray-200 rounded-md hover:bg-blue-500 disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
        >
          <div className="flex items-center -mx-1">
            <span className="mx-1">Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AllJobs;
