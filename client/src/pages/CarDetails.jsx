import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, token } = useAppContext();

  const [car, setCar] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const currency = import.meta.env.VITE_CURRENCY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return toast.error("Please login to book a car");
    }

    try {
      const { data } = await axios.post(
        "/api/booking/create",
        { car: car._id, pickupDate, returnDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (cars.length > 0) {
      setCar(cars.find((car) => car._id === id));
    }
  }, [id, cars]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10 pb-20 bg-black min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-gray-500 hover:text-white transition-colors cursor-pointer font-medium group"
      >
        <svg className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* left: car image & details  */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 rounded-2xl p-2 shadow-2xl shadow-black/50 border border-white/5 overflow-hidden">
            <img
                src={car.image}
                alt=""
                className="w-full h-auto md:max-h-[500px] object-cover rounded-xl"
            />
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-8 shadow-2xl shadow-black/50 border border-white/5 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {car.brand} {car.model}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-4 py-1.5 bg-white/10 text-white text-sm font-bold rounded-full uppercase tracking-wider border border-white/20">{car.category}</span>
                <span className="text-gray-700">•</span>
                <span className="text-gray-500 text-lg">{car.year}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "users", text: `${car.seating_capacity} Seats`, label: "Capacity" },
                { icon: "fuel", text: car.fuel_type, label: "Fuel Type" },
                { icon: "transmission", text: car.transmission, label: "Transmission" },
                { icon: "location", text: car.location, label: "Location" },
              ].map(({ icon, text, label }) => (
                <div
                  key={text}
                  className="flex flex-col items-center justify-center bg-white/5 p-5 rounded-xl border border-white/5 hover:border-white/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    {icon === "users" && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {icon === "fuel" && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {icon === "transmission" && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {icon === "location" && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">{label}</span>
                  <span className="text-white font-semibold text-center mt-1">{text}</span>
                </div>
              ))}
            </div>

            <hr className="border-white/5" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <p className="text-gray-400 leading-relaxed">{car.description}</p>
            </div>

            <hr className="border-white/5" />

            {/* Features */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View",
                  "Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-300 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                    <svg className="w-5 h-5 mr-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="relative">
            <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 shadow-2xl shadow-black/50 h-max sticky top-24 rounded-2xl p-8 space-y-6 border border-white/5"
            >
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Daily Rate</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300">
                        {currency}{car.pricePerDay}
                    </p>
                </div>
                <span className="text-gray-600 font-medium mb-2">/ day</span>
            </div>

            <hr className="border-white/5" />

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="pickup-date" className="text-sm font-medium text-gray-400">Pickup Date</label>
                    <input
                    type="date"
                    className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/50 outline-none transition-all w-full"
                    required
                    id="pickup-date"
                    min={new Date().toISOString().split("T")[0]}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="return-date" className="text-sm font-medium text-gray-400">Return Date</label>
                    <input
                    type="date"
                    className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/50 outline-none transition-all w-full"
                    required
                    id="return-date"
                    min={pickupDate || new Date().toISOString().split("T")[0]}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    />
                </div>
            </div>

            <button className="w-full bg-gradient-to-r from-white to-gray-400 hover:from-gray-200 hover:to-gray-300 active:scale-95 transition-all py-4 font-bold text-black rounded-xl cursor-pointer shadow-lg shadow-amber-900/30 uppercase tracking-wider">
                Book Now
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Secure booking. No credit card required to reserve.
            </div>
            </form>
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;

