import { useAuth } from "@/context/AuthContext";
import { formatTimeAgo, formatTimeRemaining } from "@/lib/datehelper";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Post, usePosts } from "../hooks/usePosts";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

const PostCard = ({ post, currentUserId }: PostCardProps) => {
  const postUser = post.profiles;
  const isOwnPost = post.user_id === currentUserId;
  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          {postUser?.profile_image_url ? (
            <Image
              source={{ uri: postUser.profile_image_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {postUser?.name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.username}>
              {isOwnPost ? "You" : `@${postUser?.username}`}
            </Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(post.created_at)}</Text>
          </View>
        </View>

        {/* post content */}

        <View style={styles.timeRemainingBadge}>
          <Text style={styles.timeRemainingText}>
            {formatTimeRemaining(post.expires_at)}
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: post.image_url }}
        style={styles.postImage}
        contentFit="cover"
      />
      <View style={styles.postFooter}>
        {post.description && (
          <Text style={styles.postDescription}>{post.description}</Text>
        )}
        <Text style={styles.postInfo}>
          {" "}
          {isOwnPost ? "Your Post" : `${postUser?.name}' post`} -expires in"{" "}
          {formatTimeRemaining(post.expires_at)}
        </Text>
      </View>
    </View>
  );
};

const HomePage = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const { createPost, posts } = usePosts();
  const { user } = useAuth();

  // check if user has active post
  const userActivePost = posts.find(
    (post) =>
      post.user_id === user?.id &&
      post.is_active &&
      new Date(post.expires_at) > new Date(),
  );

  // !! is used to convert the value to boolean , if null it will be false , if not null it will be true
  const hasActivePost = !!userActivePost;

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status != "granted") {
      Alert.alert("Permission needed", "We need camera permission");
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status != "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your photos to upload a profile image",
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      {
        text: "Camera",
        onPress: takePhoto,
      },
      {
        text: "Photo Library",
        onPress: pickImage,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handlePost = async () => {
    if (!previewImage) return;

    setIsUploading(true);
    try {
      await createPost(previewImage, description);

      setShowPreview(false);
      setPreviewImage(null);
      setDescription("");
    } catch (error) {
      console.error("Error posting", error);
      Alert.alert("Error", "Failed to post image");
    } finally {
      setIsUploading(false);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard post={item} currentUserId={user?.id} />
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
      {/* posts */}

      <FlatList data={posts} renderItem={renderPost} />

      <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
        <Text style={styles.fabText}>{hasActivePost ? "⏎" : "+"}</Text>
      </TouchableOpacity>

      <Modal visible={showPreview} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {hasActivePost ? "Replace Your Post" : "Preview Your Post"}
            </Text>
            {previewImage && (
              <Image
                source={{ uri: previewImage }}
                contentFit="cover"
                style={styles.previewImage}
              />
            )}
            <TextInput
              placeholder="add a description(optional)"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
              textAlignVertical="top"
              style={styles.descriptionInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPreview(false);
                  setPreviewImage(null);
                  setDescription("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.postButton]}
                onPress={handlePost}
              >
                <Text style={styles.postButtonText}>
                  {hasActivePost ? "Replace" : "Post"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    bottom: 104,
    width: 56,
    height: 56,
    right: 24,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  descriptionInput: {
    width: "100%",
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    // alignItems : "flex-end"
  },
  previewImage: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 16,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  postButton: {
    backgroundColor: "#000",
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  postContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  username: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  timeAgo: {
    fontSize: 12,
    color: "#666",
  },
  timeRemainingBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeRemainingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  postImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f5f5f5 ",
  },
  postDescription: {
    fontSize: 15,
    color: "#000",
    marginBottom: 8,
    lineHeight: 20,
  },
  postFooter: {
    padding: 16,
  },
  postInfo: {
    fontSize: 14,
    color: "#666",
  },
});

export default HomePage;
