import React, { useState, useEffect, useRef } from "react";

const Message = () => {
  // Dummy chat data with profile images for users and operator
  const chatData = {
    User1: {
      profileImg: "https://i.redd.it/os9z4v7ljol81.jpg",
      messages: [
        { text: ":3", sender: "User1" },
        { text: "kys", sender: "Operator" },
      ],
    },
    User2: {
      profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
      messages: [
        { text: "Can you help me with my account?", sender: "User2" },
        { text: "Sure! What’s the issue?", sender: "Operator" },
      ],
    },
    User3: {
      profileImg: "https://randomuser.me/api/portraits/men/3.jpg",
      messages: [
        { text: "What’s the latest update on my request?", sender: "User3" },
        {
          text: "We are still working on it. Will update soon!",
          sender: "Operator",
        },
      ],
    },
  };

  const operatorProfileImg =
    "https://i.pinimg.com/736x/cb/bc/ef/cbbceffe703ba2c8918132599130fdec.jpg"; // Operator's profile image

  const [selectedUser, setSelectedUser] = useState("User1"); // Default to User1
  const [messages, setMessages] = useState(chatData[selectedUser].messages); // State for chat messages
  const [newMessage, setNewMessage] = useState(""); // State for new message input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const messageEndRef = useRef(null); // Reference to scroll to the bottom

  // When switching users, update the chat messages
  useEffect(() => {
    setMessages(chatData[selectedUser].messages);
  }, [selectedUser]);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a new message
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setLoading(true); // Set loading state to true
      setTimeout(() => {
        // Simulate a network request
        const updatedMessages = [
          ...messages,
          { text: newMessage, sender: "Operator" },
        ];
        setMessages(updatedMessages);
        setNewMessage(""); // Clear input field
        chatData[selectedUser].messages = updatedMessages; // Update the dummy data for current user
        setLoading(false); // Reset loading state
      }, 1000);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] pt-3">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Chats</h2>
        <ul>
          {Object.keys(chatData).map((user) => (
            <li
              key={user}
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer p-3 rounded-lg mb-2 transition-colors duration-300 ${
                selectedUser === user
                  ? "bg-gray-700"
                  : "bg-gray-900 hover:bg-gray-700"
              }`}
            >
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-4">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-300 text-lg font-semibold text-gray-700 bg-white rounded-lg shadow-sm mb-4 flex items-center">
          <img
            src={chatData[selectedUser].profileImg}
            alt={`${selectedUser} profile`}
            className="w-10 h-10 rounded-full mr-4"
          />
          Chat with {selectedUser}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-inner">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center">No messages yet</div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex items-center ${
                  message.sender === "Operator"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender === "Operator" ? (
                  <>
                    <div className="inline-block max-w-xs px-4 py-2 rounded-xl shadow bg-blue-500 text-white">
                      <strong>{message.sender}:</strong> {message.text}
                    </div>
                    <img
                      src={operatorProfileImg}
                      alt="Operator profile"
                      className="w-8 h-8 rounded-full ml-2"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={chatData[selectedUser].profileImg}
                      alt={`${message.sender} profile`}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="inline-block max-w-xs px-4 py-2 rounded-xl shadow bg-white text-gray-800 border border-gray-300">
                      <strong>{message.sender}:</strong> {message.text}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="text-gray-500 text-center">Sending message...</div>
          )}
          <div ref={messageEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={sendMessage}
          className="flex mt-4 bg-white rounded-lg shadow-md"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
