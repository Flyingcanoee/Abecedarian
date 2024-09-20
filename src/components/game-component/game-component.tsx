import { useEffect, useRef, useState, useMemo } from 'react';
import styles from './game-component.module.scss';
import { images } from '../../assets/images';
import { wordsSoundsEng, wordsSoundsPort } from '../../assets/audio';
import { animated, useSpring } from 'react-spring';

import wrongAnswerSound from '../../assets/sounds/wrongAnswer.mp3';
import rightAnswerSound from '../../assets/sounds/rightAnswer.mp3';
import {
  blob1Paths,
  blob2Paths,
  blob3Paths,
  blob4Paths,
  colors,
} from '../icons-components/blobs-paths';
import ThumbIcon from '../icons-components/thumb-icon';
import RepeatIcon from '../icons-components/repeat-icon';
import MixIcon from '../icons-components/mix-icon';
import {
  langTranslations,
  languageComponents,
  languageLabels,
} from '../../const/language-info';
import HomeIcon from '../icons-components/home-icon';
import reset from '../../assets/menu-icons/reset.png';

let currentFourWords: string[] = [];

interface Props {
  setGameStarted: (v: boolean) => void;
  selectedLang: keyof typeof languageComponents;
}

export default function GameComponent({ setGameStarted, selectedLang }: Props) {
  const wordsArray = useMemo(
    () =>
      Object.keys(images).map((key) => {
        return {
          imgUrl: images[key],
          label: getTranslation(selectedLang, key.replace('.png', '')),
          isUsed: false,
          sound: getPronunciation(key.replace('.png', '')),
        };
      }),
    [selectedLang],
  );

  const LanguageIcon = languageComponents[selectedLang];

  const wordsArr = useRef(wordsArray);

  useEffect(() => {
    wordsArr.current = wordsArray;
  }, [wordsArray]);

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
    // if (loadedImagesCount === 4) {
    //   setToggleIconsAppear(true);
    // }
  }, [indexes]);

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!isFirstMount.current) {
      setNewIndexes();
    }
    isFirstMount.current = false;
  }, [trainingLearned]);

  useEffect(() => {
    if (localStorage.getItem('wordsArrayStorage')) {
      wordsArr.current = JSON.parse(
        localStorage.getItem('wordsArrayStorage') as string,
      );
      setWordsCounter(wordsArr.current.filter((word) => word.isUsed).length);
    }
  }, []);

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

  const loadedImagesCount = useRef(0);

  const [toggleIconsAppear, setToggleIconsAppear] = useState(false);

  const springIconsAppear = useSpring({
    transform: toggleIconsAppear ? 'scale(1)' : 'scale(0)',
    config: {
      tension: 500,
      friction: 20,
    },
  });

  return (
    <div className={styles.gameComponent}>
      <div onClick={() => setGameStarted(false)} className={styles.homeBtn}>
        <HomeIcon />
      </div>
      <div className={styles.wordContainer}>
        {!toggleThumbIcon && <h1 className={styles.word}>{word}</h1>}
      </div>
      <div className={styles.counter}>{wordsCounter}</div>

      <button className={`${styles.rightPanelBtn} ${styles.languageBtn}`}>
        <div className={styles.overflowedContent}>
          <LanguageIcon />
          <span className={styles.rightPanelWordsText}>
            {languageLabels[selectedLang]}
          </span>
        </div>
      </button>

      <button
        disabled={wordsCounter < 4}
        className={
          `${styles.rightPanelBtn} ${styles.repeatingModeBtn} ` +
          (trainingLearned ? styles.active : '')
        }
        onClick={() => {
          setTrainingLearned(true);
        }}>
        <div className={styles.overflowedContent}>
          <RepeatIcon color={wordsCounter < 4 ? '#7f7f7f' : '#282c34'} />
          <span className={styles.rightPanelWordsText}>
            REPEAT LEARNED WORDS
          </span>
        </div>

        {wordsCounter < 4 && (
          <div className={styles.repeatingModeTooltip}>
            <span>You need to learn at least 4 words</span>
          </div>
        )}
      </button>

      <button
        className={
          `${styles.rightPanelBtn} ${styles.mixWordsBtn} ` +
          (!trainingLearned ? styles.active : '')
        }
        onClick={() => {
          if (trainingLearned) {
            setTrainingLearned(false);
          }
        }}>
        <div className={styles.overflowedContent}>
          <MixIcon color="#282c34" />
          <span className={styles.rightPanelWordsText}>LEARN WORDS</span>
        </div>
      </button>

      <button
        className={`${styles.rightPanelBtn} ${styles.reset}`}
        onClick={() => {
          localStorage.removeItem('wordsArrayStorage');
          setWordsCounter(0);
          setTrainingLearned(false);
          wordsArr.current.forEach((obj) => (obj.isUsed = false));
        }}>
        <div className={styles.overflowedContent}>
          <img className={styles.resetIcon} src={reset} />
          <span className={styles.rightPanelWordsText}>
            RESET LEARNED WORDS
          </span>
        </div>
      </button>

      <svg
        className={styles.wrongAnswer}
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

      <div className={styles.pictures}>
        <svg
          className={styles.blobSvg}
          viewBox="0 0 2000 950"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <animated.path
            onMouseEnter={() => {
              setActiveIndex(1);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className={styles.blob1}
            d={animationProps.blob1Path}
            fill={colorsRandom[0]}
            transform="translate(10 10)"
          />

          <animated.path
            onMouseEnter={() => {
              setActiveIndex(4);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className={styles.blob2}
            d={animationProps.blob2Path}
            fill={colorsRandom[1]}
            transform-origin="100% 100%"
          />

          <animated.path
            onMouseEnter={() => {
              setActiveIndex(2);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className={styles.blob3}
            d={animationProps.blob3Path}
            fill={colorsRandom[2]}
            transform-origin="100% 100%"
          />

          <animated.path
            onMouseEnter={() => {
              setActiveIndex(3);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className={styles.blob4}
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
          className={styles.wordImage}
          onClick={() => chooseImage(indexes[0])}>
          <img
            onLoad={() => updateLoadedImagesCount()}
            onMouseLeave={() => setActiveIndex(0)}
            className={styles.wordImageImg}
            src={wordsArr.current[indexes[0]].imgUrl}></img>
        </animated.div>

        <animated.div
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            ...springIconsAppear,
          }}
          className={styles.wordImage}
          onClick={() => chooseImage(indexes[1])}>
          <img
            onLoad={() => updateLoadedImagesCount()}
            onMouseEnter={() => {
              setActiveIndex(4);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className={styles.wordImageImg}
            src={wordsArr.current[indexes[1]].imgUrl}></img>
        </animated.div>

        <animated.div
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            ...springIconsAppear,
          }}
          className={styles.wordImage}
          onClick={() => chooseImage(indexes[2])}>
          <img
            onLoad={() => updateLoadedImagesCount()}
            onMouseEnter={() => {
              setActiveIndex(2);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className={styles.wordImageImg}
            src={wordsArr.current[indexes[2]].imgUrl}></img>
        </animated.div>

        <animated.div
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            ...springIconsAppear,
          }}
          className={styles.wordImage}
          onClick={() => chooseImage(indexes[3])}>
          <img
            onLoad={() => updateLoadedImagesCount()}
            onMouseEnter={() => {
              setActiveIndex(3);
            }}
            onMouseLeave={() => setActiveIndex(0)}
            className={styles.wordImageImg}
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
      localStorage.setItem(
        'wordsArrayStorage',
        JSON.stringify(wordsArr.current),
      );
    } else {
      setRightAnswerIcon(false);
      new Audio(wrongAnswerSound).play();
      setToggleThumbIcon(true);
      setTimeout(() => setToggleThumbIcon(false), 1000);
    }
  }

  function setNewIndexes() {
    loadedImagesCount.current = 0;
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

  function getTranslation(lang: string, key: string) {
    if (lang === 'eng') {
      return key.replace('-', ' ');
    }
    return langTranslations?.[key]?.[lang];
  }

  function getPronunciation(key: string) {
    return selectedLang === 'eng'
      ? wordsSoundsEng[key]
      : wordsSoundsPort?.[langTranslations?.[key]?.port];
  }

  function updateLoadedImagesCount() {
    loadedImagesCount.current++;
    if (loadedImagesCount.current === 4) {
      setToggleIconsAppear(true);
    }
  }
}
