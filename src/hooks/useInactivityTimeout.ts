// src/hooks/useInactivityTimeout.ts
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Використовуйте 'react-router-dom' для навігації

/**
 * Хук для перенаправлення користувача після певного часу бездіяльності.
 * @param timeoutSeconds Час бездіяльності в секундах, після якого відбувається перенаправлення.
 * @param redirectPath Шлях, на який потрібно перенаправити користувача (наприклад, '/').
 */
const useInactivityTimeout = (timeoutSeconds: number, redirectPath: string): void => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Функція перенаправлення
  const goToHomePage = useCallback(() => {
    console.log(`Бездіяльність. Перенаправлення на ${redirectPath}`);
    navigate(redirectPath);
  }, [navigate, redirectPath]);
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      goToHomePage();
    }, timeoutSeconds * 1000); 
  }, [timeoutSeconds, goToHomePage]);

  useEffect(() => {
    const activityEvents = [
      'mousemove', 
      'mousedown', 
      'keydown',   
      'scroll',    
      'touchstart',
    ];

    resetTimer();

    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);
};

export default useInactivityTimeout;