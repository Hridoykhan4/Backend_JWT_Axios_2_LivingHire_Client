import { Link } from "react-router-dom";

const Slide = ({ image, text }) => {
  return (
    <div
      className="w-full h-[38rem] bg-center bg-cover"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="flex items-center justify-center w-full h-full bg-black/60">
        <div className="text-center px-4">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
            {text}
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            Join thousands of clients and professionals getting work done right
            now.
          </p>
          <Link
            to="/add-job"
            className="inline-block mt-8 px-6 py-3 text-white font-semibold bg-primary hover:bg-primary-focus rounded-lg shadow-lg transition-all duration-300"
          >
            Post Job & Hire Expert
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Slide;
