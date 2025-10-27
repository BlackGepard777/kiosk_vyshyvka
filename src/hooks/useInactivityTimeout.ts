// src/hooks/useInactivityTimeout.ts
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Використовуйте 'react-router-dom' для навігації

/**
 * Хук для перенаправлення користувача після певного часу бездіяльності.
 * @param timeoutSeconds Час бездіяльності в секундах, після якого відбувається перенаправлення.
 * @param redirectPath Шлях, на який потрібно перенаправити користувача (наприклад, '/').
 */
const useInactivityTimeout = (timeoutSeconds: number, redirectPath: string): void => {
  // Використовуємо useRef для зберігання ID таймера, щоб мати змогу його очистити
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // useNavigate для програмної навігації
  const navigate = useNavigate();

  // Функція перенаправлення
  const goToHomePage = useCallback(() => {
    console.log(`Бездіяльність. Перенаправлення на ${redirectPath}`);
    // Виконати перенаправлення
    navigate(redirectPath);
  }, [navigate, redirectPath]);

  // Функція скидання таймера
  const resetTimer = useCallback(() => {
    // 1. Очистити попередній таймер, якщо він існує
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 2. Встановити новий таймер
    timeoutRef.current = setTimeout(() => {
      goToHomePage();
    }, timeoutSeconds * 1000); // Перетворюємо секунди на мілісекунди
  }, [timeoutSeconds, goToHomePage]);

  useEffect(() => {
    // Список подій, які ми будемо відстежувати як "активність"
    const activityEvents = [
      'mousemove', // Рух миші
      'mousedown', // Кліки миші
      'keydown',   // Натискання клавіш
      'scroll',    // Скролінг
      'touchstart', // Дотик (для мобільних)
    ];

    // При першому завантаженні компонента - запустити таймер
    resetTimer();

    // Додати слухачі подій до об'єкта window
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Очищення: видалити слухачі та таймер при демонтажі компонента (cleanup)
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]); // Залежність лише від resetTimer
};

export default useInactivityTimeout;