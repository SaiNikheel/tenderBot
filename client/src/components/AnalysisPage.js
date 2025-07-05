import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Document, Page } from 'react-pdf';
import { Loader2, CheckCircle, AlertCircle, FileText, BarChart3, Zap } from 'lucide-react';
import apiService from '../services/api';

const AnalysisPage = ({ documents, onAnalysisComplete, isAnalyzing, setIsAnalyzing }) => {
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const analysisSteps = [
    { id: 'extracting', label: 'Extracting text from PDFs', icon: FileText },
    { id: 'parsing', label: 'Parsing document structure', icon: BarChart3 },
    { id: 'comparing', label: 'Comparing requirements', icon: Zap },
    { id: 'analyzing', label: 'Generating analysis report', icon: CheckCircle }
  ];

  const startAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisStep(0);
    setError(null);

    try {
      // Start the actual API call immediately
      const analysisPromise = apiService.analyzeDocuments(documents.tender, documents.proposal);
      
      // Simulate progress updates while the API is processing
      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisStep(i);
        
        // Simulate step duration (shorter for better UX)
        await new Promise(resolve => {
          const duration = 1500 + Math.random() * 500; // 1.5-2 seconds per step
          const interval = setInterval(() => {
            setProgress(prev => {
              const newProgress = prev + (100 / analysisSteps.length / 15);
              if (newProgress >= (i + 1) * (100 / analysisSteps.length)) {
                clearInterval(interval);
                resolve();
              }
              return newProgress;
            });
          }, duration / 15);
        });
      }

      // Wait for the actual API response
      const result = await analysisPromise;
      
      // Ensure progress shows 100% completion
      setProgress(100);
      setAnalysisStep(analysisSteps.length - 1);
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsAnalyzing(false);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error.message);
      setIsAnalyzing(false);
    }
  }, [documents, analysisSteps.length, setIsAnalyzing, onAnalysisComplete]);

  useEffect(() => {
    if (documents.tender && documents.proposal) {
      startAnalysis();
    }
  }, [documents, startAnalysis]);

  const onDocumentLoadSuccess = (type, { numPages }) => {
    // Store numPages if needed for future use
    console.log(`${type} document has ${numPages} pages`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Analyzing Documents
        </h2>
        <p className="text-lg text-gray-600">
          AI is comparing your tender and proposal documents
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-error-600" />
            <span className="text-error-800">
              Analysis failed: {error}
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Tender Document Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              Tender Document
            </h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
              {documents.tender ? (
                <Document
                  file={documents.tender}
                  onLoadSuccess={(pdf) => onDocumentLoadSuccess('tender', pdf)}
                  loading={
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading PDF...</span>
                    </div>
                  }
                >
                  <Page pageNumber={1} width={300} />
                </Document>
              ) : (
                <div className="text-gray-500">No document uploaded</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Proposal Document Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              Proposal Document
            </h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
              {documents.proposal ? (
                <Document
                  file={documents.proposal}
                  onLoadSuccess={(pdf) => onDocumentLoadSuccess('proposal', pdf)}
                  loading={
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading PDF...</span>
                    </div>
                  }
                >
                  <Page pageNumber={1} width={300} />
                </Document>
              ) : (
                <div className="text-gray-500">No document uploaded</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analysis Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Analysis Progress
        </h3>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-primary-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Analysis Steps */}
        <div className="space-y-4">
          {analysisSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = analysisStep === index;
            const isCompleted = analysisStep > index;
            
            return (
              <motion.div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'border-success-200 bg-success-50' 
                    : isActive 
                      ? 'border-primary-200 bg-primary-50' 
                      : 'border-gray-200 bg-gray-50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isCompleted 
                    ? 'bg-success-500 text-white' 
                    : isActive 
                      ? 'bg-primary-500 text-white animate-pulse' 
                      : 'bg-gray-300 text-gray-500'
                }`}>
                  {isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isActive ? 'text-primary-700' : 'text-gray-700'
                  }`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex space-x-1 mt-1"
                    >
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </motion.div>
                  )}
                </div>
                {isCompleted && (
                  <CheckCircle className="h-5 w-5 text-success-500" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisPage; 