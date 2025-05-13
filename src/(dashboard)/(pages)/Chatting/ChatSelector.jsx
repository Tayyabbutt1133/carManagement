import { formatDistanceToNow } from "date-fns";

export default function ChatSelector({ chatList, activeChat, onSelect }) {
  if (!chatList || chatList.length === 0) {
    return <div className="text-gray-500 text-center py-4">No chats available</div>;
  }

  return (
    <div className="space-y-1">
      {chatList.map((chat) => {
        // Format timestamp if available
        const timeAgo = chat.lastMessage?.timestamp 
          ? formatDistanceToNow(new Date(chat.lastMessage.timestamp.toDate()), { addSuffix: true })
          : "No messages";

        return (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`w-full cursor-pointer text-left px-4 py-3 rounded-xl transition ${
              activeChat === chat.id ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <div className="flex cursor-pointer justify-between items-center mb-1">
              <span className="font-medium text-gray-800">
                {chat.userInfo?.name || "Unknown User"}
              </span>
              <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm cursor-pointer text-gray-600 truncate max-w-xs">
                {chat.lastMessage?.text || `${chat.userInfo?.role || "User"} - Start chatting`}
              </div>
              
              {/* Unread indicator - can be implemented if you track read status */}
              {chat.unreadCount > 0 && (
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}