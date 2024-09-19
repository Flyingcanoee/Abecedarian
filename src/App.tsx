import React, { useState } from 'react';
import GameComponent from './components/game-component/game-component';
import { languageComponents } from './const/language-info';
import HomeComponent from './components/home-component/home-component';

function App() {
  let [isGameStarted, setGameStarted] = useState(false);
  let selectedLanguageFromStorage = localStorage.getItem('selectedLanguage');
  let [selectedLanguage, setSelectedLang] = useState<
    keyof typeof languageComponents
  >(getLanguage(selectedLanguageFromStorage));

  return (
    <div>
      {!isGameStarted && (
        <HomeComponent
          selectedLanguage={selectedLanguage}
          setSelectedLang={setSelectedLang}
          setGameStarted={setGameStarted}
        />
      )}
      {isGameStarted && (
        <GameComponent
          setGameStarted={setGameStarted}
          selectedLang={selectedLanguage}
        />
      )}
    </div>
  );
}

function getLanguage(selectedLanguage: string | null) {
  return selectedLanguage === 'eng' || selectedLanguage === 'port'
    ? selectedLanguage
    : 'eng';
}
export default App;
