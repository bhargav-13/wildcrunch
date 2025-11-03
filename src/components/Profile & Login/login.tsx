import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Logo from "@/assets/LogoWC.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(false); // Default to Register/Create Account

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, phone);
      toast.success("Account created successfully!");
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F8F7E5] flex flex-col items-center justify-center px-4 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-jost"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </button>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <img src={Logo} alt="Wild Crunch Logo" className="w-32 h-32 sm:w-40 sm:h-40 mb-4" />
        <h1 className="text-3xl sm:text-4xl font-suez text-black text-center">
          Wild Crunch
        </h1>
      </motion.div>

      {/* Login/Register Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-suez text-base transition-all ${
              !isLogin
                ? "bg-[#F1B213] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-suez text-base transition-all ${
              isLogin
                ? "bg-[#F1B213] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Login
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-suez text-black mb-2 text-center">
            {isLogin ? "Welcome Back" : "Get Started"}
          </h2>
          <p className="text-gray-600 text-center mb-6 font-jost">
            {isLogin
              ? "Login to your account to continue"
              : "Create your account to start shopping"}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-jost"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 font-suez">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black font-jost focus:outline-none focus:ring-2 focus:ring-[#F1B213] focus:border-transparent transition-all"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-suez">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black font-jost focus:outline-none focus:ring-2 focus:ring-[#F1B213] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-suez">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black font-jost focus:outline-none focus:ring-2 focus:ring-[#F1B213] focus:border-transparent transition-all"
              />
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 font-suez">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black font-jost focus:outline-none focus:ring-2 focus:ring-[#F1B213] focus:border-transparent transition-all"
                />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F1B213] text-white rounded-lg font-suez text-lg hover:bg-[#E5A612] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Please wait...
                </span>
              ) : (
                isLogin ? "Login to Account" : "Create Account"
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-jost">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-[#F1B213] hover:text-[#E5A612] font-medium hover:underline transition-colors"
              >
                {isLogin ? "Create one here" : "Login here"}
              </button>
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center mt-6 font-jost max-w-sm mx-auto">
          By continuing, you agree to Wild Crunch's Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
