export const isValidUrl = (url: string): boolean => {
  return /^https?:\/\/.+\..+/.test(url.trim());
};
