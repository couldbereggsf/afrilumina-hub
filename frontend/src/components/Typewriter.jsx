import { useState, useEffect } from 'react';

const Typewriter = ({ words, delay = 2000 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const isLastChar = currentText === word;

    if (isDeleting) {
      // Deleting
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
      const timeout = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length - 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      // Typing
      if (isLastChar) {
        const timeout = setTimeout(() => setIsDeleting(true), delay);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentText, isDeleting, currentWordIndex, words, delay]);

  return (
    <span className="typewriter">
      {currentText}
      <span className="cursor-blink">|</span>
    </span>
  );
};

export default Typewriter;