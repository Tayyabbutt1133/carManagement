export default function ChatInput({ text, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-4">
      <input
        className="flex-grow border p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Type a message..."
        value={text}
        onChange={onChange}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </form>
  );
}
