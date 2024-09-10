import { useEffect, useRef, useState } from 'react';
import './game-component.scss';
import { images } from '../assets/words-array';
import { wordsSoundsEng, wordsSoundsPort } from '../assets/words-pronunciation';
import { animated, useSpring } from 'react-spring';

import wrongAnswerSound from '../assets/sounds/wrongAnswer.mp3';
import rightAnswerSound from '../assets/sounds/rightAnswer.mp3';
import {
  blob1Paths,
  blob2Paths,
  blob3Paths,
  blob4Paths,
  colors,
} from '../assets/const/blobs-paths';
import home from '../assets/menu-icons/home.png';
import ThumbIcon from '../icons-components/thumb-icon';
import RepeatIcon from '../assets/menu-icons/repeat-icon';
import MixIcon from '../assets/menu-icons/mix-icon';
import {
  langTranslations,
  languageComponents,
  languageLabels,
} from '../assets/const/language-info';

let currentFourWords: string[] = [];

interface Props {
  setGameStarted: (v: boolean) => void;
  selectedLang: keyof typeof languageComponents;
}

export default function GameComponent({ setGameStarted, selectedLang }: Props) {
  const wordsArray = Object.keys(images).map((key) => {
    return {
      imgUrl: images[key],
      label: key.replace('.png', '').replace('-', ' ').toUpperCase(), //probably it s better to form portugal word here
      isUsed: false,
      sound: getPronunciation(key),
    };
  });

  const LanguageIcon = languageComponents[selectedLang];

  const wordsArr = useRef(wordsArray);
  let [wordsCounter, setWordsCounter] = useState(0);
  let [trainingLearned, setTrainingLearned] = useState(false);

  let [indexes, setIndexes] = useState(() => [
    getRandomIdx(),
    getRandomIdx(),
    getRandomIdx(),
    getRandomIdx(),
  ]);

  let [colorsRandom, setColorsRandom] = useState<string[]>(getRandomColors());

  useEffect(() => {
    setWord(getWord());
    setToggleIconsAppear(true);
  }, [indexes]);

  let [word, setWord] = useState('');

  const [activeIndex, setActiveIndex] = useState(0);
  const animationProps = useSpring({
    blob1Path: blob1Paths[activeIndex],
    blob2Path: blob2Paths[activeIndex],
    blob3Path: blob3Paths[activeIndex],
    blob4Path: blob4Paths[activeIndex],
    config: {
      tension: 400,
      friction: 20,
    },
  });

  const [toggleThumbIcon, setToggleThumbIcon] = useState(false);
  const [rightAnswerIcon, setRightAnswerIcon] = useState(true);
  const springAnswer = useSpring({
    transform: toggleThumbIcon
      ? rightAnswerIcon
        ? 'rotate(0deg) scale(1)'
        : 'rotate(180deg) scale(1)'
      : 'rotate(360deg) scale(0)',
    config: { friction: 16 },
  });

  const [toggleIconsAppear, setToggleIconsAppear] = useState(false);
  const springIconsAppear = useSpring({
    transform: toggleIconsAppear ? 'scale(1)' : 'scale(0)',
    config: {
      tension: 500,
      friction: 20,
    },
  });

  return (
    <div className="game-component">
      <button onClick={() => setGameStarted(false)} className="home-btn">
        <img alt="home" src={home} />
      </button>
      <div className="word-container">
        <h1 className="word">
          {selectedLang === 'eng' ? word : getTranslation(selectedLang, word)}
        </h1>
      </div>
      <div className="counter">{wordsCounter}</div>

      <button className="right-panel-btn language-btn">
        <div className="overflowed-content">
          <LanguageIcon />
          <span className="right-panel-words-text">
            {languageLabels[selectedLang]}
          </span>
        </div>
      </button>

      <button
        disabled={wordsCounter < 4}
        className={
          ' right-panel-btn repeating-mode-btn ' +
          (trainingLearned ? 'active' : '')
        }
        onClick={() => {
          setTrainingLearned(true);
          setNewIndexes();
        }}>
        <div className="overflowed-content">
          <RepeatIcon color={wordsCounter < 4 ? '#adb0b7' : '#282c34'} />
          <span className="right-panel-words-text">REPEAT LEARNED WORDS</span>
        </div>

        {wordsCounter < 4 && (
          <div className="repeating-mode-tooltip">
            <span>You need to learn at least 4 words</span>
          </div>
        )}
      </button>

      <button
        className={
          'right-panel-btn mix-words-btn ' + (!trainingLearned ? 'active' : '')
        }
        onClick={() => {
          setTrainingLearned(false);
          setNewIndexes();
        }}>
        <div className="overflowed-content">
          <MixIcon color="#282c34" />
          <span className="right-panel-words-text">LEARN WORDS</span>
        </div>
      </button>
      <svg
        className="wrong-answer"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 700 800"
        fill="none">
        <animated.g
          key="1"
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            ...springAnswer,
          }}>
          <ThumbIcon />
        </animated.g>
      </svg>

      <div className="pictures">
        <svg
          className="blob-svg"
          viewBox="0 0 2000 950"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <animated.path
            onMouseEnter={() => {
              setActiveIndex(1);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className="blob1"
            d={animationProps.blob1Path}
            fill={colorsRandom[0]}
            transform="translate(10 10)"
          />

          <animated.path
            onMouseEnter={() => {
              setActiveIndex(4);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className="blob2"
            d={animationProps.blob2Path}
            fill={colorsRandom[1]}
            transform-origin="100% 100%"
          />

          <animated.path
            onMouseEnter={() => {
              setActiveIndex(2);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className="blob3"
            d={animationProps.blob3Path}
            fill={colorsRandom[2]}
            transform-origin="100% 100%"
          />

          <animated.path
            onMouseEnter={() => {
              setActiveIndex(3);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className="blob4"
            d={animationProps.blob4Path}
            fill={colorsRandom[3]}
            transform-origin="100% 100%"
          />
        </svg>
        <animated.div
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            ...springIconsAppear,
          }}
          className="wordImage"
          onClick={() => chooseImage(indexes[0])}>
          <img
            onMouseEnter={() => {
              setActiveIndex(1);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className="wordImageImg"
            src={wordsArr.current[indexes[0]].imgUrl}></img>
        </animated.div>

        <animated.div
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            ...springIconsAppear,
          }}
          className="wordImage"
          onClick={() => chooseImage(indexes[1])}>
          <img
            onMouseEnter={() => {
              setActiveIndex(4);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className="wordImageImg"
            src={wordsArr.current[indexes[1]].imgUrl}></img>
        </animated.div>

        <animated.div
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            ...springIconsAppear,
          }}
          className="wordImage"
          onClick={() => chooseImage(indexes[2])}>
          <img
            onMouseEnter={() => {
              setActiveIndex(2);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className="wordImageImg"
            src={wordsArr.current[indexes[2]].imgUrl}></img>
        </animated.div>

        <animated.div
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            ...springIconsAppear,
          }}
          className="wordImage"
          onClick={() => chooseImage(indexes[3])}>
          <img
            onMouseEnter={() => {
              setActiveIndex(3);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className="wordImageImg"
            src={wordsArr.current[indexes[3]].imgUrl}></img>
        </animated.div>
      </div>
    </div>
  );

  function getRandomIdx() {
    let unusedInCurrentFour = wordsArr.current.filter((word) =>
      !trainingLearned
        ? !currentFourWords.includes(word.label) && !word.isUsed
        : !currentFourWords.includes(word.label) && word.isUsed,
    );
    let idx = getRandomIndex(unusedInCurrentFour.length);
    let wordsArrInd = wordsArr.current.findIndex((word) => {
      return word?.label === unusedInCurrentFour[idx]?.label;
    });

    currentFourWords.push(wordsArr.current[wordsArrInd].label);
    return wordsArrInd;
  }

  function getWord() {
    let idx = Math.floor(Math.random() * indexes.length);
    new Audio(wordsArr.current[indexes[idx]].sound).play();
    return wordsArr.current[indexes[idx]].label;
  }

  function chooseImage(index: number) {
    if (wordsArr.current[index].label === word) {
      setRightAnswerIcon(true);
      setToggleThumbIcon(true);
      setTimeout(() => setToggleThumbIcon(false), 1000);
      new Audio(rightAnswerSound).play();
      setColorsRandom(getRandomColors());
      if (!trainingLearned) {
        setWordsCounter(wordsCounter + 1);
      }
      setToggleIconsAppear(false);
      setTimeout(() => setNewIndexes(), 1000);

      wordsArr.current[index].isUsed = true;
    } else {
      setRightAnswerIcon(false);
      new Audio(wrongAnswerSound).play();
      setToggleThumbIcon(true);
      setTimeout(() => setToggleThumbIcon(false), 1000);
    }
  }

  function setNewIndexes() {
    currentFourWords = [];
    setIndexes([
      getRandomIdx(),
      getRandomIdx(),
      getRandomIdx(),
      getRandomIdx(),
    ]);
  }

  function getRandomIndex(arrLength: number) {
    return Math.floor(Math.random() * arrLength);
  }

  function getRandomColors() {
    return [
      '#' + colors[getRandomIndex(colors.length)],
      '#' + colors[getRandomIndex(colors.length)],
      '#' + colors[getRandomIndex(colors.length)],
      '#' + colors[getRandomIndex(colors.length)],
    ];
  }

  function getTranslation(lang: string, word: string) {
    return langTranslations?.[word.toLowerCase().replace(/ /g, '')]?.[lang];
  }

  function getPronunciation(key: string) {
    return selectedLang === 'eng'
      ? wordsSoundsEng[key.replace('.png', '')]
      : wordsSoundsPort?.[
          langTranslations?.[key?.replace('.png', '').replace('-', '')]?.port
        ];
  }
}
