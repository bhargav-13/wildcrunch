import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import img1 from "@/assets/1.png";
import img2 from "@/assets/2.png";
import img3 from "@/assets/3.png";
import img4 from "@/assets/4.png";
import Logo from "@/assets/LogoWC.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
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
      toast.success("Login successful!");
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
      toast.success("Registration successful!");
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F8F7E5] flex flex-col items-center justify-center overflow-hidden">

      {/* Background floating images - Hidden on mobile (sm and below) */}
     <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
  {/* Top-Left Image */}
  <motion.img
    src={img1}
    alt="bg-1"
    className="absolute opacity-40"
    style={{ top: "-60%", left: "-30%", width: "1100px", height: "1100px" }}
    initial={{ scale: 0.8, rotate: 0, opacity: 0 }}
    animate={{ scale: 0.9, rotate: 125, opacity: 0.9 }}
    transition={{ delay: 0.3, duration: 0.6 }}
  />

  {/* Top-Right Image */}
  <motion.img
    src={img2}
    alt="bg-2"
    className="absolute opacity-40"
    style={{ top: "-85%", right: "-40%", width: "1500px", height: "1500px" }}
    initial={{ scale: 0.6, rotate: 0, opacity: 0 }}
    animate={{ scale: 0.7, rotate: -140, opacity: 0.9 }}
    transition={{ delay: 0.4, duration: 0.6 }}
  />

  {/* Bottom-Right Image */}
  <motion.img
    src={img3}
    alt="bg-3"
    className="absolute opacity-70"
    style={{ bottom: "-55%", left: "-20%", width: "900px", height: "900px" }}
    initial={{ scale: 1, rotate: 0, opacity: 0 }}
    animate={{ scale: 1.2, rotate: 45, opacity: 0.9 }}
    transition={{ delay: 0.5, duration: 0.6 }}
  />

  {/* Bottom-Left Image */}
  <motion.img
    src={img4}
    alt="bg-4"
    className="absolute opacity-50"
    style={{ bottom: "-50%", right: "-20%", width: "900px", height: "900px" }}
    initial={{ scale: 0.7, rotate: 0, opacity: 0 }}
    animate={{ scale: 0.9, rotate: -50, opacity: 0.9 }}
    transition={{ delay: 0.6, duration: 0.6 }}
  />
</div>

      {/* Logo & Welcome */}
      <div className="flex flex-col items-center mb-6 z-10">
        <img src={Logo} alt="Logo" className="w-50 h-40 mb-4" />
        <h2 className="text-2xl sm:text-6xl font-suez text-center">
          Welcome to Crunch
        </h2>
      </div>

      {/* Login/Register Card */}
      <motion.div
        className="relative p-10 rounded-3xl shadow-2xl border-2 border-dashed border-black w-11/12 sm:w-[400px] z-10 bg-white"
        initial={{ rotateY: -15, rotateX: 10 }}
        animate={{ rotateY: 0, rotateX: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="p-8 rounded-2xl shadow-inner border-2 border-black">
          <h3 className="text-2xl font-suez text-center mb-6">
            {isLogin ? "Login" : "Create Account"}
          </h3>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-[#212121] font-jost text-lg focus:outline-none focus:ring-2 focus:ring-[#C06441]"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-[#212121] font-jost text-lg focus:outline-none focus:ring-2 focus:ring-[#C06441]"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-[#212121] font-jost text-lg focus:outline-none focus:ring-2 focus:ring-[#C06441]"
            />

            {!isLogin && (
              <input
                type="tel"
                placeholder="Phone (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-[#212121] font-jost text-lg focus:outline-none focus:ring-2 focus:ring-[#C06441]"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F1B213] text-white rounded-lg font-jost uppercase tracking-wide hover:bg-[#C06441] transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="text-base text-center mt-6 font-jost">
            {isLogin ? "New here? " : "Already have an account? "}
            <span
              className="text-[#466DDF] cursor-pointer hover:underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Create Account" : "Login"}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;