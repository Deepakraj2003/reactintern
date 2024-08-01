import React, { useState } from 'react';
import './App.css';  // Import the CSS file

import UploadResume from './UploadResume';
import ReadyCheck from './ReadyCheck';
import QuestionAnswer from './QuestionAnswer';
import FinalScore from './FinalScore';

function App() {
    const [resumeText, setResumeText] = useState('');
    const [stage, setStage] = useState('upload'); // Possible stages: 'upload', 'ready', 'question', 'result'
    const [score, setScore] = useState(0);

    return (
        <div className="app-container">
            {stage === 'upload' && <UploadResume setResumeText={setResumeText} setStage={setStage} />}
            {stage === 'ready' && <ReadyCheck onReady={() => setStage('question')} />}
            {stage === 'question' && <QuestionAnswer setStage={setStage} setScore={setScore} />}
            {stage === 'result' && <FinalScore />}
        </div>
    );
}

export default App;
