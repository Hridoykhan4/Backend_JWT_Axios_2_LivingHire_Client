import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import JobCard from "./JobCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const categories = [
  { label: "Web Development", value: "Web Development" },
  { label: "Graphics Design", value: "Graphics Design" },
  { label: "Digital Marketing", value: "Digital Marketing" },
];

const TabCategories = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedTabs, setSelectedTabs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      const category = categories[selectedTabs].value;
      try {
        const { data } = await axios(
          `${import.meta.env.VITE_API_URL}/jobs?category=${category}`
        );
        setJobs(data);
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [selectedTabs]);

  return (
    <Tabs
      selectedIndex={selectedTabs}
      onSelect={(index) => setSelectedTabs(index)}
    >
      <div className="py-14 px-6 mx-auto container">
        <h1 className="text-3xl font-bold text-center text-gray-800 lg:text-4xl">
          🔍 Browse Jobs by Categories
        </h1>

        <p className="max-w-2xl mx-auto mt-4 text-center text-gray-500">
          Choose from Web Development, Graphics Design, or Digital Marketing.
        </p>

        <div className="flex justify-center mt-8">
          <TabList className="flex flex-wrap gap-4 justify-center text-sm md:text-base font-medium">
            {categories.map((cat, idx) => (
              <Tab key={idx}>{cat.label}</Tab>
            ))}
          </TabList>
        </div>

        {categories.map((_, idx) => (
          <TabPanel key={idx}>
            {selectedTabs === idx ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10 min-h-[300px] animate-fadeIn">
                {loading ? (
                  <div className="col-span-full text-center text-gray-500 text-lg">
                    <LoadingSpinner></LoadingSpinner>
                  </div>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => <JobCard key={job._id} job={job} />)
                ) : (
                  <div className="col-span-full text-center text-gray-400 text-lg">
                    <>😕 No jobs found for this category.</>
                  </div>
                )}
              </div>
            ) : (
              <div className="min-h-[300px]"></div> // just placeholder for structure
            )}
          </TabPanel>
        ))}
      </div>
    </Tabs>
  );
};

export default React.memo(TabCategories);
