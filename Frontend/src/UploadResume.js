import React, { useState } from 'react';

const UploadResume = ({ setResumeText, setStage }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/upload_resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResumeText(data.resume_text_data);
      setStage('ready');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="upload-resume">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Resume</button>
    </div>
  );
};

export default UploadResume;
