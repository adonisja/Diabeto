import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

const AuthContext = createContext({ user: undefined})

export const useAuth = () => {
    return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined);
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        
        if (Constants.expoConfig.extra && Constants.expoConfig.extra.webClientId) {
            GoogleSignin.configure({
                webClientId: Constants.expoConfig.extra.webClientId, // Get webClientId from app.json
                offlineAccess: true, // Set to true if you need to access Google APIs offline (e.g., for refresh tokens)
             });
        } else {
            console.warn("webClientId is not configured in app.json extra. Google Sign-In might not work correctly.");
        }

        // Callback for Auth State changes
        const onAuthStateChanged = (userState) => {
            setUser(userState);
            if (initializing) {
                setInitializing(false);
            }
            console.log(`Auth State changed: ${userState?.email || 'Logged Out'}`)
        }
        
        // Subscriber to those Auth State changes
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

        // Unsubscribe from the listener
        return () => subscriber()
    }, []);

    if (initializing) {
        return null;
    }

    const contextValue = { user };

    return  (
        <AuthContext.Provider value={contextValue}>
            { children }
        </AuthContext.Provider>
    );
}