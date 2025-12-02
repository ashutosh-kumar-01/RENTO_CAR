


import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { assets, dummyCarData } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [cars, setCars] = useState([]);
    const [isCarsLoading, setIsCarsLoading] = useState(true);

    // Fetch logged-in user data
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            } else {
                // Token is invalid, clear it
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setIsOwner(false);
            }
        } catch (error) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsOwner(false);
            console.error("Auth error:", error.message);
        }
    };

    // Fetch all cars
    const fetchCars = async () => {
        setIsCarsLoading(true);
        try {
            const { data } = await axios.get('/api/user/cars');
            if (data.success) {
                // If API returns empty list, use dummy data for demo purposes
                if (!data.cars || data.cars.length === 0) {
                    setCars(dummyCarData || []);
                } else {
                    setCars(data.cars);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Failed to fetch cars, using dummy data", error);
            setCars(dummyCarData || []); // Fallback to dummy data on error
        } finally {
            setIsCarsLoading(false);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common['Authorization'] = '';
        toast.success("You have been logged out");
    };

    // On mount: load token + cars
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setToken(token);
        fetchCars();
    }, []);

    // Fetch user when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // ✅ FIXED
            fetchUser();
        }
    }, [token]);

    const value = {
        navigate,
        currency,
        axios,
        user,
        setUser,
        token,
        setToken,
        isOwner,
        setIsOwner,
        fetchUser,
        showLogin,
        setShowLogin,
        logout,
        fetchCars,
        cars,
        setCars,
        isCarsLoading,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        searchLocation,
        setSearchLocation
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

