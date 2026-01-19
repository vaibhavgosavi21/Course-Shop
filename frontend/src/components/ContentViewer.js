import React from 'react';
import './ContentViewer.css';

const ContentViewer = ({ contentUrl, onClose }) => {
  const getFileType = (url) => {
    if (!url) return 'unknown';
    const ext = url.split('.').pop().toLowerCase();
    if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['zip', 'rar'].includes(ext)) return 'download';
    return 'unknown';
  };

  const fileType = getFileType(contentUrl);
  const fullUrl = `http://localhost:5001${contentUrl}`;

  return (
    <div className="content-viewer-overlay" onClick={onClose}>
      <div className="content-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <h3>Course Content</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="viewer-body">
          {fileType === 'video' && (
            <video controls autoPlay className="video-player">
              <source src={fullUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          
          {fileType === 'pdf' && (
            <iframe 
              src={fullUrl} 
              className="pdf-viewer"
              title="PDF Viewer"
            />
          )}
          
          {fileType === 'download' && (
            <div className="download-section">
              <div className="download-icon">📦</div>
              <h4>Downloadable Content</h4>
              <p>This file needs to be downloaded to view</p>
              <a href={fullUrl} download className="download-btn">
                Download File
              </a>
            </div>
          )}
          
          {fileType === 'unknown' && (
            <div className="download-section">
              <div className="download-icon">📄</div>
              <h4>View Content</h4>
              <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
                Open File
              </a>
            </div>
          )}
        </div>
        
        <div className="viewer-footer">
          <button className="footer-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;
