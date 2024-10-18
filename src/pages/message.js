import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

const Message = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State for file attachment
  const messageEndRef = useRef(null);

  const operatorProfileImg =
    "https://i.pinimg.com/736x/cb/bc/ef/cbbceffe703ba2c8918132599130fdec.jpg";

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
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
        setUsers(data.data);
        setSelectedUser(data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMessages = async (userId) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("to_id_user", userId);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/chat/pengelola/get-message",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      if (data.message === "Messages retrieved successfully") {
        const formattedMessages = data.data.map((msg) => ({
          text: msg.message,
          type: msg.message_type, // Include message type
          sender:
            msg.from_name === selectedUser.name
              ? selectedUser.name
              : "Operator",
          createdAt: msg.created_at,
        }));

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.username);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);


  // Handle sending a new message or file
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true); // Set loading state

    const token = localStorage.getItem("token"); // Get the token
    const formData = new FormData();
    formData.append("to_id_user", selectedUser.username); // Append the user ID

    if (attachedFile) {
      formData.append("file", attachedFile); // Send the file
    } else {
      formData.append("message", newMessage); // Send the text message
    }

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

      if (response.data.message === "Chat sent successfully") {
        const sentMessage = {
          text: attachedFile ? attachedFile.name : newMessage,
          sender: "Operator",
          type: attachedFile ? "file" : "text",
        };
        setMessages((prevMessages) => [...prevMessages, sentMessage]); // Add the message to the state
        setNewMessage(""); // Clear the input field
        setAttachedFile(null); // Clear the attached file
      } else {
        console.error("Error sending message:", response.data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]); // Set the attached file
    setNewMessage(""); // Disable text input
  };

  const removeFileAttachment = () => {
    setSelectedFile(null); // Remove file
  };

  // File preview
  const renderMessage = (message) => {
    if (message.type === "file") {
      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(message.text);

      return (
        <div>
          {isImage ? (
            <img
              src={`http://localhost:8000/storage/${message.text}`}
              alt="Sent image"
              className="max-w-sx rounded-lg"
            />
          ) : (
            <div>
              <p>File sent:</p>
              <a
                href={`http://localhost:8000/storage/${message.text}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {message.text}
              </a>
            </div>
          )}
        </div>
      );
    }
    return <span>{message.text}</span>;
  };

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
              key={user.username}
              onClick={() => setSelectedUser(user)}
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
                src={selectedUser.profileImg || operatorProfileImg}
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
                    <div className="inline-block max-w-xs px-2 py-2 rounded-lg shadow bg-blue-500 text-white">
                      <strong>{message.sender}:</strong>{" "}
                      {renderMessage(message)}
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
                      src={selectedUser.profileImg || operatorProfileImg}
                      alt={`${message.sender} profile`}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="inline-block max-w-xs px-2 py-2 rounded-xl shadow bg-white text-gray-800 border border-gray-300">
                      <strong>{message.sender}:</strong>{" "}
                      {renderMessage(message)}
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
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden" // Hide the actual file input
              ref={fileInputRef} // Create a ref to programmatically trigger it
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()} // Open file dialog
              className="flex items-center justify-center p-2 border border-gray-300 rounded-l-lg bg-gray-100 hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faPaperclip} className="text-gray-600" />
            </button>
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!!attachedFile} // Disable input if a file is attached
            className="flex-1 p-3 border border-gray-300 focus:outline-none"
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
