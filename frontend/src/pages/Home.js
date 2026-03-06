import React from 'react';

const Home = () => (
  <div className="card border-0 shadow-sm">
    <div className="card-body p-4">
      <h1 className="display-6 fw-bold">Voice-Controlled Real-Time Smart Vision System</h1>
      <p className="lead mt-3">
        This project combines AI vision, speech interaction, and navigation guidance for accessible object detection.
      </p>
      <ul>
        <li>YOLOv8-based object detection</li>
        <li>Voice command-based interaction</li>
        <li>Audio feedback using text-to-speech</li>
        <li>MongoDB-backed detection history</li>
      </ul>
    </div>
  </div>
);

export default Home;
