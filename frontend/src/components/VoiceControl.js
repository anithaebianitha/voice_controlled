import React, { useEffect, useRef, useState } from 'react';

const VoiceControl = ({ onCommand }) => {
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('None');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      setLastCommand(transcript);
      onCommand(transcript);
    };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [onCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title">Voice Command Panel</h5>
        <p className="small text-muted">Try: "Start camera", "Stop camera", "Detect objects", "Navigate"</p>
        <button className={`btn ${listening ? 'btn-danger' : 'btn-primary'}`} onClick={toggleListening}>
          {listening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
        </button>
        <p className="mt-3 mb-0"><strong>Last command:</strong> {lastCommand}</p>
      </div>
    </div>
  );
};

export default VoiceControl;
