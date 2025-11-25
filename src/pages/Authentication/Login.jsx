import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Lottie from "lottie-react";
import loginLottie from "../../assets/lottie/loginLottie.json";
import useAuthValue from "../../hooks/useAuthValue";
import toast from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";

const Login = () => {
  const { signIn, signInWithGoogle, user, loading } = useAuthValue();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (user) {
      nav("/");
    }
  }, [nav, user]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      toast.success("Signed in with Google 🚀", {
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
      const email = result?.user?.email;
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email,
        },
        { withCredentials: true }
      );

      nav(from, { replace: true });
    } catch (err) {
      toast.error("Google Sign-in failed ❌", err);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    try {
      const result = await signIn(email, password);
      // const email = result?.user?.email;
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email: result?.user?.email,
        },
        { withCredentials: true }
      );
      console.log(data);
      if (result?.user?.email) {
        toast.success("Login Successful 🎉", {
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
        nav(from, { replace: true });
      }
    } catch (err) {
      toast.error("Login failed: " + err.message, {
        style: {
          border: "1px solid #DC2626",
          padding: "10px 16px",
          color: "#7F1D1D",
        },
      });
    }
  };

  if (user) return;
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="flex w-full  overflow-hidden bg-white rounded-xl shadow-lg lg:max-w-4xl">
        <div className="hidden md:flex w-1/2 bg-gray-100 p-6 items-center justify-center">
          <Lottie animationData={loginLottie} loop={true} />
        </div>

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-7 sm:h-8" src={logo} alt="Logo" />
          </div>

          <p className="mt-3 text-xl text-center text-gray-700 font-semibold">
            Welcome back!
          </p>

          <button
            onClick={handleGoogleLogin}
            className="flex w-full mt-6 items-center justify-center gap-2 text-gray-700 border border-gray-300 rounded-lg py-2 hover:shadow-md hover:bg-gray-50 transition duration-200"
          >
            {/*    <svg className="w-6 h-6" viewBox="0 0 40 40">
              <path fill="#FFC107" d="M36.3 16.7H20v6.7h9.4..." />

            </svg> */}
            <span className="font-medium">Sign in with Google</span>
          </button>

          <div className="flex items-center justify-between mt-6">
            <span className="w-1/5 border-b"></span>
            <span className="text-xs text-gray-500 uppercase">
              or sign in with email
            </span>
            <span className="w-1/5 border-b"></span>
          </div>

          <form onSubmit={handleSignIn} className="mt-6">
            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Email Address
              </label>
              <input
                name="email"
                required
                type="email"
                autoComplete="email"
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm text-gray-600">
                Password
              </label>
              <input
                name="password"
                required
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2.5 rounded-md hover:bg-gray-700 transition duration-200"
              >
                {loading ? "Singing in ..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-6">
            <span className="w-1/5 border-b"></span>
            <Link
              to="/register"
              className="text-xs text-gray-500 uppercase hover:underline"
            >
              or Sign up
            </Link>
            <span className="w-1/5 border-b"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
