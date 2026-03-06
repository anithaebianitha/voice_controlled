import React from 'react';

const DetectionTable = ({ detections, onDelete, onQuickUpdate }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body">
      <h5 className="card-title">Detection History</h5>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Object</th>
              <th>Confidence</th>
              <th>Location</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {detections.map((detection) => (
              <tr key={detection.id}>
                <td>{detection.object_name}</td>
                <td>{Math.round(detection.confidence * 100)}%</td>
                <td>{detection.location}</td>
                <td>{new Date(detection.timestamp).toLocaleString()}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onQuickUpdate(detection)}>Update</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(detection.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DetectionTable;
