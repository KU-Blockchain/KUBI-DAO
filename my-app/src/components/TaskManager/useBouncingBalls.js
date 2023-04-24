// components/TaskManager/useBouncingBalls.js

import { useState, useEffect, useRef } from 'react';

const useBouncingBalls = (containerRef) => {
  const redBallPos = useRef({ x: 200, y: 200 });
  const blueBallPos = useRef({ x: 600, y: 300 });
  const blackBallPos = useRef({ x: 700, y: 100 });
  const [_, setRender] = useState({});

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    let redBallVelocity = { x: 0.25, y: .5 };
    let blueBallVelocity = { x: -1, y: .5 };
    let blackBallVelocity = { x: -0.5, y: -1 };
    let animationFrameId;

    const updatePositions = () => {
      const newPosRedBall = {
        x: redBallPos.current.x + redBallVelocity.x,
        y: redBallPos.current.y + redBallVelocity.y,
      };

      const newPosBlueBall = {
        x: blueBallPos.current.x + blueBallVelocity.x,
        y: blueBallPos.current.y + blueBallVelocity.y,
      };

      const newPosBlackBall = {
        x: blackBallPos.current.x + blackBallVelocity.x,
        y: blackBallPos.current.y + blackBallVelocity.y,
      };

      if (newPosRedBall.x < 0 || newPosRedBall.x + 100 > containerRect.width-300) {
        redBallVelocity.x *= -1;
      }
      if (newPosRedBall.y < 0 || newPosRedBall.y + 100 > containerRect.height-175) {
        redBallVelocity.y *= -1;
      }

      if (newPosBlueBall.x < 0 || newPosBlueBall.x + 100 > containerRect.width-250) {
        blueBallVelocity.x *= -1;
      }
      if (newPosBlueBall.y < 0 || newPosBlueBall.y + 100 > containerRect.height-250) {
        blueBallVelocity.y *= -1;
      }

      if (newPosBlackBall.x < 0 || newPosBlackBall.x + 100 > containerRect.width-300) {
        blackBallVelocity.x *= -1;
      }
      if (newPosBlackBall.y < 0 || newPosBlackBall.y + 100 > containerRect.height-100) {
        blackBallVelocity.y *= -1;
      }

      redBallPos.current = newPosRedBall;
      blueBallPos.current = newPosBlueBall;
      blackBallPos.current = newPosBlackBall;

      setRender({}); // Trigger a re-render

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);

    return () => {
      // Cancel the animation frame when the component is unmounted
      cancelAnimationFrame(animationFrameId);
    };
  }, [containerRef]);

  return { redBallPos: redBallPos.current, blueBallPos: blueBallPos.current, blackBallPos: blackBallPos.current };
};

export default useBouncingBalls;
