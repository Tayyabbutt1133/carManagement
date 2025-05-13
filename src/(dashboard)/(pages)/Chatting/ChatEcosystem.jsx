import { useEffect, useState, useRef } from "react";
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

export default function ChatEcosystem() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState(null);
  const [role, setRole] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("user_type");
    setRole(storedRole);
  }, []);

  // Load chats for admin or create chat ID for regular user
  useEffect(() => {
    if (!user || !role) return;

    const loadChats = async () => {
      if (role === "admin") {
        const chats = await getAdminChatsWithUserInfo();
        setChatList(chats);
        // Set active chat to first one if available
        if (chats.length > 0 && !activeChat) {
          setActiveChat(chats[0].id);
        }
      } else {
        // For regular users - create a consistent chat ID using the exact
        // format from your database: admin_[userId]
        const id = `admin_${user.uid}`;
        setChatId(id);
        
        // Make sure the chat document exists in Firestore
        try {
          const chatRef = doc(db, "chats", id);
          const chatDoc = await getDoc(chatRef);
          if (!chatDoc.exists()) {
            // Create the chat document if it doesn't exist
            await setDoc(chatRef, {
              users: ["admin", user.uid],
              lastUpdated: serverTimestamp()
            });
          }
        } catch (error) {
          console.error("Error creating chat document:", error);
        }
      }
    };

    loadChats();
  }, [user, role, activeChat]);

  // Listen to messages for the active chat
  useEffect(() => {
    let unsub;
    
    if ((role === "admin" && activeChat) || (role !== "admin" && chatId)) {
      const chatToListen = role === "admin" ? activeChat : chatId;
      
      unsub = listenToMessages(chatToListen, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
    }
    
    return () => {
      if (unsub) unsub();
    };
  }, [activeChat, chatId, role]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const id = role === "admin" ? activeChat : chatId;
    if (!id) return;
    
    const senderId = role === "admin" ? "admin" : user.uid;
    await sendMessageToChat(id, senderId, text);
    setText("");
  };

  const handleChatSelect = (selectedChatId) => {
    setActiveChat(selectedChatId);
  };

  const renderTitle = () => {
    switch (role) {
      case "admin":
        return "Chats";
      case "renter":
      case "buyer":
        return "Support Chat";
      default:
        return "Chat";
    }
  };

  // Find the currently active chat's user info
  const activeChatUserInfo = chatList.find(chat => chat.id === activeChat)?.userInfo;

  return (
    <div className="h-screen flex bg-gray-100 rounded-2xl overflow-hidden border shadow">
      {/* Left Panel - Chat List (Admin only) */}
      {role === "admin" && (
        <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {renderTitle()}
          </h2>
          <ChatSelector
            chatList={chatList}
            activeChat={activeChat}
            onSelect={handleChatSelect}
          />
        </div>
      )}

      {/* Right Panel - Chat Messages */}
      <div className={`${role === "admin" ? "w-2/3" : "w-full"} flex flex-col`}>
        {/* Chat Header */}
        <div className="p-4 border-b bg-white">
          <h3 className="font-medium text-lg">
            {role === "admin" && activeChatUserInfo ? 
              `${activeChatUserInfo.name} (${activeChatUserInfo.role})` : 
              "Support Chat"}
          </h3>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <ChatMessages 
            messages={messages} 
            currentUserId={role === "admin" ? "admin" : user?.uid} 
          />
          {!messages.length && (
            <p className="text-center text-gray-400 mt-10">
              No messages yet. Start the conversation!
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        {((role === "admin" && activeChat) || (role !== "admin" && chatId)) && (
          <div className="border-t p-4 bg-white">
            <ChatInput
              text={text}
              onChange={(e) => setText(e.target.value)}
              onSubmit={handleSend}
            />
          </div>
        )}
        
        {role === "admin" && !activeChat && (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}