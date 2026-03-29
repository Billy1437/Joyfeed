import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const { signUp } = useAuth();



  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 3 characters long");
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      router.push("/(auth)/onboarding")
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}> Create Account</Text>
        <Text style={styles.subtitle}> Sign Up to Continue</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Email..."
            placeholderTextColor={"#999"}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <TextInput
            placeholder="Password..."
            placeholderTextColor={"#999"}
            autoComplete="password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            {loading ? (
              <ActivityIndicator size={24} color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkButtonText}>
              Already have an account?
              <Text
                style={styles.linkButtonTextBold}
                onPress={() => router.push("/(auth)/login")}
              >
                {" "}
                Sign In
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
