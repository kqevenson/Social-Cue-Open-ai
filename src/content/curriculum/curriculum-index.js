import k2 from './k-2-curriculum';
import grades3to5 from './3-5-curriculum';
import grades6to8 from './6-8-curriculum';
import grades9to12 from './9-12-curriculum';

const curriculum = {
  grades: {
    'k-2': k2,
    '3-5': grades3to5,
    '6-8': grades6to8,
    '9-12': grades9to12
  },

  /**
   * Returns a normalized curriculum key like "k-2" or "6-8"
   * @param {string|number} gradeLevel
   * @returns {string} grade key
   */
  getGradeKey(gradeLevel) {
    const grade = parseInt(gradeLevel, 10);
    if (grade <= 2) return 'k-2';
    if (grade <= 5) return '3-5';
    if (grade <= 8) return '6-8';
    return '9-12';
  }
};

export default curriculum;
