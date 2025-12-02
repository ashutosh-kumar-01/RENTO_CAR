import React, { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { motion } from "framer-motion";

const AddCar = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { token, axios } = useAppContext();

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  // Popular car brands for suggestions
  const popularBrands = ["Toyota", "Honda", "BMW", "Mercedes-Benz", "Audi", "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Ford", "Volkswagen", "Kia", "MG", "Porsche", "Ferrari", "Lamborghini"];
  
  // Indian cities for location suggestions
  const popularLocations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Goa"];

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      return toast.error("Please upload an image");
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setCar({
          brand: "",
          model: "",
          year: "",
          pricePerDay: "",
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: "",
          location: "",
          description: "",
        });
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-4 py-10 md:px-10 flex-1 bg-black min-h-screen">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 text-gray-300 text-sm mt-8 max-w-3xl bg-gradient-to-br from-zinc-900/80 to-black p-8 rounded-2xl shadow-xl shadow-black/50 border border-white/10"
      >
        {/* car image */}
        <div className="flex flex-col gap-3 w-full">
          <label className="font-medium text-gray-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Car Image
          </label>
          <label htmlFor="car-image" className="w-full h-52 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-amber-500/50 transition-all bg-white/5 group overflow-hidden">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="h-full w-full object-contain rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-amber-400 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="font-medium">Click to upload image</p>
                <p className="text-xs text-gray-600">PNG, JPG up to 10MB</p>
              </div>
            )}
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* car brand and model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full gap-1.5">
            <label className="font-medium text-gray-400">Brand</label>
            <input
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
              value={car.brand}
              className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white placeholder:text-gray-600"
              type="text"
              list="brand-list"
              placeholder="e.g. Toyota"
              required
            />
            <datalist id="brand-list">
              {popularBrands.map(brand => <option key={brand} value={brand} />)}
            </datalist>
          </div>
          <div className="flex flex-col w-full gap-1.5">
            <label className="font-medium text-gray-400">Model</label>
            <input
              onChange={(e) => setCar({ ...car, model: e.target.value })}
              value={car.model}
              className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white placeholder:text-gray-600"
              type="text"
              placeholder="e.g. Camry"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full gap-1.5">
            <label className="font-medium text-gray-400">Year</label>
            <input
              onChange={(e) => setCar({ ...car, year: e.target.value })}
              value={car.year}
              className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white placeholder:text-gray-600"
              type="number"
              min="2000"
              max="2025"
              placeholder="2024"
              required
            />
          </div>
          <div className="flex flex-col w-full gap-1.5">
            <label className="font-medium text-gray-400">Price per Day ({currency})</label>
            <input
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
              value={car.pricePerDay}
              className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white placeholder:text-gray-600"
              type="number"
              min="100"
              placeholder="e.g. 2500"
              required
            />
          </div>
          <div className="flex flex-col w-full gap-1.5">
            <label className="font-medium text-gray-400">Category</label>
            <select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white"
              required
            >
              <option value="" className="bg-zinc-900">Select Category</option>
              <option value="Sedan" className="bg-zinc-900">Sedan</option>
              <option value="SUV" className="bg-zinc-900">SUV</option>
              <option value="Hatchback" className="bg-zinc-900">Hatchback</option>
              <option value="Luxury" className="bg-zinc-900">Luxury</option>
              <option value="Sports" className="bg-zinc-900">Sports</option>
              <option value="Supercar" className="bg-zinc-900">Supercar</option>
              <option value="Muscle" className="bg-zinc-900">Muscle Car</option>
              <option value="Convertible" className="bg-zinc-900">Convertible</option>
              <option value="MPV" className="bg-zinc-900">MPV</option>
              <option value="Truck" className="bg-zinc-900">Truck / Pickup</option>
              <option value="Electric" className="bg-zinc-900">Electric</option>
              <option value="Hybrid" className="bg-zinc-900">Hybrid</option>
              <option value="Vintage" className="bg-zinc-900">Vintage / Classic</option>
            </select>
          </div>
        </div>

        {/* car transmission, fuel type, seating capacity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full gap-1.5">
            <label className="font-medium text-gray-400">Transmission</label>
            <select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white"
              required
            >
              <option value="" className="bg-zinc-900">Select</option>
              <option value="Automatic" className="bg-zinc-900">Automatic</option>
              <option value="Manual" className="bg-zinc-900">Manual</option>
              <option value="CVT" className="bg-zinc-900">CVT</option>
              <option value="DCT" className="bg-zinc-900">Dual Clutch (DCT)</option>
            </select>
          </div>
          <div className="flex flex-col w-full gap-1.5">
            <label className="font-medium text-gray-400">Fuel Type</label>
            <select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white"
              required
            >
              <option value="" className="bg-zinc-900">Select</option>
              <option value="Petrol" className="bg-zinc-900">Petrol</option>
              <option value="Diesel" className="bg-zinc-900">Diesel</option>
              <option value="Electric" className="bg-zinc-900">Electric</option>
              <option value="Hybrid" className="bg-zinc-900">Hybrid</option>
              <option value="CNG" className="bg-zinc-900">CNG</option>
            </select>
          </div>
          <div className="flex flex-col w-full gap-1.5">
            <label className="font-medium text-gray-400">Seating Capacity</label>
            <select
              onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
              value={car.seating_capacity}
              className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white"
              required
            >
              <option value="" className="bg-zinc-900">Select</option>
              <option value="2" className="bg-zinc-900">2 Seater</option>
              <option value="4" className="bg-zinc-900">4 Seater</option>
              <option value="5" className="bg-zinc-900">5 Seater</option>
              <option value="6" className="bg-zinc-900">6 Seater</option>
              <option value="7" className="bg-zinc-900">7 Seater</option>
              <option value="8+" className="bg-zinc-900">8+ Seater</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col w-full gap-1.5">
          <label className="font-medium text-gray-400">Location</label>
          <input
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            value={car.location}
            className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-white placeholder:text-gray-600"
            type="text"
            list="location-list"
            placeholder="City, State"
            required
          />
          <datalist id="location-list">
            {popularLocations.map(loc => <option key={loc} value={loc} />)}
          </datalist>
        </div>

        <div className="flex flex-col w-full gap-1.5">
          <label className="font-medium text-gray-400">Description</label>
          <textarea
            onChange={(e) => setCar({ ...car, description: e.target.value })}
            value={car.description}
            className="border border-white/10 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all h-32 resize-none text-white placeholder:text-gray-600"
            placeholder="Describe your car's features, condition, special highlights..."
            required
          />
        </div>

        {/* Quick Tips */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <h4 className="text-amber-400 font-medium mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Tips for a Great Listing
          </h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Use high-quality images showing the car from multiple angles</li>
            <li>• Price competitively based on your car's category and condition</li>
            <li>• Include key features like sunroof, leather seats, etc. in description</li>
            <li>• Mention any recent maintenance or upgrades</li>
          </ul>
        </div>

        <button 
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold py-4 rounded-xl transition-all mt-2 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              Adding Car...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Car to Listings
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default AddCar;
