import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RouteGuard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const segments = useSegments();

  const inAuthGroup = segments[0] === "(auth)";
  const inTabsGroup = segments[0] === "(tabs)";

  useEffect(() => {

    if (loading) return;

    if (!user) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
      //auth mhr shi pee thr so do nothing otherwise replace
    } else {
      //user shi pe thr so
      //tabs mhr shi pee thr so do nothing otherwise replace
      if (!inTabsGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [user, segments, router]);

  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (

    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
    </AuthProvider>
  );
}
