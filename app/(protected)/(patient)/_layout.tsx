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
            {/* Add other patient-specific screens here */}
            {/* Example: <Stack.Screen name="my-caretakers" options={{ title: 'My Caretakers' }} /> */}
        </Stack>
    );
}