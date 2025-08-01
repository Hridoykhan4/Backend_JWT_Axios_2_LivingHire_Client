import { Link, useNavigate } from "react-router-dom";
import registerLottie from "../../assets/lottie/registerLottie.json";
import Lottie from "lottie-react";
import useAuthValue from "../../hooks/useAuthValue";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import { useEffect } from "react";
import axios from "axios";

const Register = () => {
  const {
    createUser,
    signInWithGoogle,
    updateUserProfile,
    setUser,
    user,
    loading,
  } = useAuthValue();
  const nav = useNavigate();
  useEffect(() => {
    if (user) {
      nav("/");
    }
  }, [user, nav]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email: result?.user?.email,
        },
        { withCredentials: true }
      );
      toast.success("Signed in with Google 🎉", {
        style: {
          border: "1px solid #2563EB",
          padding: "10px 16px",
          color: "#1F2937",
        },
        iconTheme: {
          primary: "#2563EB",
          secondary: "#E0F2FE",
        },
      });

      nav("/");
    } catch (err) {
      toast.error("Google Sign-in Failed ❌", err);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = Object.fromEntries(formData.entries());
    const { name, photo, email, password } = inputValue;

    try {
      const result = await createUser(email, password);
      await updateUserProfile(name, photo);
      setUser({ ...result?.user, displayName: name, photoURL: photo });
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email: result?.user?.email,
        },
        { withCredentials: true }
      );
      console.log(data);

      toast.success("Signup Successful 🎉", {
        style: {
          border: "1px solid #22C55E",
          padding: "10px 16px",
          color: "#065F46",
        },
        iconTheme: {
          primary: "#22C55E",
          secondary: "#ECFDF5",
        },
      });

      nav("/");
    } catch (err) {
      toast.error(err.message || "Failed to Sign Up", {
        style: {
          border: "1px solid #DC2626",
          padding: "10px 16px",
          color: "#7F1D1D",
        },
      });
    }
  };
  if (user || loading) return;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl">
        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-8" src={logo} alt="Logo" />
          </div>

          <p className="mt-3 text-xl text-center text-gray-700 font-semibold">
            Create Your Account
          </p>

          <button
            onClick={handleGoogleLogin}
            className="flex w-full mt-6 items-center justify-center gap-2 text-gray-700 border border-gray-300 rounded-lg py-2 hover:shadow-md hover:bg-gray-50 transition duration-200"
          >
            {/* <svg className="w-6 h-6" viewBox="0 0 40 40">
              <path fill="#FFC107" d="M36.3 16.7H20v6.7h9.4..." />
            </svg> */}
            <span className="font-medium">Sign up with Google</span>
          </button>

          <div className="flex items-center justify-between mt-6">
            <span className="w-1/5 border-b"></span>
            <span className="text-xs text-gray-500 uppercase">
              or sign up with email
            </span>
            <span className="w-1/5 border-b"></span>
          </div>

          <form onSubmit={handleSignUp} className="mt-6">
            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Username
              </label>
              <input
                name="name"
                required
                autoComplete="name"
                className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:ring-2 focus:ring-blue-400"
                type="text"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm text-gray-600">
                Photo URL
              </label>
              <input
                name="photo"
                autoComplete="photo"
                className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:ring-2 focus:ring-blue-400"
                type="url"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm text-gray-600">
                Email Address
              </label>
              <input
                name="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:ring-2 focus:ring-blue-400"
                type="email"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm text-gray-600">
                Password
              </label>
              <input
                name="password"
                required
                autoComplete="new-password"
                className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:ring-2 focus:ring-blue-400"
                type="password"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-gray-800 text-white py-2.5 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center justify-between mt-6">
            <span className="w-1/5 border-b"></span>
            <Link
              to="/login"
              className="text-xs text-gray-500 uppercase hover:underline"
            >
              or Sign In
            </Link>
            <span className="w-1/5 border-b"></span>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 bg-gray-100 p-6 items-center justify-center">
          <Lottie animationData={registerLottie} loop={true} />
        </div>
      </div>
    </div>
  );
};

export default Register;
