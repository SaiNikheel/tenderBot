import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

const UploadPage = ({ onDocumentsUploaded }) => {
  const [tenderFile, setTenderFile] = useState(null);
  const [proposalFile, setProposalFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onTenderDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setTenderFile(file);
    }
  }, []);

  const onProposalDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setProposalFile(file);
    }
  }, []);

  const { getRootProps: getTenderRootProps, getInputProps: getTenderInputProps, isDragActive: isTenderDragActive } = useDropzone({
    onDrop: onTenderDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024 // 20MB
  });

  const { getRootProps: getProposalRootProps, getInputProps: getProposalInputProps, isDragActive: isProposalDragActive } = useDropzone({
    onDrop: onProposalDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024 // 20MB
  });

  const removeTenderFile = () => {
    setTenderFile(null);
  };

  const removeProposalFile = () => {
    setProposalFile(null);
  };

  const handleStartAnalysis = async () => {
    if (!tenderFile || !proposalFile) return;

    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onDocumentsUploaded(tenderFile, proposalFile);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Documents
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your tender document and proposal to start the AI-powered analysis
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Tender Document Upload */}
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
            
            {!tenderFile ? (
              <div
                {...getTenderRootProps()}
                className={`upload-zone ${isTenderDragActive ? 'active' : ''}`}
              >
                <input {...getTenderInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isTenderDragActive ? 'Drop the PDF here' : 'Drag & drop PDF here'}
                </p>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <p className="text-sm text-gray-400">Max size: 20MB</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-success-200 bg-success-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <div>
                      <p className="font-medium text-gray-900">{tenderFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(tenderFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeTenderFile}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Proposal Document Upload */}
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
            
            {!proposalFile ? (
              <div
                {...getProposalRootProps()}
                className={`upload-zone ${isProposalDragActive ? 'active' : ''}`}
              >
                <input {...getProposalInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isProposalDragActive ? 'Drop the PDF here' : 'Drag & drop PDF here'}
                </p>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <p className="text-sm text-gray-400">Max size: 20MB</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-success-200 bg-success-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <div>
                      <p className="font-medium text-gray-900">{proposalFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(proposalFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeProposalFile}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Start Analysis Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <button
          onClick={handleStartAnalysis}
          disabled={!tenderFile || !proposalFile || isUploading}
          className={`btn-primary text-lg px-8 py-3 ${
            (!tenderFile || !proposalFile || isUploading) 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-105 transform transition-transform'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            'Start Analysis'
          )}
        </button>
        
        {(!tenderFile || !proposalFile) && (
          <p className="text-gray-500 mt-4">
            Please upload both documents to continue
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default UploadPage; 