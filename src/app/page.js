'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from "react-markdown";
import PositionedMenu from '../components/menu';
import Footer from '../components/Footer';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [showLoading, setLoading] = useState(false);
  const [showAnswer, setAnswer] = useState(false);
  const [cards, setCards] = useState('');
  const [uginAnswer, setUginAnswer] = useState('');
  const [error, setError] = useState(null);

  const handleSubmission = async (userInput) => {
    if (!userInput.trim()) {
      setError('Please enter a question');
      return;
    }

    setError(null);
    setPrompt(userInput);
    setLoading(true);
    setAnswer(false);
    
    try {
      await handleChat(userInput);
    } catch (err) {
      setError(err.message || 'Failed to get response from Ugin');
      setLoading(false);
    }
  };

  const cleanOutput = () => {
    if (!cards) return [];
    return cards.split('\n').filter(line => line.trim());
  };

  const handleChat = async (userInput) => {
    const key = process.env.NEXT_PUBLIC_ASKUGIN_API_KEY;
    if (!key) {
      throw new Error('API key is not configured');
    }

    try {
      const trimmedInput = userInput.trim();
      if (!trimmedInput) {
        throw new Error('Question cannot be empty');
      }

      const url = new URL('/api/askugin', window.location.origin);
      url.searchParams.append('question', trimmedInput);
      
      console.log('Making request to:', url.toString());

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': key
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`);
      }

      if (!data.answer && !data.cards) {
        throw new Error('Invalid response format from server');
      }

      setUginAnswer(data.answer || '');
      setCards(data.cards || '');
      setLoading(false);
      setAnswer(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to get response from Ugin');
      setLoading(false);
      throw error;
    }
  };

  const resetState = () => {
    setPrompt('');
    setLoading(false);
    setAnswer(false);
    setCards('');
    setUginAnswer('');
    setError(null);
  };

  return (
    <div className="App">
      <PositionedMenu />
      <header className="App-header">
        <div className="background" />
        <div className="main-container">
          <div className="black-box">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {!showAnswer && !showLoading && (
              <div className="question-section">
                <h1>
                  You've yelled JUDGE!
                  Ugin Appears:
                  "Please state your question Planeswalker."
                </h1>
                <p>Please use brackets (e.g. [black lotus]) to pull card information.</p>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmission(prompt);
                  }}
                  className="question-form"
                >
                  <input 
                    type="text" 
                    placeholder="Enter Your Question Planeswalker!" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="App-input"
                  />
                  
                  <button 
                    type="submit"
                    className="App-button" 
                    disabled={showLoading}
                  >
                    {showLoading ? 'Asking Ugin...' : 'Submit'}
                  </button>
                </form>
              </div>
            )}

            {showLoading && (
              <div className="loading-spinner">
                <div className="loading-frame">
                  <Image 
                    src="/mtg_dots.png"
                    alt="Loading..." 
                    className="rotating-loader"
                    width={100}
                    height={100}
                    priority
                    unoptimized={false}
                  />
                </div>
                <p>Consulting with Ugin...</p>
              </div>
            )}

            {showAnswer && (
              <div className="answer-container">
                <div className="question-section">
                  <h2 className="answer-header">Your Question</h2>
                  <div className="searchResults">
                    <p>{prompt}</p>
                    <p className="disclaimer">Disclaimer: AI insights are not always correct but are actively improving!</p>
                  </div>
                </div>

                <div className="response-grid">
                  <div className="answer-section">
                    <h3 className="answer-header">Ugin's Response</h3>
                    <div className="searchResults">
                      <ReactMarkdown className="uginAnswer">
                        {uginAnswer.replace(/\\n/g, "\n")}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="answer-section">
                    <h3 className="answer-header">Card Information</h3>
                    <div className="cards-container">
                      {cleanOutput().map((element, i) => (
                        <div key={i} className="card-section">
                          {element}    
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  className="App-button" 
                  onClick={resetState}
                  style={{ marginTop: '1rem', alignSelf: 'center' }}>
                  Ask Another Question
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <Footer />
    </div>
  );
} 