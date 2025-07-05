// components/coreComponents/StarryBodyDiagram.tsx

import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal, 
    Animated, 
    Dimensions, 
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface InjectionSite {
    id: string;
    label: string;
    position: { top: number; left: number };
    color: string[];
    available: boolean;
    recommended?: boolean;
    advanced?: boolean; // Indicates if this is an advanced injection site requiring extra care
    medicalNote: string;
}

interface StarryBodyDiagramProps {
    selectedSite: string;
    onSiteSelect: (siteId: string) => void;
    userRole: string;
    recommendedSite?: string;
    onClose: () => void;
}

// Custom Star Component with beautiful animations
const AnimatedStar = ({ 
    size = 8, 
    color = '#FFD700', 
    delay = 0,
    intensity = 1 
}: { 
    size?: number; 
    color?: string; 
    delay?: number;
    intensity?: number;
}) => {
    const twinkleAnim = useRef(new Animated.Value(0.3)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const twinkle = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(twinkleAnim, {
                        toValue: intensity,
                        duration: 1000 + Math.random() * 2000,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(twinkleAnim, {
                        toValue: 0.3,
                        duration: 1000 + Math.random() * 2000,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        const scale = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.2,
                        duration: 2000 + Math.random() * 1000,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 2000 + Math.random() * 1000,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        setTimeout(() => {
            twinkle();
            scale();
        }, delay);
    }, [delay, intensity]);

    return (
        <Animated.View
            style={[
                styles.star,
                {
                    opacity: twinkleAnim,
                    transform: [{ scale: scaleAnim }],
                    width: size,
                    height: size,
                }
            ]}
        >
            <View
                style={[
                    styles.starShape,
                    {
                        backgroundColor: color,
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    }
                ]}
            />
        </Animated.View>
    );
};

// Human Body Outline Component with SVG
const HumanBodyOutline = () => {
    const outlineAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(outlineAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(outlineAnim, {
                    toValue: 0.7,
                    duration: 3000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View 
            style={[
                styles.bodyOutline,
                { opacity: outlineAnim }
            ]}
        >
            <Svg height="100%" width="100%" viewBox="0 0 200 300">
                {/* Head */}
                <Circle
                    cx="100"
                    cy="25"
                    r="15"
                    stroke="#87CEEB"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,3"
                />
                
                {/* Neck */}
                <Path
                    d="M 95 40 L 95 50 L 105 50 L 105 40"
                    stroke="#87CEEB"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="3,2"
                />
                
                {/* Torso */}
                <Path
                    d="M 70 50 
                       Q 65 60 65 80
                       L 65 120
                       Q 65 140 75 145
                       L 125 145
                       Q 135 140 135 120
                       L 135 80
                       Q 135 60 130 50
                       Z"
                    stroke="#87CEEB"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8,4"
                />
                
                {/* Left Arm */}
                <Path
                    d="M 70 60 
                       Q 50 65 40 80
                       Q 35 90 35 100
                       Q 35 110 40 115
                       Q 45 120 50 115"
                    stroke="#DDA0DD"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6,3"
                />
                
                {/* Right Arm */}
                <Path
                    d="M 130 60 
                       Q 150 65 160 80
                       Q 165 90 165 100
                       Q 165 110 160 115
                       Q 155 120 150 115"
                    stroke="#DDA0DD"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6,3"
                />
                
                {/* Left Leg */}
                <Path
                    d="M 85 145 
                       L 82 180
                       Q 80 200 82 220
                       Q 85 240 85 260
                       L 85 280"
                    stroke="#98FB98"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8,4"
                />
                
                {/* Right Leg */}
                <Path
                    d="M 115 145 
                       L 118 180
                       Q 120 200 118 220
                       Q 115 240 115 260
                       L 115 280"
                    stroke="#98FB98"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8,4"
                />
                
                {/* Anatomical markers as small stars */}
                <Circle cx="100" cy="85" r="2" fill="#FFD700" opacity="0.8" />
                <Circle cx="85" cy="70" r="2" fill="#ff6b9d" opacity="0.8" />
                <Circle cx="115" cy="70" r="2" fill="#ff6b9d" opacity="0.8" />
                <Circle cx="85" cy="200" r="2" fill="#4facfe" opacity="0.8" />
                <Circle cx="115" cy="200" r="2" fill="#4facfe" opacity="0.8" />
            </Svg>
        </Animated.View>
    );
};
const InjectionSiteStar = ({ 
    site, 
    onPress, 
    selected, 
    recommended,
    userRole 
}: { 
    site: InjectionSite; 
    onPress: () => void; 
    selected: boolean;
    recommended: boolean;
    userRole: string;
}) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (recommended) {
            // Special animation for recommended sites
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.4,
                        duration: 800,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1200,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [recommended]);

    return (
        <TouchableOpacity
            style={[
                styles.injectionSite,
                {
                    top: `${site.position.top}%`,
                    left: `${site.position.left}%`,
                    opacity: site.available ? 1 : 0.3,
                }
            ]}
            onPress={site.available ? onPress : undefined}
            disabled={!site.available}
        >
            {/* Glow effect for recommended sites */}
            {recommended && (
                <Animated.View
                    style={[
                        styles.glowEffect,
                        {
                            opacity: glowAnim,
                            transform: [{ scale: pulseAnim }],
                        }
                    ]}
                />
            )}
            
            {/* Main star */}
            <Animated.View
                style={[
                    styles.mainStar,
                    {
                        transform: [{ scale: recommended ? pulseAnim : 1 }],
                    }
                ]}
            >
                <LinearGradient
                    colors={site.color}
                    style={styles.starGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons 
                        name={selected ? "star" : "star-outline"} 
                        size={28} 
                        color="#fff" 
                    />
                </LinearGradient>
            </Animated.View>

            {/* Selection indicator */}
            {selected && (
                <View style={styles.selectionRing}>
                    <Ionicons name="checkmark-circle" size={16} color="#FFD700" />
                </View>
            )}

            {/* Unavailable indicator */}
            {!site.available && (
                <View style={styles.unavailableOverlay}>
                    <Ionicons name="lock-closed" size={12} color="#999" />
                </View>
            )}

            {/* Advanced site indicator for patients */}
            {site.advanced && userRole === 'patient' && (
                <View style={styles.advancedSiteIndicator}>
                    <Text style={styles.advancedSiteText}>A</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function StarryBodyDiagram({ 
    selectedSite, 
    onSiteSelect, 
    userRole, 
    recommendedSite,
    onClose 
}: StarryBodyDiagramProps) {
    const [selectedSiteInfo, setSelectedSiteInfo] = useState<InjectionSite | null>(null);

    // Generate random background stars
    const generateBackgroundStars = () => {
        const stars = [];
        const starCount = 80;
        
        for (let i = 0; i < starCount; i++) {
            stars.push({
                id: i,
                top: Math.random() * 100,
                left: Math.random() * 100,
                size: 2 + Math.random() * 4,
                color: ['#FFD700', '#87CEEB', '#DDA0DD', '#98FB98', '#F0E68C'][Math.floor(Math.random() * 5)],
                delay: Math.random() * 3000,
                intensity: 0.4 + Math.random() * 0.6,
            });
        }
        
        return stars;
    };

    const backgroundStars = generateBackgroundStars();

    // Define injection sites with updated positions to match SVG body outline
    const injectionSites: InjectionSite[] = [
        {
            id: 'left-arm',
            label: 'Left Arm',
            position: { top: 23, left: 15 }, // Adjusted to match SVG arm position
            color: ['#ff6b9d', '#f093fb'],
            available: true, // Now available for all users including patients
            advanced: true, // Mark as advanced injection site
            recommended: recommendedSite === 'left-arm',
            medicalNote: userRole === 'patient' 
                ? 'Advanced injection site. Slower absorption rate, ideal for long-acting insulin. Ensure proper technique and rotation. Consider consulting your healthcare provider.'
                : 'Slower absorption, ideal for long-acting insulin. Monitor patient technique and provide guidance.'
        },
        {
            id: 'right-arm',
            label: 'Right Arm',
            position: { top: 23, left: 85 }, // Adjusted to match SVG arm position
            color: ['#ff6b9d', '#f093fb'],
            available: true, // Now available for all users including patients
            advanced: true, // Mark as advanced injection site
            recommended: recommendedSite === 'right-arm',
            medicalNote: userRole === 'patient' 
                ? 'Advanced injection site. Slower absorption rate, ideal for long-acting insulin. Ensure proper technique and rotation. Consider consulting your healthcare provider.'
                : 'Slower absorption, ideal for long-acting insulin. Monitor patient technique and provide guidance.'
        },
        {
            id: 'stomach',
            label: 'Stomach',
            position: { top: 40, left: 50 }, // Centered on abdomen area of SVG
            color: ['#43e97b', '#38f9d7'],
            available: true,
            recommended: recommendedSite === 'stomach',
            medicalNote: 'Fastest absorption rate, perfect for short-acting insulin before meals.'
        },
        {
            id: 'left-leg',
            label: 'Left Leg',
            position: { top: 68, left: 32 }, // Adjusted to match SVG left leg
            color: ['#4facfe', '#00f2fe'],
            available: true,
            recommended: recommendedSite === 'left-leg',
            medicalNote: 'Medium absorption rate, good for both long and short-acting insulin.'
        },
        {
            id: 'right-leg',
            label: 'Right Leg',
            position: { top: 68, left: 68 }, // Adjusted to match SVG right leg
            color: ['#4facfe', '#00f2fe'],
            available: true,
            recommended: recommendedSite === 'right-leg',
            medicalNote: 'Medium absorption rate, good for both long and short-acting insulin.'
        }
    ];

    const handleSitePress = (site: InjectionSite) => {
        if (!site.available) return;
        
        setSelectedSiteInfo(site);
        setTimeout(() => {
            onSiteSelect(site.id);
        }, 500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
            
            {/* Starry Background */}
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={styles.background}
            >
                {/* Background Stars */}
                {backgroundStars.map((star) => (
                    <View
                        key={star.id}
                        style={{
                            position: 'absolute',
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                        }}
                    >
                        <AnimatedStar
                            size={star.size}
                            color={star.color}
                            delay={star.delay}
                            intensity={star.intensity}
                        />
                    </View>
                ))}

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>✨ Starry Injection Guide</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Body Diagram Container */}
                <View style={styles.bodyContainer}>
                    <Text style={styles.instructionText}>
                        Touch a star to select your injection site
                    </Text>

                    {/* Human Body Outline with Stars */}
                    <View style={styles.bodyOutline}>
                        {/* SVG Body Outline */}
                        <HumanBodyOutline />
                        
                        {/* Constellation background stars around the body */}
                        <View style={styles.bodyShape}>
                            {/* Subtle constellation stars around the outline */}
                            {[...Array(20)].map((_, i) => (
                                <View 
                                    key={i} 
                                    style={[
                                        styles.constellationStar, 
                                        { 
                                            top: `${10 + (Math.random() * 80)}%`,
                                            left: `${10 + (Math.random() * 80)}%`
                                        }
                                    ]}
                                >
                                    <AnimatedStar 
                                        size={2 + Math.random() * 3} 
                                        color="#87CEEB" 
                                        delay={i * 150} 
                                        intensity={0.3 + Math.random() * 0.4} 
                                    />
                                </View>
                            ))}
                        </View>

                        {/* Injection Site Stars */}
                        {injectionSites.map((site) => (
                            <InjectionSiteStar
                                key={site.id}
                                site={site}
                                onPress={() => handleSitePress(site)}
                                selected={selectedSite === site.id}
                                recommended={site.recommended || false}
                                userRole={userRole}
                            />
                        ))}
                    </View>

                    {/* Legend */}
                    <View style={styles.legend}>
                        <View style={styles.legendRow}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.legendText}>Recommended Site</Text>
                        </View>
                        <View style={styles.legendRow}>
                            <Ionicons name="star-outline" size={16} color="#87CEEB" />
                            <Text style={styles.legendText}>Available Site</Text>
                        </View>
                        {userRole === 'patient' && (
                            <View style={styles.legendRow}>
                                <View style={styles.legendAdvancedIndicator}>
                                    <Text style={styles.legendAdvancedText}>A</Text>
                                </View>
                                <Text style={styles.legendText}>Advanced Site (Extra Care Required)</Text>
                            </View>
                        )}
                        <View style={styles.legendRow}>
                            <Ionicons name="lock-closed" size={16} color="#999" />
                            <Text style={styles.legendText}>Restricted Site</Text>
                        </View>
                    </View>

                    {/* Site Information */}
                    {selectedSiteInfo && (
                        <View style={styles.siteInfo}>
                            <LinearGradient
                                colors={selectedSiteInfo.color}
                                style={styles.siteInfoGradient}
                            >
                                <Text style={styles.siteInfoTitle}>✨ {selectedSiteInfo.label}</Text>
                                <Text style={styles.siteInfoNote}>{selectedSiteInfo.medicalNote}</Text>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={() => onSiteSelect(selectedSiteInfo.id)}
                                >
                                    <Text style={styles.confirmButtonText}>Confirm Selection</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    )}
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 20,
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginRight: 44,
    },
    headerSpacer: {
        width: 44,
    },
    bodyContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    instructionText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.9,
    },
    bodyOutline: {
        flex: 1,
        position: 'relative',
        maxHeight: 500,
        alignSelf: 'center',
        width: screenWidth * 0.8,
    },
    bodyShape: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    constellationStar: {
        position: 'absolute',
    },
    star: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    starShape: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    injectionSite: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateX: -20 }, { translateY: -20 }],
    },
    glowEffect: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFD700',
        opacity: 0.3,
    },
    mainStar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    starGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectionRing: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        padding: 2,
    },
    unavailableOverlay: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 10,
        padding: 2,
    },
    advancedSiteIndicator: {
        position: 'absolute',
        top: -8,
        left: -8,
        backgroundColor: '#FF6B35',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    advancedSiteText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    legend: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    legendText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 14,
    },
    legendAdvancedIndicator: {
        backgroundColor: '#FF6B35',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    legendAdvancedText: {
        color: '#fff',
        fontSize: 8,
        fontWeight: 'bold',
    },
    siteInfo: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    siteInfoGradient: {
        padding: 20,
        alignItems: 'center',
    },
    siteInfoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    siteInfoNote: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
        marginBottom: 16,
        lineHeight: 20,
    },
    confirmButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
