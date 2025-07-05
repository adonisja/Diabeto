import { Stack } from 'expo-router';

export default function PatientLayout() {
    return (
        <Stack>
            {/* Patient's main dashboard/home screen */}
            <Stack.Screen
                name="index" // Corresponds to app/(protected)/(patient)/index.tsx
                options={{
                    headerShown: false, // Using custom AppHeader instead
                }}
            />
            {/* Patient's invitations screen */}
            <Stack.Screen
                name="invitations" // Corresponds to app/(protected)/(patient)/invitations.tsx
                options={{
                    title: 'My Invitations',
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#3b5998' },
                }}
            />
            
            {/* Insulin Logging Screen */}
            <Stack.Screen
                name="insulin-logging" // Corresponds to app/(protected)/(patient)/insulin-logging.tsx
                options={{
                    headerShown: false, // Using custom header in the component
                }}
            />
            
            {/* Glucose Monitoring Screen */}
            <Stack.Screen
                name="glucose-monitoring" // Corresponds to app/(protected)/(patient)/glucose-monitoring.tsx
                options={{
                    headerShown: false, // Using custom header in the component
                }}
            />
            
            {/* Reminders Screen */}
            <Stack.Screen
                name="reminders" // Corresponds to app/(protected)/(patient)/reminders.tsx
                options={{
                    headerShown: false, // Using custom header in the component
                }}
            />
            
            {/* Patient Invitations Screen */}
            <Stack.Screen
                name="patientInvitationsScreen" // Corresponds to app/(protected)/(patient)/patientInvitationsScreen.tsx
                options={{
                    headerShown: false, // Using custom header in the component
                }}
            />
            
            {/* Add other patient-specific screens here */}
            {/* Example: <Stack.Screen name="my-caretakers" options={{ title: 'My Caretakers' }} /> */}
        </Stack>
    );
}