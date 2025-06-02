import logo from './pictures/mtg_dots.png';
import './App.css';
import Footer from "./Footer"
import PositionedMenu from "./menu"
import { useState } from 'react';
import ReactMarkdown from "react-markdown";

function App() {
  const [prompt, setPrompt] = useState('');
  const [showText, setShowText] = useState(true);
  const [showLoading, setLoading] = useState(false);
  const [showAnswer, setAnswer] = useState(false);
  const [cards, setCards] = useState('');
  const [uginAnswer, setUginAnswer] = useState('');
  const [error, setError] = useState(null);

  const resetState = () => {
    setPrompt('');
    setShowText(true);
    setLoading(false);
    setAnswer(false);
    setCards('');
    setUginAnswer('');
    setError(null);
  };

  const handleSubmission = async (userInput) => {
    if (!userInput.trim()) {
      setError('Please enter a question');
      return;
    }

    setError(null);
    setPrompt(userInput);
    setShowText(false);
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

  async function handleChat(userInput) {
    const key = process.env.NEXT_PUBLIC_ASKUGIN_API_KEY;
    if (!key) {
      setError('API key is not configured');
      setLoading(false);
      return;
    }

    try {
      const url = new URL('/api/askugin', window.location.origin);
      url.searchParams.append('question', userInput);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': key
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
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
    }
  }

  return (
    <div className="App">
      <PositionedMenu />
      <header className="App-header background">
        <div className="main-container">
          <div className="content-grid">
            <div className="black-box texture-color">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {showText && !showAnswer && !showLoading && (
                <div className="question-section">
                  <h1>
                    You&apos;ve yelled JUDGE!
                    Ugin Appears:
                    &quot;Please state your question Planeswalker.&quot;
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
                    <img 
                      src={logo}
                      alt="Loading..." 
                      className="rotating-loader" 
                    />
                  </div>
                  <p>Consulting with Ugin...</p>
                </div>
              )}

              {showAnswer && (
                <div className="answer-grid">
                  <div className="question-display">
                    <p>{prompt}</p>
                    <p className="disclaimer">Disclaimer: AI insights are not always correct but are actively improving!</p>
                  </div>
                  
                  <div className="answer-section">
                    <div className="searchResults">
                      <p>Ugin&apos;s States: </p>
                      <ReactMarkdown className="uginAnswer">
                        {uginAnswer.replace(/\\n/g, "\n")}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  <div className="cards-section">
                    <div className="scroll">
                      {cleanOutput().map((element, i) => (
                        <div key={i} className="searchResults">
                          {element}    
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    className="App-button" 
                    onClick={resetState}
                    style={{ gridColumn: '1 / -1', justifySelf: 'center' }}
                  >
                    Ask Another Question
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <Footer />
    </div>
  );
}

export default App;
