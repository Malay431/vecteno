'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from 'react-hot-toast';

export const AppContext = createContext(); // ✅ Correct name

export const AppContextProvider = ({ children }) => {

    axios.defaults.withCredentials = true;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // ✅ use Next.js env var
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/profileInfo');
            if (data.success) {
                setIsLoggedin(true);
                getUserData();  
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
