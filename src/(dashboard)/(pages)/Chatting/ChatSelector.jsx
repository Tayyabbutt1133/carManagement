export default function ChatSelector({ chatList, onChange }) {
//   console.log("chat list in dropdown", chatList);

  return (
    <div className="mb-6">
      <label className="font-medium text-gray-600">Select a chat:</label>
      <select
        className="border p-3 rounded-lg w-full mt-2 text-gray-700 focus:ring-2 focus:ring-blue-500 transition"
        onChange={onChange}
        defaultValue=""
      >
        <option value="" disabled>
          Select user
        </option>
        {chatList.map((chat) => (
          <option key={chat.id} value={chat.id}>
              {chat.userInfo.name} ({chat.userInfo.role})
          </option>
        ))}
      </select>
    </div>
  );
}
