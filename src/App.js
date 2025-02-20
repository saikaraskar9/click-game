import React, { useState, useEffect } from 'react';

function ClickGame() {
  const [clicks, setClicks] = useState(0); 
  const [isGameActive, setIsGameActive] = useState(false); 
  const [timeRemaining, setTimeRemaining] = useState(10); 
  const [scoreHistory, setScoreHistory] = useState([]); 
  const [showCurrentScoreInHistory, setShowCurrentScoreInHistory] = useState(false); 

  
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(); 
  };

  
  useEffect(() => {
    const storedHistory = localStorage.getItem('scoreHistory');
    if (storedHistory) {
      setScoreHistory(JSON.parse(storedHistory));
    }
  }, []);

  
  useEffect(() => {
    if (scoreHistory.length > 0) {
      localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    }
  }, [scoreHistory]);

  // Start the game
  const startGame = () => {
    setIsGameActive(true); 
    setClicks(0); 
    setTimeRemaining(10); 
    setShowCurrentScoreInHistory(false); 

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); 
          endGame(); 
          return 0;
        }
        return prevTime - 1; 
      });
    }, 1000);
  };

  // End the game
  const endGame = () => {
    setIsGameActive(false); 

    // Create a new entry for the score history
    const newEntry = { score: clicks, date: getCurrentDateTime() };

    
    setScoreHistory((prevHistory) => [...prevHistory, newEntry]);
    setShowCurrentScoreInHistory(true); 
  };

  
  const handleClick = () => {
    if (isGameActive) {
      setClicks((prevClicks) => prevClicks + 1); 
    }
  };

  // Clear the score history
  const clearHistory = () => {
    setScoreHistory([]); 
    localStorage.removeItem('scoreHistory'); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600">Click Game</h1>
        <p className="text-gray-700 mb-4">Click as many times as you can in 10 seconds!</p>

        {isGameActive ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Time Remaining: {timeRemaining} seconds
            </h2>
            <h2 className="text-lg text-gray-600 mb-4">Clicks: {clicks}</h2>
            <button
              onClick={handleClick}
              className="shadow-lg shadow-cyan-500/50 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transform active:translate-x-[2px] active:translate-y-[2px] h-24 w-24 shad"
            >
              Click Me!
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Time Remaining: 10 seconds
            </h2>
            <h2 className="text-lg text-gray-600 mb-4">Your Final Score: {clicks} clicks</h2>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-lime-950  text-white font-bold py-2 px-4 rounded "
            >
              Start Game
            </button>
          </div>
        )}

          {scoreHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Clear History
            </button>
          )}
        </div>
        <div className=" absolute right-0 bg-amber-500 rounded-md p-8">
          <h3 className="text-lg font-bold text-indigo-600">Score History:</h3>
          <ul className="text-left mt-2 space-y-1">
            {scoreHistory.map((entry, index) => (
              <li key={index} className="text-gray-700">
                <span className="font-medium">Game {index + 1}:</span> {entry.score} clicks
                <span className="text-sm text-gray-500"> (Recorded on {entry.date})</span>
              </li>
            ))}
            
            {showCurrentScoreInHistory && (
              <li className="text-gray-700">
                <span className="font-medium">Current Game:</span> {clicks} clicks
              </li>
            )}
          </ul>
      </div>
    </div>
  );
}

export default ClickGame;
