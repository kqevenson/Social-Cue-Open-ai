// Helper functions
export const getGradeRange = (grade) => {
  // Return the exact grade instead of ranges for AI lesson generation
  return grade || '5';
};