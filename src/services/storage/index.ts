const ORIGINAL_DATA_KEY = 'yojeong_original_data';

export interface OriginalData {
  link: string;
  content: string;
}

export const saveOriginalData = (data: OriginalData): void => {
  try {
    localStorage.setItem(ORIGINAL_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save original data to localStorage:', error);
  }
};

export const getOriginalData = (): OriginalData | null => {
  try {
    const data = localStorage.getItem(ORIGINAL_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get original data from localStorage:', error);
    return null;
  }
};

export const clearOriginalData = (): void => {
  try {
    localStorage.removeItem(ORIGINAL_DATA_KEY);
  } catch (error) {
    console.error('Failed to clear original data from localStorage:', error);
  }
};
