import { useState, useEffect, useRef } from 'react';

const useBouncingBalls = (containerRef) => {
  const balls = useRef([
    { position: { x: 200, y: 200 }, velocity: { x: 0.25, y: 0.5 }, bounds: { x: 100, y: 100 } },
    { position: { x: 500, y: 300 }, velocity: { x: -0.4, y: -0.55 }, bounds: { x: 100, y: 100 } },
    { position: { x: 700, y: 100 }, velocity: { x: 0.3, y: -0.55 }, bounds: { x: 100, y: 100 } },
    { position: { x: 400, y: 100 }, velocity: { x: -0.4, y: -0.5 }, bounds: { x: 100, y: 100 } },
  ]);

  const [, setRender] = useState({});

  const updateBallPosition = (ball, containerRect) => {
    const newPos = {
      x: ball.position.x + ball.velocity.x,
      y: ball.position.y + ball.velocity.y,
    };

    if (newPos.x < 0 || newPos.x + ball.bounds.x > containerRect.width - 300) {
      ball.velocity.x *= -1;
    }
    if (newPos.y < 0 || newPos.y + ball.bounds.y > containerRect.height - 175) {
      ball.velocity.y *= -1;
    }

    ball.position = newPos;
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    let animationFrameId;
    let lastTime = 0;

    const updatePositions = (time) => {
      if (time - lastTime > 1000 / 15) { // Throttle to 60fps
        balls.current.forEach((ball) => updateBallPosition(ball, containerRect));
        setRender({}); // Trigger a re-render
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);

    return () => {
      // Cancel the animation frame when the component is unmounted
      cancelAnimationFrame(animationFrameId);
    };
  }, [containerRef]);

  return {
    cornflowerBallPos: balls.current[3].position,
    redBallPos: balls.current[0].position,
    blueBallPos: balls.current[1].position,
    blackBallPos: balls.current[2].position,
  };
};

export default useBouncingBalls;
