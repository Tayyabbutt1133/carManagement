import { format } from "date-fns";

export default function ChatMessages({ messages, currentUserId }) {
  if (!messages || messages.length === 0) {
    return null;
  }

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(msg => {
      // Handle various timestamp formats
      let date;
      
      if (!msg.timestamp) {
        date = new Date(); // Fallback to current date if no timestamp
      } else if (msg.timestamp.toDate) {
        // Firebase Timestamp object
        date = msg.timestamp.toDate();
      } else if (msg.timestamp.seconds) {
        // Firebase Timestamp as raw object
        date = new Date(msg.timestamp.seconds * 1000);
      } else {
        // Regular Date or timestamp string
        date = new Date(msg.timestamp);
      }
      
      const dateStr = format(date, "MMMM d, yyyy");
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push({...msg, parsedDate: date});
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="space-y-6">
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date} className="message-group">
          <div className="flex justify-center mb-4">
            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
              {date}
            </span>
          </div>
          
          {msgs.map((msg) => {
            // Check if the message is from the current user
            const isCurrentUser = msg.senderId === currentUserId;
            // Format timestamp (using the already parsed date)
            const timestamp = msg.parsedDate ? format(msg.parsedDate, 'h:mm a') : '';

            return (
              <div
                key={msg.id}
                className={`mb-4 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs lg:max-w-md`}>
                  <div
                    className={`p-3 rounded-lg text-sm shadow ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div 
                    className={`text-xs text-gray-500 mt-1 ${
                      isCurrentUser ? "text-right mr-2" : "ml-2"
                    }`}
                  >
                    {timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}