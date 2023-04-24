// components/TaskManager/FloatingBalls.js

import React from 'react';
import useBouncingBalls from './useBouncingBalls';
import styles from '../../styles/floatingBalls.module.css';

const FloatingBalls = ({containerRef}) => {
  const { redBallPos, blueBallPos,blackBallPos } = useBouncingBalls(containerRef);

  return (
    <div className={styles.floatingBalls}>

      <div
        className={styles.ball + ' ' + styles.blueBall}
        style={{ left: blueBallPos.x, top: blueBallPos.y }}
      ></div>
      <div
        className={styles.ball + ' ' + styles.redBall}
        style={{ left: redBallPos.x, top: redBallPos.y }}
      ></div>
      <div
        className={styles.ball + ' ' + styles.blackBall}
        style={{ left: blackBallPos.x, top: blackBallPos.y }}
      ></div>
    </div>
  );
};

export default FloatingBalls;
