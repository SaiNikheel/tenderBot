import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileText, BarChart3, MessageCircle } from 'lucide-react';

const Header = ({ currentPage }) => {
  const steps = [
    { id: 'upload', label: 'Upload Documents', icon: FileText },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'report', label: 'Report', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentPage);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-primary-600 p-2 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TenderBot</h1>
              <p className="text-sm text-gray-500">AI Tender Analyzer</p>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentPage === step.id;
              const isCompleted = index < getCurrentStepIndex();
              
              return (
                <motion.div
                  key={step.id}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted 
                      ? 'bg-success-500 text-white' 
                      : isActive 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Progress Indicator */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 