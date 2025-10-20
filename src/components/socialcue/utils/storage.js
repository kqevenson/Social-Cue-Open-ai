// Storage utilities
export const STORAGE_KEY = 'socialCueUserData';

export const getDefaultUserData = () => ({
  userName: 'Alex',
  streak: 7,
  totalSessions: 24,
  confidenceScore: 89,
  lastActiveDate: new Date().toDateString(),
  completedSessions: [{ id: 2, progress: 45 }]
});

export const getUserData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    const defaultData = getDefaultUserData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  } catch (error) {
    return getDefaultUserData();
  }
};

export const getSessionProgress = (sessionId) => {
  const userData = getUserData();
  const session = userData.completedSessions?.find(s => s.id === sessionId);
  return session ? (session.progress || 100) : 0;
};

export const saveUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};