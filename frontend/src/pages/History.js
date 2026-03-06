import React, { useEffect, useState } from 'react';
import DetectionTable from '../components/DetectionTable';
import { deleteDetection, getDetections, updateDetection } from '../services/api';

const History = () => {
  const [detections, setDetections] = useState([]);

  const loadDetections = async () => {
    const { data } = await getDetections();
    setDetections(data);
  };

  useEffect(() => {
    loadDetections();
  }, []);

  const handleDelete = async (id) => {
    await deleteDetection(id);
    await loadDetections();
  };

  const handleQuickUpdate = async (detection) => {
    const newLocation = detection.location === 'front' ? 'left' : 'front';
    await updateDetection(detection.id, { location: newLocation });
    await loadDetections();
  };

  return <DetectionTable detections={detections} onDelete={handleDelete} onQuickUpdate={handleQuickUpdate} />;
};

export default History;
