declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

const tg = window.Telegram.WebApp;

export function useTelegram() {
  const showMainButton = () => {
    if (tg && tg.MainButton && !tg.MainButton.isVisible) {
      tg.MainButton.show();
    }
  };

  const initDataUnsafe = tg?.initDataUnsafe || {};
  const { user, chat } = initDataUnsafe;

  return {
    tg,
    showMainButton,
    user,
    chat,
  };
}