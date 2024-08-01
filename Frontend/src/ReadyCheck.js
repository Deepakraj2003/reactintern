import React from 'react';

const ReadyCheck = ({ onReady }) => {
  return (
    <div className="ready-check">
      <p>Are you ready to take the test?</p>
      <button onClick={onReady}>Yes</button>
    </div>
  );
};

export default ReadyCheck;
