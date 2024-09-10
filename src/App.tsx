import React, { useEffect, useState } from 'react';
import './App.css';
import GameComponent from './game-component/game-component';
import {
  PlayIcon1,
  PlayIcon2,
  PlayIcon3,
} from './assets/const/play-icon-paths';
import { animated, useSpring } from 'react-spring';
import { blobPlay1 } from './assets/const/blobs-paths';
import Cloud1 from './icons-components/cloud1';
import Cloud2 from './icons-components/cloud2';
import Cloud3 from './icons-components/cloud3';
import Cloud4 from './icons-components/cloud4';
import Cloud5 from './icons-components/cloud5';
import { ClickAwayListener } from '@mui/material';
import LangPort from './icons-components/language-port';
import LangEng from './icons-components/language-eng';
import { languageComponents } from './assets/const/language-info';

function App() {
  let [isGameStarted, setGameStarted] = useState(false);
  let [languageChoose, setLanguageChoose] = useState(false);
  let selectedLanguage = localStorage.getItem('selectedLanguage');
  let [selectedLang, setSelectedLang] = useState<
    keyof typeof languageComponents
  >(getLanguage(selectedLanguage));

  const [activeBlob, setActiveBlob] = useState(0);
  const animationBlobsProps = useSpring({
    blobPlay1Path: activeBlob === 1 ? blobPlay1[1] : blobPlay1[0],
    blobPlay2Path: activeBlob === 1 ? blobPlay1[3] : blobPlay1[2],
    blobPlay3Path: activeBlob === 2 ? blobPlay1[5] : blobPlay1[4],
    blobPlay4Path: activeBlob === 2 ? blobPlay1[7] : blobPlay1[6],
    blobPlay5Path: activeBlob === 3 ? blobPlay1[9] : blobPlay1[8],
    blobPlay6Path: activeBlob === 3 ? blobPlay1[11] : blobPlay1[10],
    blobPlay7Path: activeBlob === 4 ? blobPlay1[13] : blobPlay1[12],
    blobPlay8Path: activeBlob === 4 ? blobPlay1[15] : blobPlay1[14],
    blobPlay9Path: activeBlob === 5 ? blobPlay1[17] : blobPlay1[16],
    blobPlay10Path: activeBlob === 5 ? blobPlay1[19] : blobPlay1[18],
  });

  const [playIconAppear, setPlayIconAppear] = useState(false);
  const springIconAppear = useSpring({
    transform: playIconAppear ? 'scale(1) ' : 'scale(0)',
    config: {
      tension: 500,
      friction: 16,
    },
  });

  const [playIconAppear1, setPlayIconAppear1] = useState(false);
  const springIconAppear1 = useSpring({
    transform: playIconAppear1 ? 'scale(1) ' : 'scale(0)',
    config: {
      tension: 500,
      friction: 9,
    },
  });

  const [playIcon3Appear, setPlayIcon3Appear] = useState(false);
  const springIcon3Appear = useSpring({
    transform: playIcon3Appear ? 'scale(1) ' : 'scale(0)',
    config: {
      tension: 500,
      friction: 6,
    },
  });

  useEffect(() => {
    setTimeout(() => setPlayIconAppear(!isGameStarted), 200);
    setTimeout(() => setPlayIconAppear1(!isGameStarted), 100);
    setTimeout(() => setPlayIcon3Appear(!isGameStarted), 0);
  }, [isGameStarted]);

  const LanguageIcon = languageComponents[selectedLang];

  return (
    <div>
      {!isGameStarted && (
        <header className="home-page">
          <div className="play-icon" onClick={() => setGameStarted(true)}>
            <Cloud1 />
            <Cloud2 />
            <Cloud3 />
            <Cloud4 />
            <Cloud5 />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="550"
              height="450"
              viewBox="0 0 853 700"
              fill="none"
              className="play-icon-part-1">
              <animated.g
                key="1"
                style={{
                  transformOrigin: 'center',
                  transformBox: 'fill-box',
                  ...springIconAppear,
                }}>
                <PlayIcon1 />
              </animated.g>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="160"
              viewBox="0 0 300 300"
              fill="none"
              className="play-icon-part-2">
              <animated.g
                key="1"
                style={{
                  transformOrigin: 'center',
                  transformBox: 'fill-box',
                  ...springIconAppear1,
                }}>
                <PlayIcon2 />
              </animated.g>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 200 200"
              fill="none"
              className="play-icon-part-3">
              <animated.g
                key="1"
                style={{
                  transformOrigin: 'center',
                  transformBox: 'fill-box',
                  ...springIcon3Appear,
                }}>
                <PlayIcon3 />
              </animated.g>
            </svg>
          </div>
          <ClickAwayListener onClickAway={() => setLanguageChoose(false)}>
            <div>
              <button
                className="home-language-btn"
                onClick={() => setLanguageChoose(!languageChoose)}>
                <LanguageIcon />
                LANGUAGE
              </button>
              {languageChoose && (
                <div className="home-language-btn-menu">
                  <button
                    onClick={() => {
                      setSelectedLang('eng');
                      localStorage.setItem('selectedLanguage', 'eng');
                      setLanguageChoose(!languageChoose);
                    }}
                    className={
                      selectedLang === 'eng'
                        ? 'home-language-btn eng selected'
                        : 'home-language-btn eng '
                    }>
                    <LangEng /> ENGLISH
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLang('port');
                      localStorage.setItem('selectedLanguage', 'port');
                      setLanguageChoose(!languageChoose);
                    }}
                    className={
                      selectedLang === 'port'
                        ? 'home-language-btn port selected'
                        : 'home-language-btn port '
                    }>
                    <LangPort />
                    PORTUGUESE
                  </button>
                </div>
              )}
            </div>
          </ClickAwayListener>

          <svg
            className="home-page-blob-1"
            viewBox="0 0 600 750"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => {
              setActiveBlob(1);
            }}
            onMouseLeave={() => setActiveBlob(0)}>
            <animated.path
              d={animationBlobsProps.blobPlay1Path}
              fill="#9180AD"
            />
            <animated.path
              d={animationBlobsProps.blobPlay2Path}
              fill="#817398"
            />
          </svg>
          <svg
            className="home-page-blob-2"
            viewBox="0 0 600 350"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => {
              setActiveBlob(2);
            }}
            onMouseLeave={() => setActiveBlob(0)}>
            <animated.path
              d={animationBlobsProps.blobPlay3Path}
              fill="#9DB458"
            />
            <animated.path
              d={animationBlobsProps.blobPlay4Path}
              fill="#8BA148"
            />
          </svg>
          <svg
            className="home-page-blob-3"
            viewBox="0 0 650 270"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => {
              setActiveBlob(3);
            }}
            onMouseLeave={() => setActiveBlob(0)}>
            <animated.path
              d={animationBlobsProps.blobPlay5Path}
              fill="#FDE7E7"
            />
            <animated.path
              d={animationBlobsProps.blobPlay6Path}
              fill="#E7CECE"
            />
          </svg>
          <svg
            className="home-page-blob-4"
            viewBox="0 0 650 270"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => {
              setActiveBlob(4);
            }}
            onMouseLeave={() => setActiveBlob(0)}>
            <animated.path
              d={animationBlobsProps.blobPlay7Path}
              fill="#D67175"
            />
            <animated.path
              d={animationBlobsProps.blobPlay8Path}
              fill="#BE6164"
            />
          </svg>
          <svg
            className="home-page-blob-5"
            viewBox="0 0 850 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => {
              setActiveBlob(5);
            }}
            onMouseLeave={() => setActiveBlob(0)}>
            <animated.path
              d={animationBlobsProps.blobPlay9Path}
              fill="#DCCE7A"
            />
            <animated.path
              d={animationBlobsProps.blobPlay10Path}
              fill="#D7C37B"
            />
          </svg>
        </header>
      )}
      {isGameStarted && (
        <GameComponent
          setGameStarted={setGameStarted}
          selectedLang={selectedLang}
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
