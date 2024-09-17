import React from 'react';

const ChatPage = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Room</h1>
        <button className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">Profile</button>
      </header>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Message Bubbles */}
        <div className="self-start bg-white p-3 rounded-lg shadow max-w-xs">
          <p>Heyy! How are you? (≧◡≦) ♡</p>
        </div>

        <div className="self-end bg-blue-500 text-white p-3 rounded-lg shadow max-w-xs ml-auto">
          <p>I'm great! How about youuu? ヽ(*⌒▽⌒*)ﾉ</p>
        </div>

        <div className="self-start bg-white p-3 rounded-lg shadow max-w-xs">
          <p>Same here!</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 flex items-center space-x-2 border-t border-gray-300">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Type a message... (❁´◡`❁)"
        />
        <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
