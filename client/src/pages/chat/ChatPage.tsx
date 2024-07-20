import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';
import useLoading from '../../hooks/useLoading.ts';
import ChatService from '../../services/ChatService.ts';
import { ChatMessage } from '../../types/chatMessage';



const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // const { data: messagesLimit, setData:setMessagesLimit, error, isLoading } = useAsync(fetchTrains);


  const [executeAsyncFunction, isLoading] = useLoading();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      setInputValue('');
      setMessages(prevState => [...prevState, { role: "user", content: inputValue }]);
      await executeAsyncFunction(async () => {
        const response = await ChatService.sendMessage(inputValue, 1);
        setMessages(prevState => [...prevState, response])

      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // Функция для обработки текста и замены символов ** на теги <strong>
  const processText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // Функция для отображения обработанного текста как HTML
  const renderHTML = (htmlString: string) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };


  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}

          >
            <pre style={{ whiteSpace: 'pre-line', fontFamily: "Inter, sans-serif" }}>
              {renderHTML(processText(message.content))}
            </pre>
          </div>
        ))}
        {isLoading === true && <div>Loading</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Напишіть повідомлення..."
        />
        <button onClick={handleSendMessage}>Відправити</button>
      </div>
    </div>
  );
};

export default ChatPage;