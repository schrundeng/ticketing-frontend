// src/components/Message.js
import React, { useState } from 'react';

const Message = () => {
  const [messages, setMessages] = useState([]); // State for chat messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input

  // Handle sending a new message
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'Operator' }]);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded shadow-lg h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-300 text-lg font-semibold text-gray-700">
        Chat
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-scroll p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'Operator' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-3 py-2 rounded-lg ${message.sender === 'Operator' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex p-4 border-t border-gray-300">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300">Send</button>
      </form>
    </div>
  );
};

export default Message;
