import React, { FC, useState, useEffect } from 'react';
import "./HiddenStyles.css"; // Assuming this file contains the hidden class
import AutoScrollingDiv from './AutoScrollingDiv';

interface GameTitleProps {}

export const GameTitle: FC<GameTitleProps> = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const gameTitleSpan = document.getElementById('gameTitleSpan');
    const gameAuthorSpan = document.getElementById('gameAuthorSpan');

    const checkContent = () => {
      if (gameTitleSpan && gameAuthorSpan) {
        const gameTitle = gameTitleSpan.innerText;
        const gameAuthor = gameAuthorSpan.innerText;
        setIsVisible(!!gameTitle && !!gameAuthor);
      }
    };

    const observer = new MutationObserver(checkContent);

    if (gameTitleSpan) observer.observe(gameTitleSpan, { childList: true, subtree: true });
    if (gameAuthorSpan) observer.observe(gameAuthorSpan, { childList: true, subtree: true });

    checkContent(); // Initial check

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
      <AutoScrollingDiv hidden={isVisible!}>
        <span id='gameTitleSpan'></span> by <span id='gameAuthorSpan'></span>
      </AutoScrollingDiv>
  );
};

export default GameTitle;
