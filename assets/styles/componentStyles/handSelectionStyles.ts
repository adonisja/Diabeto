// assets/styles/componentStyles/handSelectionStyles.ts

import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Fallback color
    },
    
    // Background gradient container
    backgroundGradient: {
        flex: 1,
    },
    
    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        textAlign: 'center',
        flex: 1,
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    
    placeholder: {
        width: 40,
    },
    
    // Content Styles
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    
    instructionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2563eb',  // Professional blue color
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
        lineHeight: 28,
        fontFamily: 'System',  // Use system font for better readability
        textShadowColor: 'rgba(255, 255, 255, 0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        letterSpacing: 0.5,  // Slight letter spacing for elegance
    },

    // Enhanced instruction text for finger selection
    fingerInstructionText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e40af',  // Deeper blue for finger selection
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
        lineHeight: 30,
        fontFamily: 'System',
        textShadowColor: 'rgba(255, 255, 255, 0.9)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        letterSpacing: 0.8,
        textTransform: 'none',
    },

    // Instruction container with subtle background
    instructionContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(37, 99, 235, 0.1)',
    },
    
    // Hand Selection Styles
    handSelectionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    handOptionsContainer: {
        width: '100%',
        gap: 20,
    },
    
    handOption: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    
    handOptionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
        gap: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',  // Slightly more transparent
    },
    
    handImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',  // Ensure transparent background
        padding: 8,  // Add padding for better visual spacing
        borderRadius: 12,  // Rounded corners for the image container
    },
    
    handOptionLabel: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    
    fingerSelectionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,  // Add some vertical padding
    },
    
    fingerButton: {
        width: 45,   // Increased from 30 to 45
        height: 45,  // Increased from 30 to 45
        borderRadius: 22.5,  // Increased from 15 to 22.5 (half of width/height)
        overflow: 'hidden',
        shadowColor: '#2563eb',  // Blue shadow matching medical theme
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',  // Subtle white border
    },

    // Pressed/Active state for finger button
    fingerButtonPressed: {
        transform: [{ scale: 1.2 }],  // Scale up on press
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 12,
    },
    
    fingerButtonGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    fingerButtonText: {
        fontSize: 10,        // Increased from 8 to 10 for larger buttons
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',  // Stronger shadow for better readability
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    
    // Image-based Hand Selection Styles
    handImage: {
        width: 120,
        height: 150,
        marginBottom: 8,
        backgroundColor: 'transparent',  // Remove any background color
    },
    
    handDisplayImage: {
        width: width * 0.9,  // Increased from 0.8 to 0.9
        height: 480,         // Increased from 400 to 480
        alignSelf: 'center',
        backgroundColor: 'transparent',  // Remove white background
        opacity: 0.95,  // Slightly transparent to blend better with background
        // No border radius or shadows to blend seamlessly
    },

    // Enhanced hand display container to blend seamlessly with background
    handDisplayContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 40,
        height: 550,  // Increased height for better centering
        marginTop: 0,  // Remove top margin to center better
        backgroundColor: 'transparent',  // Completely transparent
        // Remove all borders and shadows to blend seamlessly
    },
    
    // Image overlay to help blend with background - default for right hand
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(240, 249, 255, 0.1)',  // Very subtle overlay matching gradient
        borderRadius: 15,
        zIndex: 1,
    },

    // Lighter overlay specifically for left hand (lighter drawing)
    imageOverlayLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',  // Much lighter background for left hand
        borderRadius: 15,
        zIndex: 1,
    },

    // Enhanced image container for blending
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    // Animations and Enhanced Styles
    selectedFingerButton: {
        transform: [{ scale: 1.1 }],
        shadowOpacity: 0.4,
    },
    
    recommendedFingerButton: {
        shadowColor: '#f59e0b',
        shadowOpacity: 0.4,
    },
});
