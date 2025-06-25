import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Download, MessageCircle, ArrowLeft, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';

const ReportPage = ({ analysisResult, documents, onStartChat, onBackToUpload }) => {
  const [expandedSections, setExpandedSections] = useState({
    matches: true,
    mismatches: true,
    recommendations: true,
    detailedAnalysis: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const downloadReport = () => {
    const reportData = {
      summary: analysisResult.summary,
      matches: analysisResult.matches,
      mismatches: analysisResult.mismatches,
      recommendations: analysisResult.recommendations,
      detailedAnalysis: analysisResult.detailedAnalysis,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tenderbot-analysis-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800',
      financial: 'bg-green-100 text-green-800',
      legal: 'bg-purple-100 text-purple-800',
      experience: 'bg-orange-100 text-orange-800',
      certification: 'bg-indigo-100 text-indigo-800',
      insurance: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getImpactColor = (impact) => {
    const colors = {
      high: 'bg-error-100 text-error-800',
      medium: 'bg-warning-100 text-warning-800',
      low: 'bg-success-100 text-success-800'
    };
    return colors[impact] || 'bg-gray-100 text-gray-800';
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
          Analysis Report
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          AI-powered comparison results for your tender documents
        </p>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-gray-900">{analysisResult.summary.totalRequirements}</div>
            <div className="text-sm text-gray-600">Total Requirements</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card text-center bg-success-50 border-success-200"
          >
            <div className="text-2xl font-bold text-success-600">{analysisResult.summary.matchedRequirements}</div>
            <div className="text-sm text-success-600">Matched</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card text-center bg-error-50 border-error-200"
          >
            <div className="text-2xl font-bold text-error-600">{analysisResult.summary.mismatchedRequirements}</div>
            <div className="text-sm text-error-600">Mismatched</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card text-center bg-primary-50 border-primary-200"
          >
            <div className="text-2xl font-bold text-primary-600">{analysisResult.summary.complianceRate}%</div>
            <div className="text-sm text-primary-600">Compliance Rate</div>
          </motion.div>
        </div>

        {/* Additional Summary Info */}
        {(analysisResult.summary.riskLevel || analysisResult.summary.competitivePosition) && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {analysisResult.summary.riskLevel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="card text-center"
              >
                <div className="text-lg font-bold text-gray-900 mb-2">Risk Level</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  analysisResult.summary.riskLevel === 'low' ? 'bg-success-100 text-success-800' :
                  analysisResult.summary.riskLevel === 'medium' ? 'bg-warning-100 text-warning-800' :
                  'bg-error-100 text-error-800'
                }`}>
                  {analysisResult.summary.riskLevel.toUpperCase()}
                </div>
              </motion.div>
            )}

            {analysisResult.summary.competitivePosition && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="card text-center"
              >
                <div className="text-lg font-bold text-gray-900 mb-2">Competitive Position</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  analysisResult.summary.competitivePosition === 'strong' ? 'bg-success-100 text-success-800' :
                  analysisResult.summary.competitivePosition === 'moderate' ? 'bg-warning-100 text-warning-800' :
                  'bg-error-100 text-error-800'
                }`}>
                  {analysisResult.summary.competitivePosition.toUpperCase()}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            onClick={onStartChat}
            className="btn-primary flex items-center space-x-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Ask Questions</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            onClick={downloadReport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download Report</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            onClick={onBackToUpload}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>New Analysis</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Detailed Sections */}
      <div className="space-y-6">
        {/* Matches Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="card"
        >
          <button
            onClick={() => toggleSection('matches')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-success-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                ✅ Matching Requirements ({analysisResult.matches.length})
              </h3>
            </div>
            {expandedSections.matches ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.matches && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-3"
              >
                {analysisResult.matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-success-50 border border-success-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-success-800">{match.requirement}</h4>
                      {match.category && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(match.category)}`}>
                          {match.category}
                        </span>
                      )}
                    </div>
                    <p className="text-success-700 text-sm mb-2">{match.description}</p>
                    {match.evidence && (
                      <div className="text-success-600 text-xs">
                        <strong>Evidence:</strong> {match.evidence}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mismatches Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="card"
        >
          <button
            onClick={() => toggleSection('mismatches')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <XCircle className="h-6 w-6 text-error-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                ❌ Mismatched Requirements ({analysisResult.mismatches.length})
              </h3>
            </div>
            {expandedSections.mismatches ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.mismatches && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-3"
              >
                {analysisResult.mismatches.map((mismatch, index) => (
                  <motion.div
                    key={mismatch.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-error-50 border border-error-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-error-800">{mismatch.requirement}</h4>
                      </div>
                      <div className="flex space-x-2">
                        {mismatch.category && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(mismatch.category)}`}>
                            {mismatch.category}
                          </span>
                        )}
                        {mismatch.impact && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(mismatch.impact)}`}>
                            {mismatch.impact} impact
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-error-700 text-sm mb-2">{mismatch.description}</p>
                    {mismatch.recommendation && (
                      <div className="text-error-600 text-xs">
                        <strong>Recommendation:</strong> {mismatch.recommendation}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recommendations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="card"
        >
          <button
            onClick={() => toggleSection('recommendations')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                🛠️ Recommendations ({analysisResult.recommendations.length})
              </h3>
            </div>
            {expandedSections.recommendations ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.recommendations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-3"
              >
                {analysisResult.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-warning-50 border border-warning-200 rounded-lg"
                  >
                    <p className="text-warning-800">{recommendation}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Detailed Analysis Section */}
        {analysisResult.detailedAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="card"
          >
            <button
              onClick={() => toggleSection('detailedAnalysis')}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  📊 Detailed Analysis
                </h3>
              </div>
              {expandedSections.detailedAnalysis ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.detailedAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-4"
                >
                  {Object.entries(analysisResult.detailedAnalysis).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <h4 className="font-medium text-gray-900 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-gray-700 text-sm">{value}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportPage; 