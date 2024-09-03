import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const movies = [
  { title: "JAWS", plot: "A giant man-eating shark terrorizes a beach town." },
  { title: "ALIEN", plot: "A deadly creature stalks the crew of a spaceship." },
  { title: "ROCKY", plot: "An underdog boxer gets a shot at the heavyweight title." },
  { title: "INCEPTION", plot: "A thief enters people's dreams to plant ideas." },
  { title: "TITANIC", plot: "A love story unfolds during a doomed maiden voyage." },
  // Add more movies here
];

const HowToPlay = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">How to Play</h2>
    <ol className="list-decimal list-inside space-y-2">
      <li>You'll see a grid representing a movie title and its plot below.</li>
      <li>Try to guess the movie title based on the plot and visible letters.</li>
      <li>You have 3 hints available. Each hint reveals a random letter in the grid.</li>
      <li>Type your guess in the input field and click "Guess" to submit.</li>
      <li>Scoring:
        <ul className="list-disc list-inside ml-4">
          <li>Correct guess without hints: 10 points</li>
          <li>Correct guess with 1 hint: 8 points</li>
          <li>Correct guess with 2 hints: 6 points</li>
          <li>Correct guess with 3 hints: 4 points</li>
          <li>Incorrect guess: 0 points</li>
        </ul>
      </li>
      <li>If you guess correctly, you can move to the next movie.</li>
      <li>If you guess incorrectly, the game ends and you can play again.</li>
      <li>Try to get the highest score possible!</li>
    </ol>
  </div>
);

const CineScramble = () => {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [grid, setGrid] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [guess, setGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('game');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    setCurrentMovie(randomMovie);
    setGrid(createGrid(randomMovie.title));
    setHintsUsed(0);
    setGuess('');
    setGameOver(false);
    setMessage('');
    setActiveTab('game');
    setScore(0);
    setShowAnswer(false);
  };

  const nextMovie = () => {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    setCurrentMovie(randomMovie);
    setGrid(createGrid(randomMovie.title));
    setHintsUsed(0);
    setGuess('');
    setGameOver(false);
    setMessage('');
    setShowAnswer(false);
  };

  const createGrid = (title) => {
    const cleanTitle = title.replace(/\s/g, '');
    const side = Math.ceil(Math.sqrt(cleanTitle.length));
    let flatGrid = cleanTitle.padEnd(side * side, ' ').split('').map(char => char.toLowerCase());
    return Array(side).fill().map(() => flatGrid.splice(0, side));
  };

  const revealHint = () => {
    if (hintsUsed >= 3 || gameOver) return;

    let newGrid = [...grid];
    let hiddenIndices = [];

    newGrid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== ' ' && cell === cell.toLowerCase()) {
          hiddenIndices.push([i, j]);
        }
      });
    });

    if (hiddenIndices.length > 0) {
      const [i, j] = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      newGrid[i][j] = newGrid[i][j].toUpperCase();
      setGrid(newGrid);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const handleGuess = () => {
    if (guess.toUpperCase() === currentMovie.title.replace(/\s/g, '')) {
      const pointsEarned = [10, 8, 6, 4][hintsUsed];
      setScore(score + pointsEarned);
      setMessage(`Correct! You earned ${pointsEarned} points. Your total score is ${score + pointsEarned}.`);
      setShowAnswer(true);
    } else {
      setMessage(`Incorrect. The correct title was "${currentMovie.title}". Your final score is ${score}.`);
      setGameOver(true);
      setShowAnswer(true);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cine Scramble</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="howto">How to Play</TabsTrigger>
        </TabsList>
        <TabsContent value="game">
          <div className="mb-4">
            <h2 className="font-bold">Score: {score}</h2>
          </div>
          <div className={`grid gap-2 mb-4 ${grid.length ? `grid-cols-${grid.length}` : ''}`}>
            {showAnswer
              ? currentMovie.title.replace(/\s/g, '').split('').map((char, index) => (
                  <div key={index} className="w-12 h-12 border flex items-center justify-center font-bold bg-green-100">
                    {char}
                  </div>
                ))
              : grid.map((row, i) => (
                  row.map((cell, j) => (
                    <div key={`${i}-${j}`} className="w-12 h-12 border flex items-center justify-center font-bold">
                      {cell === cell.toUpperCase() ? cell : ''}
                    </div>
                  ))
                ))}
          </div>
          <div className="mb-4">
            <h2 className="font-bold">Plot:</h2>
            <p>{currentMovie?.plot}</p>
          </div>
          <div className="mb-4">
            <Input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
              disabled={gameOver || showAnswer}
              className="mb-2"
            />
            <Button onClick={handleGuess} disabled={gameOver || showAnswer} className="mr-2">
              Guess
            </Button>
            <Button onClick={revealHint} disabled={hintsUsed >= 3 || gameOver || showAnswer}>
              Hint ({3 - hintsUsed} left)
            </Button>
          </div>
          {message && (
            <Alert className="mb-4">
              <AlertTitle>Result</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {showAnswer && !gameOver && (
            <Button onClick={nextMovie} className="mt-4">Next Movie</Button>
          )}
          {gameOver && (
            <Button onClick={startNewGame} className="mt-4">Play Again</Button>
          )}
        </TabsContent>
        <TabsContent value="howto">
          <HowToPlay />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CineScramble;
