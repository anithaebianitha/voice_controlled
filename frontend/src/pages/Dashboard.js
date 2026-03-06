import React, { useEffect, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { getDetections } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await getDetections();
      setDetections(data);
    };
    load();
  }, []);

  const distribution = useMemo(() => {
    const map = {};
    detections.forEach((d) => {
      map[d.object_name] = (map[d.object_name] || 0) + 1;
    });
    return map;
  }, [detections]);

  const chartData = {
    labels: Object.keys(distribution),
    datasets: [
      {
        data: Object.values(distribution),
        backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#20c997'],
      },
    ],
  };

  return (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h5>Total Detections</h5>
            <p className="display-5 fw-bold">{detections.length}</p>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h5>Object Distribution</h5>
            {detections.length ? <Pie data={chartData} /> : <p className="text-muted">No data yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
