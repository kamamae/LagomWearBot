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
    if (!tg.MainButton.isVisible) {
      tg.MainButton.show();
    }
  };

  return {
    tg,
    showMainButton,
    user:tg.initDataUnsafe?.user,
    chat:tg.initDataUnsafe?.chat,
  };
}