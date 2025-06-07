import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../firebase/AuthContext.js";
import auth from "@react-native-firebase/auth";
import homeStyles from "../../assets/styles/homescreenStyle.js";

export default function HomeScreen() {
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await auth().signOut();
        } catch (error) {
            console.error(`Logout failed: ${error}`);
        }
    };

    return (
        <View style={homeStyles.container} >
            <Text style={homeStyles.title}>Welcome {user?.email || 'Guest'}</Text>
            <Text>You have logged in.</Text>
            <TouchableOpacity style={homeStyles.button}
                onPress={handleLogout}
            >
                <Text style={homeStyles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}