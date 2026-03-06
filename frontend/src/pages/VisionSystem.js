import React, { useCallback, useEffect, useState } from 'react';
import CameraFeed from '../components/CameraFeed';
import VoiceControl from '../components/VoiceControl';
import ObjectList from '../components/ObjectList';
import { getDetections, getNavigationSuggestion, runDetection, startCamera, stopCamera } from '../services/api';

const VisionSystem = () => {
  const [status, setStatus] = useState('Idle');
  const [cameraRunning, setCameraRunning] = useState(false);
  const [detections, setDetections] = useState([]);

  const refreshDetections = useCallback(async () => {
    const { data } = await getDetections();
    setDetections(data.slice(0, 10));
  }, []);

  useEffect(() => {
    refreshDetections();
  }, [refreshDetections]);

  const handleStart = async () => {
    const { data } = await startCamera();
    setCameraRunning(true);
    setStatus(data.message);
  };

  const handleStop = async () => {
    const { data } = await stopCamera();
    setCameraRunning(false);
    setStatus(data.message);
  };

  const handleDetect = async () => {
    const { data } = await runDetection();
    if (data.length > 0) {
      setStatus(`Detected ${data.length} object(s)`);
    } else {
      setStatus('No target objects detected in this cycle.');
    }
    await refreshDetections();
  };

  const handleNavigate = async () => {
    const { data } = await getNavigationSuggestion();
    setStatus(`Navigation suggestion: ${data.direction}`);
  };

  const handleVoiceCommand = async (command) => {
    if (command.includes('start camera')) await handleStart();
    else if (command.includes('stop camera')) await handleStop();
    else if (command.includes('detect')) await handleDetect();
    else if (command.includes('navigate')) await handleNavigate();
  };

  return (
    <>
      <div className="row g-4">
        <div className="col-lg-6">
          <CameraFeed cameraRunning={cameraRunning} status={status} />
        </div>
        <div className="col-lg-6">
          <VoiceControl onCommand={handleVoiceCommand} />
        </div>
      </div>

      <div className="d-flex gap-2 my-4 flex-wrap">
        <button className="btn btn-success" onClick={handleStart}>Start Camera</button>
        <button className="btn btn-secondary" onClick={handleStop}>Stop Camera</button>
        <button className="btn btn-primary" onClick={handleDetect}>Detect Objects</button>
        <button className="btn btn-warning" onClick={handleNavigate}>Navigate</button>
      </div>

      <ObjectList detections={detections} />
    </>
  );
};

export default VisionSystem;
