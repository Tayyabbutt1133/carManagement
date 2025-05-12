export default function ChatMessages({ messages, currentUserId }) {
  return (
    <div className="h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-4 p-3 rounded-lg max-w-xs text-sm ${
            msg.senderId === currentUserId
              ? "bg-blue-500 text-white ml-auto"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
