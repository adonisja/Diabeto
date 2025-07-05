// app/(protected)/(patient)/reminders.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Switch,
    Alert,
    Platform,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import { notificationService } from '../../../utils/notificationUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import patientDashboardStyles from '../../../assets/styles/protectedStyles/patientStyles/patientDashboardStyles';

// Configure notifications - now handled by notificationService

interface CustomMeal {
    id: string;
    name: string;
    time: Date;
    emoji: string;
}

interface ReminderSettings {
    mealReminders: {
        enabled: boolean;
        breakfast: Date;
        lunch: Date;
        dinner: Date;
        customMeals: CustomMeal[];
    };
    glucoseReminders: {
        enabled: boolean;
        postMealDelay: number; // hours after meal
    };
    insulinReminders: {
        enabled: boolean;
        longActingTime: Date;
    };
}

const defaultSettings: ReminderSettings = {
    mealReminders: {
        enabled: false,
        breakfast: new Date(2024, 0, 1, 8, 0), // 8:00 AM
        lunch: new Date(2024, 0, 1, 12, 30), // 12:30 PM
        dinner: new Date(2024, 0, 1, 18, 0), // 6:00 PM
        customMeals: [],
    },
    glucoseReminders: {
        enabled: false,
        postMealDelay: 2, // 2 hours after meals
    },
    insulinReminders: {
        enabled: false,
        longActingTime: new Date(2024, 0, 1, 21, 0), // 9:00 PM
    },
};

