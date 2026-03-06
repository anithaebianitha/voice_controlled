import React from 'react';

const ObjectList = ({ detections }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-body">
      <h5 className="card-title">Detected Objects</h5>
      {detections.length === 0 ? (
        <p className="text-muted">No objects detected yet.</p>
      ) : (
        <ul className="list-group list-group-flush">
          {detections.map((item) => (
            <li key={item.id} className="list-group-item px-0 d-flex justify-content-between">
              <span>{item.object_name} ({Math.round(item.confidence * 100)}%)</span>
              <span className="badge bg-secondary">{item.location}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default ObjectList;
