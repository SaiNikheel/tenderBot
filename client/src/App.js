import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadPage from './components/UploadPage';
import AnalysisPage from './components/AnalysisPage';
import ReportPage from './components/ReportPage';
import ChatPage from './components/ChatPage';
import Header from './components/Header';

function App() {
  const [currentPage, setCurrentPage] = useState('upload');
  const [documents, setDocuments] = useState({
    tender: null,
    proposal: null
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDocumentsUploaded = (tenderDoc, proposalDoc) => {
    setDocuments({ tender: tenderDoc, proposal: proposalDoc });
    setCurrentPage('analysis');
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setCurrentPage('report');
  };

  const handleStartChat = () => {
    setCurrentPage('chat');
  };

  const handleBackToUpload = () => {
    setDocuments({ tender: null, proposal: null });
    setAnalysisResult(null);
    setCurrentPage('upload');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'upload':
        return (
          <UploadPage 
            onDocumentsUploaded={handleDocumentsUploaded}
          />
        );
      case 'analysis':
        return (
          <AnalysisPage 
            documents={documents}
            onAnalysisComplete={handleAnalysisComplete}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
          />
        );
      case 'report':
        return (
          <ReportPage 
            analysisResult={analysisResult}
            documents={documents}
            onStartChat={handleStartChat}
            onBackToUpload={handleBackToUpload}
          />
        );
      case 'chat':
        return (
          <ChatPage 
            documents={documents}
            analysisResult={analysisResult}
            onBackToReport={() => setCurrentPage('report')}
          />
        );
      default:
        return <UploadPage onDocumentsUploaded={handleDocumentsUploaded} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App; 