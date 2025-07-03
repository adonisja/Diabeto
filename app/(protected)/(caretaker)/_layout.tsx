import { Stack } from 'expo-router';

export default function CaretakerLayout() {
    return (
        <Stack>
            {/* Caretaker's main dashboard/home screen */}
            <Stack.Screen
                name="index" // Corresponds to app/(protected)/(caretaker)/index.tsx
                options={{
                    headerShown: false, // Using custom AppHeader instead
                }}
            />
            {/* Caretaker's invite patient screen (you just created this!) */}
            <Stack.Screen
                name="invite-patient" // Corresponds to app/(protected)/caretaker/invite-patient.tsx
                options={{
                    title: 'Invite Patient',
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#3b5998' },
                }}
            />
            {/* Add other caretaker-specific screens here */}
            {/* Example: <Stack.Screen name="my-patients" options={{ title: 'My Patients' }} /> */}
        </Stack>
    );
}