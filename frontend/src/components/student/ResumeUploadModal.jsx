import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { resumeService } from '../../services/resumeService';

export const ResumeUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return false;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Please upload a PDF document (.pdf). Other formats are not supported.');
      return false;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller PDF.');
      return false;
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const chosen = e.target.files[0];
      if (validateFile(chosen)) {
        setFile(chosen);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading PDF document...');

    try {
      // Simulate real-time progress stages
      setTimeout(() => setUploadStatus('Extracting text and structure...'), 600);
      setTimeout(() => setUploadStatus('Running AI skill gap and TF-IDF analysis...'), 1200);

      const result = await resumeService.uploadResume(file);

      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('');
        setFile(null);
        if (onUploadSuccess) onUploadSuccess(result);
        onClose();
      }, 1800);
    } catch (err) {
      setIsUploading(false);
      setError(err.response?.data?.detail || 'Failed to upload and analyze resume.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Resume PDF">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-blue-400 bg-blue-500/10'
              : file
              ? 'border-emerald-500/70 bg-[#0c2229]/40'
              : 'border-[#22396b] bg-[#0c1730] hover:border-blue-500/60 hover:bg-[#0f1f42]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
          />

          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-white font-medium text-sm truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
              </p>
              <span className="mt-3 text-xs text-blue-400 underline">Click to choose another</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#15254d] text-blue-400 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                Drag and drop your PDF here, or <span className="text-blue-400">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF up to 10MB</p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live status during upload */}
        {isUploading && (
          <div className="flex items-center gap-2.5 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-xs sm:text-sm animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-[#142347] hover:bg-[#1a2d59] rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!file || isUploading}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Upload & Analyze</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ResumeUploadModal;
