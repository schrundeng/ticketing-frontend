import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Message = () => {
  const [users, setUsers] = useState([]); // State for storing users
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [messages, setMessages] = useState([]); // State for chat messages
  const [newMessage, setNewMessage] = useState(""); // State for new message input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const messageEndRef = useRef(null); // Reference to scroll to the bottom

  const operatorProfileImg =
    "https://i.pinimg.com/736x/cb/bc/ef/cbbceffe703ba2c8918132599130fdec.jpg"; // Operator's profile image

  // Function to fetch user data using axios
  const fetchUserData = async () => {
    const token = localStorage.getItem("token"); // Get the token from local storage
    try {
      const response = await axios.get(
        "http://localhost:8000/api/chat/pengelola/get-data-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      if (data.message === "User data retrieved successfully") {
        setUsers(data.data); // Store the user data
        setSelectedUser(data.data[0]); // Select the first user by default
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Function to fetch messages for the selected user using axios
  const fetchMessages = async (userId) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("to_id_user", userId); // Append the user ID to FormData

    try {
      console.log("Fetching messages for userId:", userId); // Debugging the user ID

      const response = await axios.post(
        "http://localhost:8000/api/chat/pengelola/get-message",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data); // Log the entire response

      const data = response.data;

      // Check if the response message indicates success
      if (data.message === "Messages retrieved successfully") {
        console.log("Messages retrieved:", data.data); // Log the raw message data

        // Format the messages for rendering
        const formattedMessages = data.data.map((msg) => ({
          text: msg.message, // The actual chat message
          sender:
            msg.from_name === selectedUser.name
              ? selectedUser.name
              : "Operator", // Sender info
          createdAt: msg.created_at, // Timestamp (optional)
        }));

        console.log("Formatted messages:", formattedMessages); // Log formatted messages

        setMessages(formattedMessages); // Update the state with chat messages
      } else {
        console.error("Unexpected message:", data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch messages when a new user is selected
  useEffect(() => {
    if (selectedUser) {
      console.log("Selected user:", selectedUser);
      fetchMessages(selectedUser.username); // Fetch messages using username
    }
  }, [selectedUser]);

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a new message
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (newMessage.trim()) {
      setLoading(true); // Set loading state to true

      const token = localStorage.getItem("token"); // Get the token
      const formData = new FormData();
      formData.append("to_id_user", selectedUser.username); // User ID of the selected user
      formData.append("message", newMessage); // The message to be sent

      try {
        const response = await axios.post(
          "http://localhost:8000/api/chat/pengelola/send-chat",
          formData,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle the API response
        console.log("Send Message Response:", response.data);
        if (response.data.message === "Chat sent successfully") {
          const sentMessage = {
            text: newMessage,
            sender: "Operator", // Assuming the operator is sending the message
          };
          setMessages((prevMessages) => [...prevMessages, sentMessage]); // Add the sent message to the state
          setNewMessage(""); // Clear input field
        } else {
          console.error("Error sending message:", response.data.message);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex h-[calc(100vh-6rem)] pt-3">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Chats</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.username} // Change key to use username
              onClick={() => {
                console.log("User clicked:", user); // Log user click
                setSelectedUser(user); // Set selected user
              }}
              className={`cursor-pointer p-3 rounded-lg mb-2 transition-colors duration-300 ${
                selectedUser && selectedUser.username === user.username
                  ? "bg-gray-700"
                  : "bg-gray-900 hover:bg-gray-700"
              }`}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-4">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-300 text-lg font-semibold text-gray-700 bg-white rounded-lg shadow-sm mb-4 flex items-center">
          {selectedUser && (
            <>
              <img
                src={selectedUser.profileImg || operatorProfileImg} // Use user profile image or operator image
                alt={`${selectedUser.name} profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              Chat with {selectedUser.name}
            </>
          )}
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
                      src={selectedUser.profileImg || operatorProfileImg} // Use user profile image or operator image
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
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
