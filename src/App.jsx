import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(0); //almacena la puntuacion del jugador
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const [colorScheme, setColorScheme] = useState('default');

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  useEffect(() => { // inicia el juego cuando se selecciona una dificultad
    if (difficulty) {
      resetGameState();
      startNewGame();
    }
  }, [difficulty]);

  useEffect(() => {  //efecto del patron para cambiar
    if (pattern.length > 0) {
      playPattern();
    }
  }, [pattern]);

  const startNewGame = () => {
    setIsPlayerTurn(false);
    generateNextStep();
  };

  const generateNextStep = () => {
    const colors = Object.keys(colorSchemes[colorScheme]);
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    setPattern((prevPattern) => [...prevPattern, nextColor]);
  };

  const playPattern = () => {
    setIsAnimating(true);
    setCurrentStep(0);

    pattern.forEach((color, index) => {
      setTimeout(() => {
        highlightColor(color);
        if (index === pattern.length - 1) {
          setTimeout(() => {
            setIsAnimating(false);
            setIsPlayerTurn(true);
          }, getSpeed());
        }
      }, index * getSpeed());
    });
  };

  const highlightColor = (color) => {
    const button = document.querySelector(`.button[data-color="${color}"]`);
    if (button) {
      button.classList.add('active');
      setTimeout(() => button.classList.remove('active'), getSpeed() - 200);
    }
  };

  const handleButtonClick = (color) => {
    if (!isPlayerTurn || isAnimating || gameOver) return;

    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    const currentIndex = newUserPattern.length - 1;
    if (color !== pattern[currentIndex]) {
      setGameOver(true);
      if (score > highScore) {
        localStorage.setItem('highScore', score);
        setHighScore(score);
      }
      return;
    }

    if (newUserPattern.length === pattern.length) {
      setScore(score + 1);
      setUserPattern([]);
      setIsPlayerTurn(false);
      setTimeout(generateNextStep, 1000);
    }
  };

  const resetGameState = () => {
    setPattern([]);
    setUserPattern([]);
    setScore(0);
    setIsAnimating(false);
    setGameOver(false);
  };

  const resetGame = () => {
    resetGameState();
    setDifficulty(null);
  };

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
  };
//opciones de colores para el juego
  const colorSchemes = {
    default: {
      rojo: '#ff4c4c',
      azul: '#4c6fff',
      verde: '#4cff4c',
      amarillo: '#fff64c',
    },
    scheme1: {
      rojo: '#e57373',
      azul: '#64b5f6',
      verde: '#81c784',
      amarillo: '#fff176',
    },
    scheme2: {
      rojo: '#d32f2f',
      azul: '#1976d2',
      verde: '#388e3c',
      amarillo: '#fbc02d',
    },
  };
//ajusta la velocidad del patron segun la dificultad
  const getSpeed = () => {
    switch (difficulty) {
      case 'easy':
        return 800;
      case 'hard':
        return 300;
      default:
        return 500;
    }
  };

  const colorStyles = colorSchemes[colorScheme];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Memoria Dinámica</h1>
        <p>Puntuación: {score}</p>
        <p>Puntuación Máxima: {highScore}</p>
      </header>
      <div className="button-grid">
        {Object.keys(colorStyles).map((color, index) => (
          <button
            key={index}
            className="button"
            data-color={color}
            style={{ backgroundColor: colorStyles[color] }}
            onClick={() => handleButtonClick(color)}
          />
        ))}
      </div>
      <div className="difficulty-selector">
        {gameOver || difficulty === null ? (
          <>
            <button onClick={() => startGame('easy')}>Fácil</button>
            <button onClick={() => startGame('normal')}>Normal</button>
            <button onClick={() => startGame('hard')}>Difícil</button>
          </>
        ) : null}
      </div>

      <div className="color-selector">
        <p>Esquema de colores:</p>
        <button onClick={() => setColorScheme('default')}>Default</button>
        <button onClick={() => setColorScheme('scheme1')}>Colores 1</button>
        <button onClick={() => setColorScheme('scheme2')}>Colores 2</button>
      </div>
      {gameOver && (
        <div className="game-over-message">
          <p>¡Game Over!</p>
          <button onClick={resetGame}>Reiniciar</button>
        </div>
      )}
    </div>
  );
}

export default App;
