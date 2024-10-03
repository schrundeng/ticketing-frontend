import React, { useState, useEffect, useRef } from "react";
import NavbarUser from "./userNavbar.js";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const toId = "123456789012345678";
  const messagesEndRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8000/api/chat/user/get-message",
          { to_id_user: toId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.status === 200) {
          setMessages(response.data.data);
          console.log(response.data)
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to fetch messages. Please try again.");
      }
    };

    fetchMessages();
  }, []);

  const handleMessageSend = async (event) => {
    event.preventDefault();
    if (!message && !file) {
      setError("Please enter a message or upload a file.");
      return;
    }

    const formData = new FormData();
    if (message) {
      formData.append("message", message);
    }
    if (file) {
      formData.append("file", file);
    }
    formData.append("to_id_pengelola", toId);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/chat/user/send-chat",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("");
        setFile(null);
        setError("");

        const fetchMessages = async () => {
          const res = await axios.post(
            "http://localhost:8000/api/chat/user/get-message",
            { to_id_user: toId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
          setMessages(res.data.data);
          scrollToBottom();
        };
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send the message. Please try again.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    setIsScrolled(scrollTop + clientHeight < scrollHeight);
  };

  const determineSender = (fromId) => {
    if (fromId.length === 12) {
      return "user";
    } else if (fromId.length === 18) {
      return "operator";
    }
    return "unknown";
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://um.ac.id/wp-content/themes/umlearning/images/headerNew.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      ></div>
      <NavbarUser />
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 bg-opacity-80 mx-4 sm:mx-6 md:mx-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chat</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="max-h-60 overflow-y-auto mb-4" onScroll={handleScroll}>
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg, index) => {
              const senderType = determineSender(msg.from_id_user);
              return (
                <div
                  key={index}
                  className={`flex mb-2 ${
                    senderType === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs break-words ${
                      senderType === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    <p className="font-semibold">
                      {msg.from_name || "Unknown"}
                    </p>
                    <p>{msg.message || "File sent"}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No messages to display.</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {isScrolled && (
          <button
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300 z-50"
            onClick={scrollToBottom}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        )}

        <form onSubmit={handleMessageSend} className="flex items-center mt-4">
          <label className="cursor-pointer mr-2">
            <FontAwesomeIcon icon={faPaperclip} className="text-gray-600" />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
