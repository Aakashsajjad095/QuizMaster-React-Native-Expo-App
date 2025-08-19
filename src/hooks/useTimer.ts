import { useEffect, useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { updateTimer } from '../redux/slices/gameSlice';

interface UseTimerProps {
  initialTime?: number; // in seconds
  onTimeUp?: () => void;
  autoStart?: boolean;
  countDown?: boolean;
}

export const useTimer = ({
  initialTime = 0,
  onTimeUp,
  autoStart = false,
  countDown = true,
}: UseTimerProps = {}) => {
  const dispatch = useAppDispatch();
  const { isGameActive, isPaused, timeRemaining: gameTimeRemaining } = useAppSelector(
    (state) => state.game
  );

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  type Timeout = ReturnType<typeof setInterval>;
const intervalRef = useRef<Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Format time as MM:SS or HH:MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }, []);

  // Get progress percentage (0-100)
  const getProgress = useCallback((): number => {
    if (initialTime === 0) return 0;
    if (countDown) {
      return ((initialTime - time) / initialTime) * 100;
    }
    return (time / initialTime) * 100;
  }, [time, initialTime, countDown]);

  // Check if time is running low (less than 10% remaining for countdown)
  const isTimeRunningLow = useCallback((): boolean => {
    if (!countDown || initialTime === 0) return false;
    return (time / initialTime) <= 0.1;
  }, [time, initialTime, countDown]);

  // Check if time is critical (less than 30 seconds for countdown)
  const isTimeCritical = useCallback((): boolean => {
    if (!countDown) return false;
    return time <= 30;
  }, [time, countDown]);

  // Start the timer
  const start = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - (startTimeRef.current || now)) / 1000;
      
      let newTime: number;
      if (countDown) {
        newTime = Math.max(0, initialTime - elapsed);
      } else {
        newTime = elapsed;
      }
      
      setTime(newTime);
      
      // Update game timer if this is the main game timer
      if (isGameActive && !isPaused) {
        dispatch(updateTimer(Math.floor(newTime)));
      }
      
      // Check if time is up for countdown
      if (countDown && newTime <= 0) {
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onTimeUp?.();
      }
    }, 100); // Update every 100ms for smooth animation
  }, [isRunning, initialTime, countDown, onTimeUp, isGameActive, isPaused, dispatch]);

  // Pause the timer
  const pause = useCallback(() => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (startTimeRef.current) {
      pausedTimeRef.current = Date.now() - startTimeRef.current;
    }
  }, [isRunning]);

  // Resume the timer
  const resume = useCallback(() => {
    if (isRunning) return;
    start();
  }, [isRunning, start]);

  // Stop and reset the timer
  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(initialTime);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [initialTime]);

  // Reset the timer to initial time
  const reset = useCallback(() => {
    const wasRunning = isRunning;
    stop();
    if (wasRunning) {
      start();
    }
  }, [isRunning, stop, start]);

  // Add time to the current timer
  const addTime = useCallback((seconds: number) => {
    if (countDown) {
      setTime(prev => Math.min(prev + seconds, initialTime));
    } else {
      setTime(prev => prev + seconds);
    }
  }, [countDown, initialTime]);

  // Subtract time from the current timer
  const subtractTime = useCallback((seconds: number) => {
    if (countDown) {
      setTime(prev => Math.max(0, prev - seconds));
    } else {
      setTime(prev => Math.max(0, prev - seconds));
    }
  }, [countDown]);

  // Set specific time
  const setSpecificTime = useCallback((seconds: number) => {
    setTime(seconds);
    if (isGameActive && !isPaused) {
      dispatch(updateTimer(Math.floor(seconds)));
    }
  }, [isGameActive, isPaused, dispatch]);

  // Auto-pause when game is paused
  useEffect(() => {
    if (isGameActive && isPaused && isRunning) {
      pause();
    } else if (isGameActive && !isPaused && !isRunning && time > 0) {
      start();
    }
  }, [isGameActive, isPaused, isRunning, time, pause, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Sync with game time if this is the main timer
  useEffect(() => {
    if (isGameActive && gameTimeRemaining !== time) {
      setTime(gameTimeRemaining);
    }
  }, [gameTimeRemaining, isGameActive, time]);

  return {
    // Current state
    time: Math.floor(time),
    formattedTime: formatTime(time),
    isRunning,
    progress: getProgress(),
    
    // Status checks
    isTimeUp: countDown ? time <= 0 : false,
    isTimeRunningLow: isTimeRunningLow(),
    isTimeCritical: isTimeCritical(),
    
    // Controls
    start,
    pause,
    resume,
    stop,
    reset,
    
    // Time manipulation
    addTime,
    subtractTime,
    setTime: setSpecificTime,
    
    // Utilities
    formatTime,
    getProgress,
  };
};

export default useTimer;