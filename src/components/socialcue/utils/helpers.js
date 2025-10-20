// Helper functions
export const getGradeRange = (grade) => {
  const num = parseInt(grade) || 5;
  if (num <= 2) return 'k2';
  if (num <= 5) return '3-5';
  if (num <= 8) return '6-8';
  return '9-12';
};