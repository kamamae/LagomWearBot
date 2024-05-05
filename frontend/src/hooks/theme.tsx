export default function getCurrentTheme() {
  const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDarkTheme ? 'dark' : 'light';
}