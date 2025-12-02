import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const Login = () => {

  const {setShowLogin, axios, setToken, navigate} = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const onSubmitHandler = async (event) =>{
    event.preventDefault();
    setIsLoading(true);
    try {
      const payload = state === 'login' ? { email, password } : { name, email, password };
      const {data} = await axios.post(`/api/user/${state}`, payload)

      if(data.success){
        navigate("/");
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
       toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
    
  }
  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all"
    >
      <form 
        onSubmit={onSubmitHandler} 
        onClick={(e)=>e.stopPropagation()} 
        className="relative flex flex-col gap-5 m-auto items-start p-8 w-96 rounded-2xl shadow-2xl border border-white/10 bg-zinc-900 animate-fade-in"
      >
        <img 
            onClick={() => setShowLogin(false)} 
            src={assets.close_icon} 
            alt="close" 
            className="absolute top-4 right-4 w-4 cursor-pointer hover:opacity-70 invert" 
        />
        
        <div className="w-full text-center mb-2">
            <h2 className="text-2xl font-bold text-white">
                {state === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                {state === "login" ? "Please login to continue" : "Please sign up to book cars"}
            </p>
        </div>

        {state === "register" && (
          <div className="w-full">
            <label className="text-sm font-medium text-gray-400">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="John Doe"
              className="border border-white/10 bg-white/5 rounded-xl w-full p-3 mt-1 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all text-white placeholder-gray-600"
              type="text"
              required
            />
          </div>
        )}
        <div className="w-full">
          <label className="text-sm font-medium text-gray-400">Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="name@example.com"
            className="border border-white/10 bg-white/5 rounded-xl w-full p-3 mt-1 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all text-white placeholder-gray-600"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <label className="text-sm font-medium text-gray-400">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
            className="border border-white/10 bg-white/5 rounded-xl w-full p-3 mt-1 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all text-white placeholder-gray-600"
            type="password"
            required
            minLength={8}
          />
          {state === "register" && (
              <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters
              </p>
          )}
          {state === "login" && (
              <p className="text-xs text-right text-amber-500 mt-2 cursor-pointer hover:underline">
                  Forgot Password?
              </p>
          )}
        </div>

        <button 
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all text-black font-bold w-full py-3 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? 'Processing...' : (state === "register" ? "Create Account" : "Login")}
        </button>

        <div className="w-full text-center text-sm mt-2 text-gray-400">
            {state === "register" ? (
            <p>
                Already have an account?{" "}
                <span
                onClick={() => setState("login")}
                className="text-amber-500 font-semibold cursor-pointer hover:underline"
                >
                Login here
                </span>
            </p>
            ) : (
            <p>
                Don't have an account?{" "}
                <span
                onClick={() => setState("register")}
                className="text-amber-500 font-semibold cursor-pointer hover:underline"
                >
                Sign up
                </span>
            </p>
            )}
        </div>
      </form>
    </div>
  );
};

export default Login;





