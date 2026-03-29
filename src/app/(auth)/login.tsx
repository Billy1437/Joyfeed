import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/(tabs)");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}> Welcome Back </Text>
        <Text style={styles.subtitle}> Sign In to Continue</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Email..."
            placeholderTextColor={"#999"}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password..."
            placeholderTextColor={"#999"}
            autoComplete="password"
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            {loading ? (
              <ActivityIndicator size={24} color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkButtonText}>
              Dont have an account?
              <Text
                style={styles.linkButtonTextBold}
                onPress={() => router.push("/(auth)/signup")}
              >
                {" "}
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#000",
    fontSize: 14,
  },
  linkButtonTextBold: {
    fontWeight: "600",
    color: "#000",
  },
});
