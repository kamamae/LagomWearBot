export function useTelegram() {
    const tg = window.Telegram?.WebApp;
  
    const onToggleButton = () => {
      if (tg && tg.MainButton.isVisible) {
        tg.MainButton.hide();
      } else if (tg) {
        tg.MainButton.show();
      }
    };
  
    return {
      tg,
      onToggleButton,
    };
  }