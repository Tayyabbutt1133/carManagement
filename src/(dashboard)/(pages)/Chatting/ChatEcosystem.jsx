import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebase/config";
import {
  getAdminChatsWithUserInfo,
  listenToMessages,
  sendMessageToChat,
} from "../../../../utils/chatUtils";

import ChatSelector from "./ChatSelector";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatEcoystem() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState(null);
  const [role, setRole] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("user_type");
    setRole(storedRole);
  }, []);

  useEffect(() => {
    if (!user || !role) return;

    if (role === "admin") {
      getAdminChatsWithUserInfo().then(setChatList);
    } else {
      const id = `admin_${user.uid}`;
      setChatId(id);
      const unsub = listenToMessages(id, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
      return () => unsub();
    }
  }, [user, role]);

  useEffect(() => {
    if (activeChat) {
      const unsub = listenToMessages(activeChat, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
      return () => unsub();
    }
  }, [activeChat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const id = chatId || activeChat;
    await sendMessageToChat(id, user.uid, text);
    setText("");
  };

  const renderTitle = () => {
    switch (role) {
      case "admin":
        return "Admin Dashboard – Chat with Users";
      case "renter":
      case "buyer":
        return "Support Chat – Talk with Admin";
      default:
        return "Chat";
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border h-screen flex flex-col">
      <div className="mb-4 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">{renderTitle()}</h2>
        {role === "admin" && chatList.length > 0 && (
          <div className="mt-4">
            <ChatSelector
              chatList={chatList}
              onChange={(e) => setActiveChat(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        <ChatMessages messages={messages} currentUserId={user?.uid} />
        {!messages.length && (
          <p className="text-center text-gray-400 mt-10">No messages yet.</p>
        )}
      </div>

      {(chatId || activeChat) && (
        <div className="pt-4 border-t">
          <ChatInput
            text={text}
            chatList={chatList}
            onChange={(e) => setText(e.target.value)}
            onSubmit={handleSend}
          />
        </div>
      )}
    </div>
  );
}
