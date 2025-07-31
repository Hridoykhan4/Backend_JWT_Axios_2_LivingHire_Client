import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import useAuthValue from "../hooks/useAuthValue";
import toast from "react-hot-toast";
const Navbar = () => {
  const { user, logOut } = useAuthValue();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success("Successfully logged out 👋", {
          style: {
            border: "1px solid #4B5563", // Tailwind gray-700
            padding: "12px 16px",
            color: "#1F2937", // Tailwind gray-800
          },
          iconTheme: {
            primary: "#2563EB", // Tailwind blue-600
            secondary: "#F9FAFB", // Tailwind gray-50
          },
        });
      })
      .catch(() => {
        toast.error("Logout failed. Try again.", {
          style: {
            border: "1px solid #DC2626", // red-600
            padding: "12px 16px",
            color: "#991B1B",
          },
        });
      });
  };

  return (
    <header className="navbar bg-white shadow-sm px-4 md:px-6 lg:px-10 sticky top-0 z-50">
      {/* Left: Logo + Brand Name */}
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-8 w-auto" src={logo} alt="Living Hire Logo" />
          <span className="text-xl font-bold text-gray-800 tracking-wide">
            Living <span className="text-blue-600">Hire</span>
          </span>
        </Link>
      </div>

      {/* Right: Navigation */}
      <div className="gap-2 flex items-center">
        <ul className="gap-4 flex px-1 text-sm font-medium text-gray-700 ">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors duration-200 hover:text-blue-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>

          {!user && (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `transition-colors duration-200  ${
                    isActive ? "text-blue-600 font-semibold" : ""
                  }`
                }
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>

        {user && (
          <div className="dropdown dropdown-end ml-2">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div
                title={user?.displayName}
                className="w-10 h-10 rounded-full ring ring-blue-500 ring-offset-2 ring-offset-base-100 overflow-hidden"
              >
                <img
                  referrerPolicy="no-referrer"
                  alt="User Profile"
                  src={user?.photoURL}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-3 shadow-lg bg-white rounded-xl w-56 z-[999]"
            >
              <li>
                <NavLink
                  to="/add-job"
                  className="hover:text-blue-600 transition"
                >
                  ➕ Add Job
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/my-posted-jobs"
                  className="hover:text-blue-600 transition"
                >
                  📄 My Posted Jobs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/my-bids"
                  className="hover:text-blue-600 transition"
                >
                  💼 My Bids
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/bid-requests"
                  className="hover:text-blue-600 transition"
                >
                  📥 Bid Requests
                </NavLink>
              </li>
              <li className="pt-2 border-t mt-2">
                <button
                  onClick={handleLogOut}
                  className="btn btn-sm w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
