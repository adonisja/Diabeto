// components/coreComponents/HumanBodyDiagram.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface InjectionSite {
    id: string;
    label: string;
    position: { top: number; left: number };
    color: string[];
    available: boolean;
    recommended?: boolean;
}

interface HumanBodyDiagramProps {
    selectedSite: string;
    onSiteSelect: (siteId: string) => void;
    userRole: string;
    recommendedSite?: string;
}

export default function HumanBodyDiagram({ 
    selectedSite, 
    onSiteSelect, 
    userRole, 
    recommendedSite 
}: HumanBodyDiagramProps) {
    const [hoveredSite, setHoveredSite] = useState<string | null>(null);
    const [twinkleAnimations, setTwinkleAnimations] = useState<{ [key: string]: Animated.Value }>({});
    
    // Initialize twinkle animations
    useEffect(() => {
        const animations: { [key: string]: Animated.Value } = {};
        const sites = ['left-arm', 'right-arm', 'stomach', 'left-leg', 'right-leg'];
        
        sites.forEach(siteId => {
            animations[siteId] = new Animated.Value(0);
        });
        
        setTwinkleAnimations(animations);
        
        // Start twinkle animations
        const startTwinkle = (siteId: string, isRecommended: boolean) => {
            const animation = animations[siteId];
            const duration = isRecommended ? 800 : 1500; // Recommended sites twinkle faster
            
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };
        
        // Start animations for all sites
        sites.forEach(siteId => {
            const isRecommended = recommendedSite === siteId;
            startTwinkle(siteId, isRecommended);
        });
    }, [recommendedSite]);
    
    // Define injection sites with their positions on the starry body outline
    const injectionSites: InjectionSite[] = [
        {
            id: 'left-arm',
            label: 'Left Arm',
            position: { top: 36, left: 25 },
            color: ['#ff6b9d', '#f093fb'],
            available: ['caretaker', 'doctor', 'admin'].includes(userRole),
            recommended: recommendedSite === 'left-arm'
        },
        {
            id: 'right-arm',
            label: 'Right Arm',
            position: { top: 36, left: 75 },
            color: ['#ff6b9d', '#f093fb'],
            available: ['caretaker', 'doctor', 'admin'].includes(userRole),
            recommended: recommendedSite === 'right-arm'
        },
        {
            id: 'stomach',
            label: 'Stomach',
            position: { top: 50, left: 50 },
            color: ['#43e97b', '#38f9d7'],
            available: true,
            recommended: recommendedSite === 'stomach'
        },
        {
            id: 'left-leg',
            label: 'Left Leg',
            position: { top: 75, left: 37 },
            color: ['#4facfe', '#00f2fe'],
            available: true,
            recommended: recommendedSite === 'left-leg'
        },
        {
            id: 'right-leg',
            label: 'Right Leg',
            position: { top: 75, left: 63 },
            color: ['#4facfe', '#00f2fe'],
            available: true,
            recommended: recommendedSite === 'right-leg'
        }
    ];

    const renderStarryBodyOutline = () => {
        // Define star positions to create a human body outline
        const bodyStars = [
            // Head outline
            { x: 50, y: 8, size: 6 },
            { x: 45, y: 10, size: 4 },
            { x: 55, y: 10, size: 4 },
            { x: 42, y: 14, size: 5 },
            { x: 58, y: 14, size: 5 },
            { x: 44, y: 18, size: 4 },
            { x: 56, y: 18, size: 4 },
            
            // Shoulders and upper torso
            { x: 35, y: 24, size: 5 },
            { x: 40, y: 22, size: 4 },
            { x: 45, y: 20, size: 4 },
            { x: 50, y: 20, size: 5 },
            { x: 55, y: 20, size: 4 },
            { x: 60, y: 22, size: 4 },
            { x: 65, y: 24, size: 5 },
            
            // Left arm outline
            { x: 25, y: 28, size: 4 },
            { x: 22, y: 32, size: 4 },
            { x: 20, y: 36, size: 4 },
            { x: 18, y: 40, size: 4 },
            { x: 17, y: 44, size: 4 },
            { x: 18, y: 48, size: 4 },
            { x: 20, y: 52, size: 4 },
            { x: 22, y: 56, size: 4 },
            
            // Right arm outline
            { x: 75, y: 28, size: 4 },
            { x: 78, y: 32, size: 4 },
            { x: 80, y: 36, size: 4 },
            { x: 82, y: 40, size: 4 },
            { x: 83, y: 44, size: 4 },
            { x: 82, y: 48, size: 4 },
            { x: 80, y: 52, size: 4 },
            { x: 78, y: 56, size: 4 },
            
            // Torso outline
            { x: 38, y: 26, size: 4 },
            { x: 35, y: 30, size: 4 },
            { x: 34, y: 35, size: 4 },
            { x: 33, y: 40, size: 4 },
            { x: 34, y: 45, size: 4 },
            { x: 35, y: 50, size: 4 },
            { x: 37, y: 55, size: 4 },
            { x: 40, y: 58, size: 4 },
            
            { x: 62, y: 26, size: 4 },
            { x: 65, y: 30, size: 4 },
            { x: 66, y: 35, size: 4 },
            { x: 67, y: 40, size: 4 },
            { x: 66, y: 45, size: 4 },
            { x: 65, y: 50, size: 4 },
            { x: 63, y: 55, size: 4 },
            { x: 60, y: 58, size: 4 },
            
            // Hip and waist
            { x: 42, y: 60, size: 4 },
            { x: 45, y: 62, size: 4 },
            { x: 50, y: 62, size: 5 },
            { x: 55, y: 62, size: 4 },
            { x: 58, y: 60, size: 4 },
            
            // Left leg outline
            { x: 42, y: 65, size: 4 },
            { x: 40, y: 70, size: 4 },
            { x: 38, y: 75, size: 4 },
            { x: 36, y: 80, size: 4 },
            { x: 35, y: 85, size: 4 },
            { x: 36, y: 90, size: 4 },
            { x: 38, y: 95, size: 4 },
            
            // Right leg outline
            { x: 58, y: 65, size: 4 },
            { x: 60, y: 70, size: 4 },
            { x: 62, y: 75, size: 4 },
            { x: 64, y: 80, size: 4 },
            { x: 65, y: 85, size: 4 },
            { x: 64, y: 90, size: 4 },
            { x: 62, y: 95, size: 4 },
        ];

        return bodyStars.map((star, index) => (
            <Animated.View
                key={index}
                style={[
                    styles.bodyOutlineStar,
                    {
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        opacity: Math.random() * 0.3 + 0.4, // Random opacity for twinkling effect
                    }
                ]}
            >
                <Ionicons name="star" size={star.size} color="#4a5568" />
            </Animated.View>
        ));
    };

    const renderBodyOutline = () => (
        <View style={styles.bodyContainer}>
            {/* Starry body outline */}
            <View style={styles.constellationBackground}>
                {renderStarryBodyOutline()}
                
                {/* Add some ambient background stars */}
                {[...Array(12)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.decorativeStar,
                            {
                                left: `${Math.random() * 90 + 5}%`,
                                top: `${Math.random() * 90 + 5}%`,
                                opacity: Math.random() * 0.2 + 0.1,
                            }
                        ]}
                    >
                        <Ionicons name="star" size={6} color="#e0e6ed" />
                    </View>
                ))}
            </View>
        </View>
    );

    const renderInjectionSite = (site: InjectionSite) => {
        const twinkleValue = twinkleAnimations[site.id];
        if (!twinkleValue) return null;

        if (!site.available) {
            return (
                <View
                    key={site.id}
                    style={[
                        styles.injectionSite,
                        {
                            top: `${site.position.top}%`,
                            left: `${site.position.left}%`,
                        }
                    ]}
                >
                    <View style={styles.unavailableStar}>
                        <Ionicons name="close" size={16} color="#666" />
                    </View>
                    {hoveredSite === site.id && (
                        <View style={styles.hoverLabel}>
                            <Text style={styles.hoverLabelText}>Restricted</Text>
                        </View>
                    )}
                </View>
            );
        }

        const isSelected = selectedSite === site.id;
        const isRecommended = site.recommended;
        const isHovered = hoveredSite === site.id;

        return (
            <TouchableOpacity
                key={site.id}
                style={[
                    styles.injectionSite,
                    {
                        top: `${site.position.top}%`,
                        left: `${site.position.left}%`,
                    }
                ]}
                onPress={() => onSiteSelect(site.id)}
                onPressIn={() => setHoveredSite(site.id)}
                onPressOut={() => setHoveredSite(null)}
                activeOpacity={0.9}
            >
                {/* Twinkling glow effect */}
                <Animated.View
                    style={[
                        styles.twinkleGlow,
                        {
                            opacity: twinkleValue,
                            backgroundColor: isRecommended ? '#FFD700' : site.color[0],
                            transform: [
                                {
                                    scale: twinkleValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, isRecommended ? 2.2 : 1.6],
                                    }),
                                },
                            ],
                        }
                    ]}
                />

                {/* Main injection star - larger and more prominent */}
                <Animated.View
                    style={[
                        styles.starContainer,
                        {
                            transform: [
                                {
                                    scale: isSelected ? 1.4 : 1,
                                },
                            ],
                        }
                    ]}
                >
                    <LinearGradient
                        colors={isSelected ? ['#4c669f', '#3b5998'] : site.color}
                        style={[
                            styles.injectionStar,
                            isRecommended && styles.recommendedStar,
                            isSelected && styles.selectedStar
                        ]}
                    >
                        <Ionicons 
                            name={isSelected ? "checkmark" : "star"} 
                            size={isSelected ? 28 : 24} 
                            color="#fff" 
                        />
                    </LinearGradient>

                    {/* Outer twinkling ring for recommended sites */}
                    {isRecommended && (
                        <Animated.View
                            style={[
                                styles.recommendedRing,
                                {
                                    opacity: twinkleValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.3, 0.8],
                                    }),
                                    transform: [
                                        {
                                            scale: twinkleValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.3],
                                            }),
                                        },
                                    ],
                                }
                            ]}
                        />
                    )}
                </Animated.View>

                {/* Hover label */}
                {isHovered && (
                    <Animated.View 
                        style={[
                            styles.hoverLabel,
                            {
                                opacity: 1,
                                transform: [{ scale: 1 }],
                            }
                        ]}
                    >
                        <Text style={styles.hoverLabelText}>{site.label}</Text>
                        {isRecommended && (
                            <Text style={styles.recommendedHint}>⭐ Recommended</Text>
                        )}
                    </Animated.View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Seamless header integrated into the starry background */}
            <View style={styles.headerSection}>
                <Text style={styles.title}>✨ Starry Body Injection Guide</Text>
                <Text style={styles.subtitle}>Touch the bright twinkling stars to select your injection site</Text>
            </View>
            
            {/* Expansive starry diagram - no separate container */}
            <View style={styles.expandedDiagramArea}>
                {renderBodyOutline()}
                {injectionSites.map(renderInjectionSite)}
                
                {/* Floating selection status */}
                {selectedSite && (
                    <View style={styles.floatingSelectionStatus}>
                        <Ionicons name="checkmark-circle" size={18} color="#4c669f" />
                        <Text style={styles.floatingSelectionText}>
                            {injectionSites.find(site => site.id === selectedSite)?.label} selected
                        </Text>
                    </View>
                )}
            </View>

            {/* Seamless bottom section with legend */}
            <View style={styles.legendSection}>
                <View style={styles.legend}>
                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#43e97b' }]} />
                            <Text style={styles.legendText}>Stomach</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#4facfe' }]} />
                            <Text style={styles.legendText}>Legs</Text>
                        </View>
                    </View>
                    
                    {['caretaker', 'doctor', 'admin'].includes(userRole) && (
                        <View style={styles.legendRow}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: '#ff6b9d' }]} />
                                <Text style={styles.legendText}>Arms</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.legendText}>Recommended</Text>
                            </View>
                        </View>
                    )}
                    
                    {userRole === 'patient' && (
                        <View style={styles.legendRow}>
                            <View style={styles.legendItem}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.legendText}>Recommended</Text>
                            </View>
                        </View>
                    )}
                </View>

                {userRole === 'patient' && (
                    <View style={styles.patientNote}>
                        <Ionicons name="information-circle" size={14} color="#FF6B6B" />
                        <Text style={styles.patientNoteText}>
                            Arm sites managed by caretaker
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e1a',
        minHeight: 700,
        margin: 8,
        borderRadius: 28,
        overflow: 'hidden',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
    },
    headerSection: {
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: '#4c669f',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 8,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: '#e0e6ed',
        textAlign: 'center',
        lineHeight: 26,
        opacity: 0.95,
        fontWeight: '500',
    },
    expandedDiagramArea: {
        flex: 1,
        position: 'relative',
        minHeight: 520,
        marginHorizontal: 4,
        marginVertical: 4,
    },
    bodyContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    constellationBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    decorativeStar: {
        position: 'absolute',
        opacity: 0.2,
    },
    injectionSite: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateX: -40 }, { translateY: -40 }],
        width: 80,
        height: 80,
    },
    twinkleGlow: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        opacity: 0.6,
    },
    starContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    injectionStar: {
        width: 62,
        height: 62,
        borderRadius: 31,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        borderWidth: 3,
        borderColor: '#fff',
    },
    selectedStar: {
        elevation: 16,
        shadowOpacity: 0.8,
        borderWidth: 4,
        borderColor: '#4c669f',
    },
    recommendedStar: {
        borderColor: '#FFD700',
        borderWidth: 4,
    },
    recommendedRing: {
        position: 'absolute',
        width: 85,
        height: 85,
        borderRadius: 42.5,
        borderWidth: 3,
        borderColor: '#FFD700',
        opacity: 0.8,
    },
    bodyOutlineStar: {
        position: 'absolute',
        opacity: 0.6,
    },
    unavailableStar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#2d3748',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4a5568',
        opacity: 0.4,
    },
    hoverLabel: {
        position: 'absolute',
        top: -62,
        left: -52,
        backgroundColor: 'rgba(26, 32, 44, 0.96)',
        borderRadius: 14,
        padding: 14,
        minWidth: 100,
        alignItems: 'center',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        borderWidth: 2,
        borderColor: '#4a5568',
    },
    hoverLabelText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    recommendedHint: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 4,
    },
    floatingSelectionStatus: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 102, 159, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    floatingSelectionText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },
    legendSection: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: 'rgba(26, 31, 46, 0.85)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(74, 85, 104, 0.4)',
    },
    legend: {
        marginBottom: 14,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 14,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    legendColor: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 8,
    },
    legendText: {
        fontSize: 12,
        color: '#b8c5d1',
        fontWeight: '600',
    },
    patientNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(45, 27, 27, 0.9)',
        padding: 12,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B6B',
    },
    patientNoteText: {
        fontSize: 12,
        color: '#ff9999',
        marginLeft: 8,
        flex: 1,
        fontWeight: '600',
    },
});
