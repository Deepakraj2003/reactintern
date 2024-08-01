import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FinalScore = () => {
  const [score, setScore] = useState(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreAndQA = async () => {
      try {
        // Fetch the score
        const scoreResponse = await axios.get('http://localhost:5000/calculate_score');
        setScore(scoreResponse.data.score);

        // Fetch the questions and answers
        const qaResponse = await axios.get('http://localhost:5000/get_questions_and_answers');
        setQuestionsAndAnswers(qaResponse.data.questions_and_answers);
      } catch (error) {
        setError('Failed to fetch the score or questions and answers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchScoreAndQA();
  }, []);

  if (loading) {
    return <div className="final-score">Loading...</div>;
  }

  if (error) {
    return <div className="final-score">{error}</div>;
  }

  return (
    <div className="final-score">
      <h1>Test Results</h1>
      <p>Your score is: {score}</p>
      <h2>Questions and Answers</h2>
      {questionsAndAnswers.length === 0 ? (
        <p>No questions and answers available.</p>
      ) : (
        <ul>
          {questionsAndAnswers.map((qa, index) => (
            <li key={index}>
              <strong>Question:</strong> {qa.question} <br />
              <strong>Answer:</strong> {qa.answer}
            </li>
          ))}
        </ul>
      )}
      <p>Thank you for taking the test!</p>
    </div>
  );
};

export default FinalScore;
