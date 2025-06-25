import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, ArrowLeft, FileText, MessageCircle } from 'lucide-react';
import apiService from '../services/api';

const ChatPage = ({ documents, analysisResult, onBackToReport }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I'm TenderBot, your AI assistant. I've analyzed your tender and proposal documents. You can ask me questions about:
      
• Compliance requirements and matches
• Missing or insufficient criteria
• Recommendations for improvement
• Specific sections of either document
• General tender analysis questions

What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      // Call the actual API
      const response = await apiService.chat(inputMessage, {
        analysisResult,
        documents: {
          tender: documents.tender?.name,
          proposal: documents.proposal?.name
        }
      });

      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat failed:', error);
      setError(error.message);
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again or rephrase your question about the tender analysis.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Chat with TenderBot
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Ask questions about your tender analysis and get AI-powered insights
        </p>
        
        <button
          onClick={onBackToReport}
          className="btn-secondary flex items-center space-x-2 mx-auto"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Report</span>
        </button>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <span className="text-error-800">
              Chat failed: {error}
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Document Summary Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              Document Summary
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tender Document</h4>
                <p className="text-sm text-gray-600">{documents.tender?.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Proposal Document</h4>
                <p className="text-sm text-gray-600">{documents.proposal?.name}</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Analysis Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Compliance Rate:</span>
                    <span className="font-medium text-primary-600">{analysisResult.summary.complianceRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Matched:</span>
                    <span className="font-medium text-success-600">{analysisResult.summary.matchedRequirements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mismatched:</span>
                    <span className="font-medium text-error-600">{analysisResult.summary.mismatchedRequirements}</span>
                  </div>
                  {analysisResult.summary.riskLevel && (
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className={`font-medium ${
                        analysisResult.summary.riskLevel === 'low' ? 'text-success-600' :
                        analysisResult.summary.riskLevel === 'medium' ? 'text-warning-600' :
                        'text-error-600'
                      }`}>
                        {analysisResult.summary.riskLevel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="card h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your tender analysis..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows="2"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    !inputMessage.trim() || isTyping
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage; 