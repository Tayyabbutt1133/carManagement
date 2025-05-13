import { useState } from "react";

export default function ChatInput({ text, onChange, onSubmit }) {
  const [isTyping, setIsTyping] = useState(false);

  const handleChange = (e) => {
    onChange(e);
    setIsTyping(e.target.value.trim().length > 0);
  };

  const handleSubmit = (e) => {
    onSubmit(e);
    setIsTyping(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      <input
        className="flex-grow border p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
      />
      <button
        type="submit"
        disabled={!isTyping}
        className={`px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 transition ${
          isTyping
            ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Send
      </button>
    </form>
  );
}