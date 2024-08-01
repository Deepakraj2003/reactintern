import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionAnswer = ({ setStage, setScore }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recognizing, setRecognizing] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/get_question');
      setQuestion(response.data.question);
    } catch (error) {
      setError('Error fetching question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) {
      setError('Answer cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/submit_answer', { question, answer });
      fetchQuestion();
      setAnswer('');
    } catch (error) {
      setError('Error submitting answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/calculate_score');
      setScore(response.data.score);
      setStage('result');
    } catch (error) {
      setError('Error calculating score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize speech recognition
  const startSpeechRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setRecognizing(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
      setRecognizing(false);
    };

    recognition.onerror = (event) => {
      setError('Error recognizing speech. Please try again.');
      setRecognizing(false);
    };

    recognition.onend = () => {
      setRecognizing(false);
    };

    recognition.start();
  };

  return (
    <div className="question-answer">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <p>{question}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer or use speech-to-text"
      />
      <button onClick={handleAnswerSubmit} disabled={loading}>Submit Answer</button>
      <button onClick={handleFinish} disabled={loading}>Finish Test</button>
      <button onClick={startSpeechRecognition} disabled={recognizing}>
        {recognizing ? 'Listening...' : 'Use Speech-to-Text'}
      </button>
    </div>
  );
};

export default QuestionAnswer;
