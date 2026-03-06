import React from 'react';

const CameraFeed = ({ cameraRunning, status }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-body">
      <h5 className="card-title">Live Camera Feed</h5>
      <div className="camera-placeholder rounded d-flex align-items-center justify-content-center text-white">
        {cameraRunning ? 'Camera Active / Detection Mode' : 'Camera Stopped'}
      </div>
      <p className="text-muted mt-3 mb-0">Status: {status}</p>
    </div>
  </div>
);

export default CameraFeed;
