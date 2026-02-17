import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, User, Mail, Calendar, FileText, Briefcase, CheckCircle } from 'lucide-react';
import { viewResumeDetails, downloadResume } from '../services/api';

const ResumeViewerModal = ({ resumeId, isOpen, onClose, applicantName }) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadResumeDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await viewResumeDetails(resumeId);
      setResume(data);
    } catch (error) {
      console.error('Error loading resume:', error);
      alert('Failed to load resume details');
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    if (isOpen && resumeId) {
      loadResumeDetails();
    }
  }, [isOpen, resumeId, loadResumeDetails]);

  const handleDownload = async () => {
    try {
      await downloadResume(resumeId, resume.filename);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="h-6 w-6 text-red-400" />
                Resume Details
              </h2>
              <p className="text-gray-400 mt-1">{applicantName}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={!resume}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-gray-800 rounded-full"></div>
                <div className="absolute top-0 left-0 h-16 w-16 border-4 border-t-transparent border-red-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : resume ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="card glow-effect">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-red-400" />
                  Candidate Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <User className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Name</p>
                      <p className="text-white font-semibold">{resume.user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Mail className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-semibold">{resume.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Resume File</p>
                      <p className="text-white font-semibold truncate">{resume.filename}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Uploaded</p>
                      <p className="text-white font-semibold">
                        {new Date(resume.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="card glow-effect">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-red-400" />
                  Skills ({resume.skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-red-900/40 to-pink-900/40 text-red-300 rounded-lg text-sm font-medium border border-red-800/30 hover:scale-105 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              {resume.keywords && resume.keywords.length > 0 && (
                <div className="card glow-effect">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-400" />
                    Keywords ({resume.keywords.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-lg text-sm border border-gray-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Text Preview */}
              <div className="card glow-effect">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-400" />
                  Resume Content Preview
                </h3>
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                    {resume.raw_text}
                  </pre>
                  {resume.raw_text.endsWith('...') && (
                    <p className="text-gray-500 text-xs mt-2 italic">
                      Download full resume to see complete content
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No resume data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeViewerModal;