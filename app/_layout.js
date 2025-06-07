import { Stack, useRouter, useSegments } from "expo-router";
import AuthProvider, { useAuth } from "../firebase/AuthContext.js";
import React, {useEffect} from "react";

/* This RootLayout Component will wrap the entire app */
function RootLayoutContent() {
  const { user } = useAuth();         // This gets the userstate from authContext
  const router = useRouter();        // This will initialize the router hook
  const segments = useSegments();    // This will get the current URL segments

  /* This effect will handle redirects based on authentication status */
  useEffect(() => {

    // Do nothing if the user is still undefined, i.e. Firebase is checking if the user is logged in
    if (user === undefined) return;

    // Checks if the current route is in the (auth) group
    const inAuthGroup = segments[0] === '(auth)';

    if (user) {  // If the user is logged in
      if (!user.emailVerified) { 
        if (!inAuthGroup) {
          auth().signOut();
          router.replace('/')
          Alert.alert(`Please verify your email to progress`
            [{ text: "OK" }]
          );
          console.log(`User ${email} is unverified, Forcing Log Out`)
        }
      } 

      if  (user.emailVerified) {
        if (inAuthGroup) {            // If the user is logged in AND currently on an (auth) route
          router.replace('/home');    // redirect them to the main homepage
          console.log(`User ${user.email} logged in. Redirecting from (auth) to Home.`)
        } else {
          console.log(`User ${user.email} logged in and verified. Current path: /${segments.join('/')}`);
        }
      }         
      
    } else {
      if (!inAuthGroup) {
        router.replace('/');
        console.log(`User not logged in, redirecting to Login Page`);
      } else {
        console.log(`User not logged in. Current path: /${segments.join('/')}`);
      }
    }
  }, [user, segments, router]);


  return (
    <Stack>
      {user ? (
        <>
          <Stack.Screen 
            name="(auth)" 
            options={{headerShown: false, animation: "none"}}
            redirect
          />
          <Stack.Screen 
            name="(protected)" 
            options={{headerShown: false, animation: "none"}}
          />
        </>
        
      ) : (
        <>
          <Stack.Screen 
            name="(auth)"
            options={{headerShown: false, animation: "none"}}
          />
          <Stack.Screen 
            name="(protected)"
            options={{headerShown: false, animation: "none"}}
            redirect
          />
          <Stack.Screen 
            name="[...unmatched]"
            options={{headerShown: false, animation: "none"}}
            redirect
          />
        </>
        
      )}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>)
}
