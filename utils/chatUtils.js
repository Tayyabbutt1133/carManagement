import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  where,
  limit
} from "firebase/firestore";
import { db } from "../firebase/config";

// Get all chats for admin with user info
export const getAdminChatsWithUserInfo = async () => {
  try {
    // Get all documents from chats collection
    const chatCollection_ref = await getDocs(collection(db, "chats"));
    const chatDocs = chatCollection_ref.docs;

    return await Promise.all(
      chatDocs.map(async (docSnap) => {
        const chatData = docSnap.data();
        
        // Find the user ID (not admin)
        const otherUid = chatData.users.find((uid) => uid !== "admin");
        if (!otherUid) return null; // Skip if no user found
        
        // Get user info
        const userRef = doc(db, "users", otherUid);
        const userSnap = await getDoc(userRef);
        
        // Get last message
        let lastMessage = null;
        try {
          const messagesRef = collection(db, "chats", docSnap.id, "messages");
          const lastMessageQuery = query(
            messagesRef, 
            orderBy("timestamp", "desc"),
            limit(1)
          );
          const lastMessageSnap = await getDocs(lastMessageQuery);
          if (!lastMessageSnap.empty) {
            lastMessage = lastMessageSnap.docs[0].data();
          }
        } catch (error) {
          console.error(`Error getting last message for chat ${docSnap.id}:`, error);
        }
        
        return {
          id: docSnap.id,
          userId: otherUid,
          userInfo: userSnap.exists()
            ? userSnap.data()
            : { name: `User ${otherUid.substring(0, 6)}`, role: "unknown" },
          lastMessage: lastMessage,
          unreadCount: 0 // You can implement this later if needed
        };
      })
    ).then(results => results.filter(Boolean)); // Filter out any null results
  } catch (error) {
    console.error("Error fetching admin chats:", error);
    return [];
  }
};

// Listen to messages in real-time
export const listenToMessages = (chatId, callback) => {
  if (!chatId) return null;
  
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    return onSnapshot(q, callback, (error) => {
      console.error(`Error listening to messages for chat ${chatId}:`, error);
    });
  } catch (error) {
    console.error("Error setting up message listener:", error);
    return null;
  }
};

// Send a message to chat
export const sendMessageToChat = async (chatId, senderId, text) => {
  try {
    // Ensure chat document exists first
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);
    
    // Get the userId based on the chat ID format (admin_userId)
    let userId;
    if (chatId.startsWith("admin_")) {
      userId = chatId.substring(6); // Extract userId from admin_userId format
    } else {
      // Fallback to finding from existing chat data
      userId = senderId === "admin" && chatSnap.exists()
        ? chatSnap.data().users.find(uid => uid !== "admin")
        : senderId;
    }
    
    // Ensure chat document exists
    if (!chatSnap.exists()) {
      await setDoc(chatRef, { 
        users: ["admin", userId],
        lastUpdated: serverTimestamp()
      });
    } else {
      // Update lastUpdated timestamp
      await updateDoc(chatRef, { lastUpdated: serverTimestamp() });
    }

    // Add the message to the subcollection
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId,
      text,
      timestamp: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};