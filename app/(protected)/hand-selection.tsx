// app/(protected)/hand-selection.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

// Create a simple state manager for finger selection
let fingerSelectionCallback: ((finger: string) => void) | null = null;

export const setFingerSelectionCallback = (callback: (finger: string) => void) => {
    fingerSelectionCallback = callback;
};

export const clearFingerSelectionCallback = () => {
    fingerSelectionCallback = null;
};
import handSelectionStyles from '../../assets/styles/componentStyles/handSelectionStyles';

const { width } = Dimensions.get('window');

type SelectionStep = 'hand' | 'finger';
type HandSide = 'left' | 'right';

// Finger position mappings for overlay buttons (recalibrated for larger image and smaller buttons)
const FINGER_POSITIONS = {
    left: {
        thumb: { left: 295, top: 255, label: 'Thumb' },    // Thumb on right side for left hand
        index: { left: 225, top: 151, label: 'Index' },    // Index finger
        middle: { left: 175, top: 160, label: 'Middle' },   // Middle finger  
        ring: { left: 146, top: 200, label: 'Ring' },      // Ring finger
        pinky: { left: 100, top: 210, label: 'Pinky' }      // Pinky on left side
    },
    right: {
        thumb: { left: 115, top: 210, label: 'Thumb' },     // Moved left 15px (45→30) and up 5px (300→295)
        index: { left: 160, top: 152, label: 'Index' },     // Moved left 5px (125→120) and up 10px (100→90)
        middle: { left: 187, top: 140, label: 'Middle' },   // Moved left 3px (185→182) and up 6px (55→49)
        ring: { left: 223, top: 160, label: 'Ring' },       // Moved right 15px (255→270) and up 10px (85→75)
        pinky: { left: 260, top: 195, label: 'Pinky' }     // Moved right 20px (315→335) and up 20px (155→135)
    }
};

// Finger Button Component with Pulse Animation
const FingerButton = ({ finger, pos, onPress }: { 
    finger: string; 
    pos: { left: number; top: number; label: string }; 
    onPress: () => void; 
}) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const continuousPulse = useRef(new Animated.Value(1)).current;
    const [isPressed, setIsPressed] = useState(false);

    // Continuous subtle pulse effect
    useEffect(() => {
        const createPulse = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(continuousPulse, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(continuousPulse, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };
        
        // Start pulse after a small delay
        const timer = setTimeout(createPulse, Math.random() * 1000);
        return () => clearTimeout(timer);
    }, []);

    const startPulse = () => {
        setIsPressed(true);
        Animated.sequence([
            Animated.timing(pulseAnim, {
                toValue: 1.25,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => setIsPressed(false));
    };

    const combinedScale = Animated.multiply(continuousPulse, pulseAnim);

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: pos.left,
                    top: pos.top,
                    transform: [{ scale: combinedScale }],
                }
            ]}
        >
            <TouchableOpacity
                style={[
                    handSelectionStyles.fingerButton,
                    isPressed && handSelectionStyles.fingerButtonPressed
                ]}
                onPress={() => {
                    startPulse();
                    setTimeout(() => onPress(), 200);
                }}
                onPressIn={startPulse}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#3b82f6', '#1d4ed8']}
                    style={handSelectionStyles.fingerButtonGradient}
                >
                    <Text style={handSelectionStyles.fingerButtonText}>
                        {pos.label}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function HandSelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const [step, setStep] = useState<SelectionStep>('hand');
    const [selectedHand, setSelectedHand] = useState<HandSide | null>(null);

    const handleHandSelection = (hand: HandSide) => {
        setSelectedHand(hand);
        setStep('finger');
    };

    const handleFingerSelection = (finger: string) => {
        const fullFingerName = `${finger}_${selectedHand}`;
        
        // Call the callback if it exists
        if (fingerSelectionCallback) {
            fingerSelectionCallback(fullFingerName);
        }
        
        // Navigate back
        router.back();
    };

    const handleBack = () => {
        if (step === 'finger') {
            setStep('hand');
        } else {
            router.back();
        }
    };

    const renderFingerButtons = () => {
        if (!selectedHand) return null;
        
        const positions = FINGER_POSITIONS[selectedHand];
        
        return Object.entries(positions).map(([finger, pos]) => (
            <FingerButton
                key={finger}
                finger={finger}
                pos={pos}
                onPress={() => handleFingerSelection(finger)}
            />
        ));
    };

    return (
        <SafeAreaView style={handSelectionStyles.container}>
            <LinearGradient
                colors={[
                    '#f0f9ff',  // Very light blue
                    '#e0f2fe',  // Light blue  
                    '#f8fafc',  // Very light gray
                    '#f1f5f9'   // Light gray-blue
                ]}
                style={handSelectionStyles.backgroundGradient}
            >
            {/* Header */}
            <View style={handSelectionStyles.header}>
                <TouchableOpacity 
                    style={handSelectionStyles.backButton}
                    onPress={handleBack}
                >
                    <Ionicons 
                        name={step === 'hand' ? 'close' : 'arrow-back'} 
                        size={24} 
                        color="#374151" 
                    />
                </TouchableOpacity>
                
                <Text style={handSelectionStyles.headerTitle}>
                    {step === 'hand' ? 'Select Hand' : `Select Finger - ${selectedHand === 'left' ? 'Left' : 'Right'} Hand`}
                </Text>
                
                <View style={handSelectionStyles.placeholder} />
            </View>

            {/* Content */}
            <View style={handSelectionStyles.content}>
                {step === 'hand' ? (
                    // Hand Selection Step
                    <View style={handSelectionStyles.handSelectionContainer}>
                        <View style={handSelectionStyles.instructionContainer}>
                            <Text style={handSelectionStyles.instructionText}>
                                👋 Which hand would you like to use for your glucose reading?
                            </Text>
                        </View>
                        
                        <View style={handSelectionStyles.handOptionsContainer}>
                            {/* Left Hand Option */}
                            <TouchableOpacity
                                style={handSelectionStyles.handOption}
                                onPress={() => handleHandSelection('left')}
                            >
                                <LinearGradient
                                    colors={['#f8fafc', '#e2e8f0']}
                                    style={handSelectionStyles.handOptionGradient}
                                >
                                    <View style={handSelectionStyles.handImageContainer}>
                                        <Image
                                            source={require('../../assets/images/left_hand.png')}
                                            style={handSelectionStyles.handImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={handSelectionStyles.handOptionLabel}>Left Hand</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Right Hand Option */}
                            <TouchableOpacity
                                style={handSelectionStyles.handOption}
                                onPress={() => handleHandSelection('right')}
                            >
                                <LinearGradient
                                    colors={['#f8fafc', '#e2e8f0']}
                                    style={handSelectionStyles.handOptionGradient}
                                >
                                    <View style={handSelectionStyles.handImageContainer}>
                                        <Image
                                            source={require('../../assets/images/right_hand.png')}
                                            style={handSelectionStyles.handImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={handSelectionStyles.handOptionLabel}>Right Hand</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    // Finger Selection Step
                    <View style={handSelectionStyles.fingerSelectionContainer}>
                        <View style={handSelectionStyles.handDisplayContainer}>
                            <View style={handSelectionStyles.imageContainer}>
                                <Image
                                    source={selectedHand === 'left' 
                                        ? require('../../assets/images/left_hand.png')
                                        : require('../../assets/images/right_hand.png')
                                    }
                                    style={handSelectionStyles.handDisplayImage}
                                    resizeMode="contain"
                                />
                                <View style={handSelectionStyles.imageOverlay} />
                            </View>
                            {renderFingerButtons()}
                        </View>
                    </View>
                )}
            </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
