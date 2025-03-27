import React, { useState } from 'react';
import axios from 'axios';
import './geminiChatBox.css'; // Import file CSS

const GeminiChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const url = import.meta.env.VITE_API_URL;

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newConversation = [...conversation, { type: 'user', text: message }];
    setConversation(newConversation);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/gemini`, { message });

      setConversation(prev => [...prev, { type: 'ai', text: response.data.reply }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setConversation(prev => [...prev, { type: 'ai', text: 'Xin lỗi, đã có lỗi xảy ra.' }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      {isOpen && (
        <div className="chat-box">
          {/* Header */}
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="close-button">✕</button>
          </div>

          {/* Messages Container */}
          <div className="chat-messages">
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="message ai">Đang tải...</div>}
          </div>

          {/* Input Area */}
          <div className="chat-input">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSendMessage} disabled={isLoading}>Gửi</button>
          </div>
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="chat-toggle">💬</button>
      )}
    </div>
  );
};

export default GeminiChatBox;
