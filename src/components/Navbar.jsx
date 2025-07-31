import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import useAuthValue from "../hooks/useAuthValue";

const Navbar = () => {
  const { user, logOut } = useAuthValue();

  const handleLogOut = () => {
    logOut().then(() => {
      alert("Success");
    });
  };

  return (
    <div className="navbar bg-white shadow-sm px-4 md:px-6 lg:px-8">
      {/* Left: Logo + Brand Name */}
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-8 w-auto" src={logo} alt="Living Hire Logo" />
          <span className="text-xl font-bold text-gray-800 tracking-wide">
            Living <span className="text-primary">Hire</span>
          </span>
        </Link>
      </div>

      {/* Right: Navigation */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-sm font-medium text-gray-700">
          <li>
            <NavLink
              to="/"
              className="hover:text-primary navLinkActiveClass transition-colors duration-200"
            >
              Home
            </NavLink>
          </li>

          {!user && (
            <li>
              <Link
                to="/login"
                className="hover:text-primary transition-colors duration-200"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        {user && (
          <div className="dropdown dropdown-end z-50 ml-2">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div
                title={user?.displayName}
                className="w-10 h-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden"
              >
                <img
                  referrerPolicy="no-referrer"
                  alt="User Profile Photo"
                  src={user?.photoURL}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-box w-56"
            >
              <li>
                <NavLink to="/add-job" className="hover:text-primary">
                  Add Job
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-posted-jobs" className="hover:text-primary">
                  My Posted Jobs
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-bids" className="hover:text-primary">
                  My Bids
                </NavLink>
              </li>
              <li>
                <NavLink to="/bid-requests" className="hover:text-primary">
                  Bid Requests
                </NavLink>
              </li>
              <li className="pt-2 border-t mt-2">
                <button
                  onClick={handleLogOut}
                  className="btn btn-sm btn-neutral w-full"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
