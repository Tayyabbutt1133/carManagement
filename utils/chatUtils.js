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
} from "firebase/firestore";
import { db } from "../firebase/config";


export const getAdminChatsWithUserInfo = async () => {
  const chatCollection_ref = await getDocs(collection(db, "chats"));
  const chatDocs = chatCollection_ref.docs;

  return await Promise.all(
    chatDocs.map(async (docSnap) => {
      const chatData = docSnap.data();
      const otherUid = chatData.users.find((uid) => uid !== "admin");
      const userRef = doc(db, "users", otherUid);
      const userSnap = await getDoc(userRef);

      return {
        id: docSnap.id,
        userId: otherUid,
        userInfo: userSnap.exists()
          ? userSnap.data()
          : { name: "Unknown", role: "unknown" },
      };
    })
  );
};

export const listenToMessages = (chatId, callback) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp"));
  return onSnapshot(q, callback);
};

export const sendMessageToChat = async (chatId, userId, text) => {
  const chatRef = doc(db, "chats", chatId);
  await setDoc(chatRef, { users: ["admin", userId] }, { merge: true });

  await addDoc(collection(chatRef, "messages"), {
    senderId: userId,
    text,
    timestamp: new Date(),
  });
};