export default function RemindersScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [settings, setSettings] = useState<ReminderSettings>(defaultSettings);
    const [showTimePicker, setShowTimePicker] = useState<{
        type: string;
        show: boolean;
        customMealId?: string;
    }>({ type: '', show: false });
    const [notificationPermission, setNotificationPermission] = useState(false);
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [newMealName, setNewMealName] = useState('');
    const [newMealEmoji, setNewMealEmoji] = useState('🍴');

    useEffect(() => {
        requestNotificationPermissions();
        loadSettings();
    }, []);

    const requestNotificationPermissions = async () => {
        try {
            const { status: existingStatus } = await notificationService.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== 'granted') {
                const { status } = await notificationService.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please enable notifications in Settings to receive reminders.',
                );
                setNotificationPermission(false);
                return;
            }
            
            setNotificationPermission(true);
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            Alert.alert('Error', 'Failed to request notification permissions.');
            setNotificationPermission(false);
        }
    };

    const loadSettings = async () => {
        if (!user) return;
        
        try {
            const docRef = doc(db, 'userProfiles', user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.reminderSettings) {
                    // Convert stored timestamps back to Date objects
                    const loaded = data.reminderSettings;
                    setSettings({
                        ...loaded,
                        mealReminders: {
                            ...loaded.mealReminders,
                            breakfast: loaded.mealReminders.breakfast?.toDate() || defaultSettings.mealReminders.breakfast,
                            lunch: loaded.mealReminders.lunch?.toDate() || defaultSettings.mealReminders.lunch,
                            dinner: loaded.mealReminders.dinner?.toDate() || defaultSettings.mealReminders.dinner,
                            customMeals: (loaded.mealReminders.customMeals || []).map((meal: any) => ({
                                ...meal,
                                time: meal.time?.toDate() || new Date()
                            })),
                        },
                        insulinReminders: {
                            ...loaded.insulinReminders,
                            longActingTime: loaded.insulinReminders.longActingTime?.toDate() || defaultSettings.insulinReminders.longActingTime,
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading reminder settings:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
            }
        }
    };

    const saveSettings = async () => {
        if (!user) return;
        
        try {
            const docRef = doc(db, 'userProfiles', user.uid);
            
            // First, try to create/update the document
            await setDoc(docRef, {
                reminderSettings: settings,
                reminderSettingsUpdated: new Date(),
                uid: user.uid,
                email: user.email,
                profileCompleted: true,
            }, { merge: true }); // Use merge to not overwrite existing fields
            
            // Schedule new notifications
            await scheduleNotifications();
            
            Alert.alert('Success', 'Reminder settings saved successfully!');
        } catch (error) {
            console.error('Error saving reminder settings:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
            }
            Alert.alert('Error', 'Failed to save reminder settings.');
        }
    };

    const scheduleNotifications = async () => {
        // Cancel all existing notifications
        await notificationService.cancelAllScheduledNotificationsAsync();
        
        if (!notificationPermission || !notificationService.getIsAvailable()) return;

        const now = new Date();

        // Schedule meal reminders
        if (settings.mealReminders.enabled) {
            await scheduleDailyNotification(
                'meal-breakfast',
                '🍳 Breakfast Time!',
                'Time to eat your breakfast and take your medication.',
                settings.mealReminders.breakfast
            );
            
            await scheduleDailyNotification(
                'meal-lunch',
                '🥗 Lunch Time!',
                'Time for your midday meal.',
                settings.mealReminders.lunch
            );
            
            await scheduleDailyNotification(
                'meal-dinner',
                '🍽️ Dinner Time!',
                'Time for your evening meal.',
                settings.mealReminders.dinner
            );

            // Schedule custom meal reminders
            for (const customMeal of settings.mealReminders.customMeals) {
                await scheduleDailyNotification(
                    `meal-custom-${customMeal.id}`,
                    `${customMeal.emoji} ${customMeal.name} Time!`,
                    `Time for your ${customMeal.name.toLowerCase()}.`,
                    customMeal.time
                );
            }
        }

        // Schedule glucose reminders (2 hours after each meal)
        if (settings.glucoseReminders.enabled && settings.mealReminders.enabled) {
            const delayMs = settings.glucoseReminders.postMealDelay * 60 * 60 * 1000;
            
            await scheduleDailyNotification(
                'glucose-breakfast',
                '📊 Glucose Check',
                'Time to check your blood glucose (2 hours after breakfast).',
                new Date(settings.mealReminders.breakfast.getTime() + delayMs)
            );
            
            await scheduleDailyNotification(
                'glucose-lunch',
                '📊 Glucose Check',
                'Time to check your blood glucose (2 hours after lunch).',
                new Date(settings.mealReminders.lunch.getTime() + delayMs)
            );
            
            await scheduleDailyNotification(
                'glucose-dinner',
                '📊 Glucose Check',
                'Time to check your blood glucose (2 hours after dinner).',
                new Date(settings.mealReminders.dinner.getTime() + delayMs)
            );

            // Schedule glucose reminders for custom meals
            for (const customMeal of settings.mealReminders.customMeals) {
                await scheduleDailyNotification(
                    `glucose-custom-${customMeal.id}`,
                    '📊 Glucose Check',
                    `Time to check your blood glucose (2 hours after ${customMeal.name.toLowerCase()}).`,
                    new Date(customMeal.time.getTime() + delayMs)
                );
            }
        }

        // Schedule insulin reminder
        if (settings.insulinReminders.enabled) {
            await scheduleDailyNotification(
                'insulin-long-acting',
                '💉 Long-Acting Insulin',
                'Time to take your daily long-acting insulin.',
                settings.insulinReminders.longActingTime
            );
        }
    };

    const scheduleDailyNotification = async (
        identifier: string,
        title: string,
        body: string,
        time: Date
    ) => {
        try {
            await notificationService.scheduleNotificationAsync({
                identifier,
                content: {
                    title,
                    body,
                    sound: 'default',
                    badge: 1,
                    data: { type: 'reminder' },
                },
                trigger: {
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                    repeats: true,
                },
            });
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        // On iOS, we need to handle the case where the user cancels
        if (Platform.OS === 'ios') {
            setShowTimePicker({ type: '', show: false });
        }
        
        if (selectedTime && event.type !== 'dismissed') {
            const newSettings = { ...settings };
            
            switch (showTimePicker.type) {
                case 'breakfast':
                    newSettings.mealReminders.breakfast = selectedTime;
                    break;
                case 'lunch':
                    newSettings.mealReminders.lunch = selectedTime;
                    break;
                case 'dinner':
                    newSettings.mealReminders.dinner = selectedTime;
                    break;
                case 'insulin':
                    newSettings.insulinReminders.longActingTime = selectedTime;
                    break;
                case 'custom':
                    if (showTimePicker.customMealId) {
                        const mealIndex = newSettings.mealReminders.customMeals.findIndex(
                            meal => meal.id === showTimePicker.customMealId
                        );
                        if (mealIndex !== -1) {
                            newSettings.mealReminders.customMeals[mealIndex].time = selectedTime;
                        }
                    }
                    break;
            }
            
            setSettings(newSettings);
        }
        
        // On Android, we close the picker after selection
        if (Platform.OS === 'android') {
            setShowTimePicker({ type: '', show: false });
        }
    };

    const addCustomMeal = () => {
        if (newMealName.trim()) {
            const customMeal: CustomMeal = {
                id: Date.now().toString(),
                name: newMealName.trim(),
                time: new Date(2024, 0, 1, 15, 0), // Default to 3:00 PM
                emoji: newMealEmoji,
            };
            
            setSettings(prev => ({
                ...prev,
                mealReminders: {
                    ...prev.mealReminders,
                    customMeals: [...prev.mealReminders.customMeals, customMeal]
                }
            }));
            
            setNewMealName('');
            setNewMealEmoji('🍴');
            setShowAddMeal(false);
        }
    };

    const removeCustomMeal = (mealId: string) => {
        Alert.alert(
            'Remove Meal Reminder',
            'Are you sure you want to remove this custom meal reminder?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setSettings(prev => ({
                            ...prev,
                            mealReminders: {
                                ...prev.mealReminders,
                                customMeals: prev.mealReminders.customMeals.filter(meal => meal.id !== mealId)
                            }
                        }));
                    }
                }
            ]
        );
    };

    const getTimePickerValue = () => {
        if (showTimePicker.type === 'custom' && showTimePicker.customMealId) {
            const customMeal = settings.mealReminders.customMeals.find(
                meal => meal.id === showTimePicker.customMealId
            );
            return customMeal?.time || new Date();
        }
        
        switch (showTimePicker.type) {
            case 'breakfast': return settings.mealReminders.breakfast;
            case 'lunch': return settings.mealReminders.lunch;
            case 'dinner': return settings.mealReminders.dinner;
            case 'insulin': return settings.insulinReminders.longActingTime;
            default: return new Date();
        }
    };

    return (
        <SafeAreaView style={patientDashboardStyles.outerContainer}>
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={patientDashboardStyles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={patientDashboardStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={patientDashboardStyles.headerTitle}>Reminders</Text>
                <TouchableOpacity onPress={saveSettings} style={patientDashboardStyles.saveButton}>
                    <Ionicons name="checkmark" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={patientDashboardStyles.backgroundGradient}
            >
                <ScrollView style={patientDashboardStyles.scrollContainer}>
                    {/* Notification Permission Status */}
                    {!notificationPermission && (
                        <View style={patientDashboardStyles.warningCard}>
                            <Ionicons name="warning" size={24} color="#ff6b6b" />
                            <Text style={patientDashboardStyles.warningText}>
                                Notifications are disabled. Please enable them in Settings.
                            </Text>
                        </View>
                    )}

                    {/* Meal Reminders Section */}
                    <View style={patientDashboardStyles.section}>
                        <View style={patientDashboardStyles.sectionHeader}>
                            <Text style={patientDashboardStyles.sectionTitle}>🍽️ Meal Reminders</Text>
                            <Switch
                                value={settings.mealReminders.enabled}
                                onValueChange={(value) =>
                                    setSettings(prev => ({
                                        ...prev,
                                        mealReminders: { ...prev.mealReminders, enabled: value }
                                    }))
                                }
                                trackColor={{ false: '#767577', true: '#4facfe' }}
                                thumbColor={settings.mealReminders.enabled ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                        
                        {settings.mealReminders.enabled && (
                            <View style={patientDashboardStyles.settingsGroup}>
                                <TouchableOpacity
                                    style={patientDashboardStyles.timeSelector}
                                    onPress={() => setShowTimePicker({ type: 'breakfast', show: true })}
                                >
                                    <Text style={patientDashboardStyles.timeLabel}>🍳 Breakfast</Text>
                                    <Text style={patientDashboardStyles.timeValue}>
                                        {formatTime(settings.mealReminders.breakfast)}
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={patientDashboardStyles.timeSelector}
                                    onPress={() => setShowTimePicker({ type: 'lunch', show: true })}
                                >
                                    <Text style={patientDashboardStyles.timeLabel}>🥗 Lunch</Text>
                                    <Text style={patientDashboardStyles.timeValue}>
                                        {formatTime(settings.mealReminders.lunch)}
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={patientDashboardStyles.timeSelector}
                                    onPress={() => setShowTimePicker({ type: 'dinner', show: true })}
                                >
                                    <Text style={patientDashboardStyles.timeLabel}>🍽️ Dinner</Text>
                                    <Text style={patientDashboardStyles.timeValue}>
                                        {formatTime(settings.mealReminders.dinner)}
                                    </Text>
                                </TouchableOpacity>

                                {/* Custom Meal Reminders */}
                                {settings.mealReminders.customMeals.map((customMeal) => (
                                    <View key={customMeal.id} style={patientDashboardStyles.customMealContainer}>
                                        <TouchableOpacity
                                            style={patientDashboardStyles.timeSelector}
                                            onPress={() => setShowTimePicker({ 
                                                type: 'custom', 
                                                show: true, 
                                                customMealId: customMeal.id 
                                            })}
                                        >
                                            <Text style={patientDashboardStyles.timeLabel}>
                                                {customMeal.emoji} {customMeal.name}
                                            </Text>
                                            <Text style={patientDashboardStyles.timeValue}>
                                                {formatTime(customMeal.time)}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={patientDashboardStyles.removeMealButton}
                                            onPress={() => removeCustomMeal(customMeal.id)}
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                {/* Add Custom Meal Button */}
                                <TouchableOpacity
                                    style={patientDashboardStyles.addMealButton}
                                    onPress={() => setShowAddMeal(true)}
                                >
                                    <Ionicons name="add-circle-outline" size={24} color="#4facfe" />
                                    <Text style={patientDashboardStyles.addMealText}>Add Custom Meal</Text>
                                </TouchableOpacity>

                                {/* Add Custom Meal Modal */}
                                {showAddMeal && (
                                    <View style={patientDashboardStyles.modalOverlay}>
                                        <View style={patientDashboardStyles.modalContainer}>
                                            <Text style={patientDashboardStyles.modalTitle}>Add Custom Meal</Text>
                                            
                                            <View style={patientDashboardStyles.inputContainer}>
                                                <Text style={patientDashboardStyles.inputLabel}>Meal Name</Text>
                                                <TextInput
                                                    style={patientDashboardStyles.textInput}
                                                    value={newMealName}
                                                    onChangeText={setNewMealName}
                                                    placeholder="e.g., Afternoon Snack"
                                                    maxLength={30}
                                                />
                                            </View>

                                            <View style={patientDashboardStyles.inputContainer}>
                                                <Text style={patientDashboardStyles.inputLabel}>Emoji</Text>
                                                <View style={patientDashboardStyles.emojiContainer}>
                                                    {['🍴', '🥪', '🍎', '🥤', '🍪', '🥗', '🍕', '🌮'].map((emoji) => (
                                                        <TouchableOpacity
                                                            key={emoji}
                                                            style={[
                                                                patientDashboardStyles.emojiButton,
                                                                newMealEmoji === emoji && patientDashboardStyles.selectedEmoji
                                                            ]}
                                                            onPress={() => setNewMealEmoji(emoji)}
                                                        >
                                                            <Text style={patientDashboardStyles.emojiText}>{emoji}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>

                                            <View style={patientDashboardStyles.modalButtons}>
                                                <TouchableOpacity
                                                    style={patientDashboardStyles.cancelButton}
                                                    onPress={() => {
                                                        setShowAddMeal(false);
                                                        setNewMealName('');
                                                        setNewMealEmoji('🍴');
                                                    }}
                                                >
                                                    <Text style={patientDashboardStyles.cancelButtonText}>Cancel</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={patientDashboardStyles.addButton}
                                                    onPress={addCustomMeal}
                                                    disabled={!newMealName.trim()}
                                                >
                                                    <Text style={patientDashboardStyles.addButtonText}>Add Meal</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Glucose Reminders Section */}
                    <View style={patientDashboardStyles.section}>
                        <View style={patientDashboardStyles.sectionHeader}>
                            <Text style={patientDashboardStyles.sectionTitle}>📊 Glucose Reminders</Text>
                            <Switch
                                value={settings.glucoseReminders.enabled}
                                onValueChange={(value) =>
                                    setSettings(prev => ({
                                        ...prev,
                                        glucoseReminders: { ...prev.glucoseReminders, enabled: value }
                                    }))
                                }
                                trackColor={{ false: '#767577', true: '#4facfe' }}
                                thumbColor={settings.glucoseReminders.enabled ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                        
                        {settings.glucoseReminders.enabled && (
                            <View style={patientDashboardStyles.settingsGroup}>
                                <Text style={patientDashboardStyles.description}>
                                    Check glucose {settings.glucoseReminders.postMealDelay} hours after each meal
                                </Text>
                                {!settings.mealReminders.enabled && (
                                    <Text style={patientDashboardStyles.warningText}>
                                        Enable meal reminders to use glucose reminders
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Insulin Reminders Section */}
                    <View style={patientDashboardStyles.section}>
                        <View style={patientDashboardStyles.sectionHeader}>
                            <Text style={patientDashboardStyles.sectionTitle}>💉 Insulin Reminders</Text>
                            <Switch
                                value={settings.insulinReminders.enabled}
                                onValueChange={(value) =>
                                    setSettings(prev => ({
                                        ...prev,
                                        insulinReminders: { ...prev.insulinReminders, enabled: value }
                                    }))
                                }
                                trackColor={{ false: '#767577', true: '#4facfe' }}
                                thumbColor={settings.insulinReminders.enabled ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                        
                        {settings.insulinReminders.enabled && (
                            <View style={patientDashboardStyles.settingsGroup}>
                                <TouchableOpacity
                                    style={patientDashboardStyles.timeSelector}
                                    onPress={() => setShowTimePicker({ type: 'insulin', show: true })}
                                >
                                    <Text style={patientDashboardStyles.timeLabel}>🕘 Long-Acting Insulin</Text>
                                    <Text style={patientDashboardStyles.timeValue}>
                                        {formatTime(settings.insulinReminders.longActingTime)}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={patientDashboardStyles.description}>
                                    Daily reminder for your long-acting insulin dose
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Bottom padding */}
                    <View style={patientDashboardStyles.bottomPadding} />
                </ScrollView>

                {/* Time Picker Modal */}
                {showTimePicker.show && (
                    <DateTimePicker
                        value={getTimePickerValue()}
                        mode="time"
                        is24Hour={false}
                        onChange={handleTimeChange}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    />
                )}
            </LinearGradient>
        </SafeAreaView>
    );
}
