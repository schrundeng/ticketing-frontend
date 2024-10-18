import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const toId = selectedOperator || "123456789012345678"; // Default ID
  const messagesEndRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/chat/user/get-data-operator",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        setOperators(response.data.data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    };

    fetchOperators();
  }, []);

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
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to fetch messages. Please try again.");
      }
    };

    if (selectedOperator) {
      fetchMessages();
    }
  }, [selectedOperator, toId]);

  // NEW EFFECT to auto-scroll after messages are updated
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(); // Scroll to the bottom when messages are updated
    }
  }, [messages]);

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
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessage("");
        setFile(null);
        setFilePreview(null); // Clear file preview after sending
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
          scrollToBottom(); // Auto-scroll after new message is sent
        };
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send the message. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Preview the file if it's an image
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setFilePreview(e.target.result); // Set the image preview
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null); // If it's not an image, just show the file name
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    setMessage(""); // Re-enable the message input when the file is cleared
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Check if we are at the bottom after scrolling
    const chatBox = document.querySelector(".overflow-y-auto");
    if (chatBox) {
      const { scrollTop, scrollHeight, clientHeight } = chatBox;
      if (scrollTop + clientHeight >= scrollHeight) {
        setIsScrolled(false); // Hide the button if we're at the bottom
      }
    }
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
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 bg-opacity-80 mx-4 sm:mx-6 md:mx-8 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Chat</h2>

          <FormControl
            variant="outlined"
            size="small"
            style={{ minWidth: 200 }}
          >
            <InputLabel id="select-operator-label">Select Operator</InputLabel>
            <Select
              labelId="select-operator-label"
              id="select-operator"
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              label="Select Operator"
            >
              {operators &&
                operators.map((operator) => (
                  <MenuItem
                    key={operator.id_pengelola}
                    value={operator.id_pengelola}
                  >
                    {operator.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div
          className="overflow-y-auto mb-4"
          onScroll={handleScroll}
          style={{ height: "50vh" }}
        >
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
                    {/* Check for message type */}
                    {msg.message_type === "text" ? (
                      <p>{msg.message}</p>
                    ) : msg.message_type === "file" ? (
                      <div>
                        <p>File sent:</p>
                        {/* Display image preview if the file is an image */}
                        {msg.message.endsWith(".jpg") ||
                        msg.message.endsWith(".jpeg") ||
                        msg.message.endsWith(".png") ? (
                          <img
                            src={`http://localhost:8000/storage/${msg.message}`} // Adjust the URL as necessary
                            alt="File Preview"
                            className="max-w-full h-auto rounded-lg"
                          />
                        ) : (
                          <a
                            href={`http://localhost:80000/storage/${msg.message}`} // Adjust the URL as necessary
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black-500 underline"
                          >
                            {msg.message.split("/").pop()}{" "}
                            {/* Display the file name */}
                          </a>
                        )}
                      </div>
                    ) : null}{" "}
                    {/* Handle other message types if necessary */}
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
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>

          {file && (
            <div className="flex items-center">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-10 h-10 object-cover mr-2"
                />
              ) : (
                <span className="mr-2">{file.name}</span>
              )}
              <button
                type="button"
                onClick={clearFile}
                className="text-red-500"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 border border-gray-300 p-2 rounded-lg mr-2"
            disabled={!!file} // Disable if a file is attached
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
