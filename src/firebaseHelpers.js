// Firebase Helper Functions for Social Cue App
// This file contains all the functions to interact with Firestore database

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ============================================================================
// USER FUNCTIONS
// ============================================================================

/**
 * Creates a new user profile in the USERS collection
 * @param {Object} userData - User information
 * @param {string} userData.name - User's display name
 * @param {string} userData.email - User's email (optional)
 * @param {string} userData.role - User role ("learner", "parent", "teacher")
 * @param {string} userData.gradeLevel - Grade level ("K-2", "3-5", "6-8", "9-12")
 * @returns {Promise<string>} - The ID of the created user document
 */
export const createUser = async (userData) => {
  try {
    console.log('Creating new user:', userData);
    
    const userRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    });
    
    console.log('User created successfully with ID:', userRef.id);
    return userRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Retrieves user data by user ID
 * @param {string} userId - The user's document ID
 * @returns {Promise<Object|null>} - User data or null if not found
 */
export const getUser = async (userId) => {
  try {
    console.log('Getting user:', userId);
    
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = { id: userSnap.id, ...userSnap.data() };
      console.log('User found:', userData);
      return userData;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Updates user information
 * @param {string} userId - The user's document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUser = async (userId, updates) => {
  try {
    console.log('Updating user:', userId, 'with:', updates);
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      lastActive: serverTimestamp()
    });
    
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ============================================================================
// LEARNER PROFILE FUNCTIONS
// ============================================================================

/**
 * Creates a new learner profile
 * @param {string} learnerId - The learner's user ID
 * @param {Object} initialData - Initial profile data
 * @returns {Promise<void>}
 */
export const createLearnerProfile = async (learnerId, initialData = {}) => {
  try {
    console.log('Creating learner profile for:', learnerId);
    
    const profileRef = doc(db, 'learner_profiles', learnerId);
    await setDoc(profileRef, {
      learnerId,
      currentLevel: 1,
      totalPoints: 0,
      streak: 0,
      totalSessions: 0,
      badges: [],
      strengths: [],
      needsWork: [],
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      ...initialData
    });
    
    console.log('✅ Learner profile created successfully');
  } catch (error) {
    console.error('❌ Error creating learner profile:', error);
    throw error;
  }
};

/**
 * Gets learner profile data
 * @param {string} learnerId - The learner's user ID
 * @returns {Promise<Object|null>} - Profile data or null if not found
 */
export const getLearnerProfile = async (learnerId) => {
  try {
    console.log('Getting learner profile for:', learnerId);
    
    const profileRef = doc(db, 'learner_profiles', learnerId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const profileData = { id: profileSnap.id, ...profileSnap.data() };
      console.log('Learner profile found:', profileData);
      return profileData;
    } else {
      console.log('Learner profile not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting learner profile:', error);
    throw error;
  }
};

/**
 * Updates learner progress (points, streak, level, etc.)
 * @param {string} learnerId - The learner's user ID
 * @param {Object} updates - Progress updates
 * @returns {Promise<void>}
 */
export const updateLearnerProgress = async (learnerId, updates) => {
  try {
    console.log('🔄 Updating learner progress for:', learnerId, 'with:', updates);
    
    // First check if the learner profile exists
    const existingProfile = await getLearnerProfile(learnerId);
    
    if (!existingProfile) {
      console.log('📝 Learner profile does not exist, creating new profile...');
      await createLearnerProfile(learnerId);
    }
    
    // Now update the profile
    const profileRef = doc(db, 'learner_profiles', learnerId);
    await updateDoc(profileRef, {
      ...updates,
      lastActive: serverTimestamp()
    });
    
    console.log('✅ Learner progress updated successfully');
  } catch (error) {
    console.error('❌ Error updating learner progress:', error);
    throw error;
  }
};

/**
 * Adds a badge to the learner's profile
 * @param {string} learnerId - The learner's user ID
 * @param {string} badgeName - Name of the badge to add
 * @returns {Promise<void>}
 */
export const addBadge = async (learnerId, badgeName) => {
  try {
    console.log('🏆 Adding badge to learner:', learnerId, 'badge:', badgeName);
    
    // First check if the learner profile exists
    const existingProfile = await getLearnerProfile(learnerId);
    
    if (!existingProfile) {
      console.log('📝 Learner profile does not exist, creating new profile...');
      await createLearnerProfile(learnerId);
    }
    
    const profileRef = doc(db, 'learner_profiles', learnerId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const currentBadges = profileSnap.data().badges || [];
      if (!currentBadges.includes(badgeName)) {
        await updateDoc(profileRef, {
          badges: [...currentBadges, badgeName],
          lastActive: serverTimestamp()
        });
        console.log('✅ Badge added successfully');
      } else {
        console.log('ℹ️ Badge already exists');
      }
    }
  } catch (error) {
    console.error('❌ Error adding badge:', error);
    throw error;
  }
};

// ============================================================================
// SESSION FUNCTIONS
// ============================================================================

/**
 * Saves a completed practice session
 * @param {Object} sessionData - Session data to save
 * @param {string} sessionData.learnerId - Learner's user ID
 * @param {string} sessionData.topicId - Topic/skill practiced
 * @param {number} sessionData.score - Percentage correct (0-100)
 * @param {number} sessionData.timeSpent - Time in seconds
 * @param {Array} sessionData.questionsAnswered - Array of question responses
 * @param {number} sessionData.difficulty - Difficulty level (1-5)
 * @returns {Promise<string>} - The ID of the created session document
 */
export const saveSession = async (sessionData) => {
  try {
    console.log('Saving session:', sessionData);
    
    const sessionRef = await addDoc(collection(db, 'session_history'), {
      ...sessionData,
      completedAt: serverTimestamp()
    });
    
    console.log('Session saved successfully with ID:', sessionRef.id);
    return sessionRef.id;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

/**
 * Gets recent session history for a learner
 * @param {string} learnerId - The learner's user ID
 * @param {number} limitCount - Maximum number of sessions to return (default: 10)
 * @returns {Promise<Array>} - Array of session documents
 */
export const getSessionHistory = async (learnerId, limitCount = 10) => {
  try {
    console.log('Getting session history for:', learnerId, 'limit:', limitCount);
    
    const sessionsRef = collection(db, 'session_history');
    const q = query(
      sessionsRef,
      where('learnerId', '==', learnerId),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Found', sessions.length, 'sessions');
    return sessions;
  } catch (error) {
    console.error('Error getting session history:', error);
    throw error;
  }
};

/**
 * Calculates session statistics for a learner
 * @param {string} learnerId - The learner's user ID
 * @returns {Promise<Object>} - Statistics object
 */
export const getSessionStats = async (learnerId) => {
  try {
    console.log('Getting session stats for:', learnerId);
    
    const sessionsRef = collection(db, 'session_history');
    const q = query(sessionsRef, where('learnerId', '==', learnerId));
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push(doc.data());
    });
    
    // Calculate statistics
    const totalSessions = sessions.length;
    const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
    const averageScore = totalSessions > 0 ? Math.round(totalScore / totalSessions) : 0;
    const totalTimeSpent = sessions.reduce((sum, session) => sum + session.timeSpent, 0);
    
    const stats = {
      totalSessions,
      averageScore,
      totalTimeSpent,
      totalTimeMinutes: Math.round(totalTimeSpent / 60)
    };
    
    console.log('Session stats calculated:', stats);
    return stats;
  } catch (error) {
    console.error('Error getting session stats:', error);
    throw error;
  }
};

// ============================================================================
// LESSON PROGRESS FUNCTIONS
// ============================================================================

/**
 * Creates or updates lesson progress document
 * @param {string} learnerId - The learner's unique ID
 * @param {Object} lessonData - Lesson progress data
 * @param {string} lessonData.lessonId - Unique lesson identifier
 * @param {string} lessonData.lessonTopic - Topic name (e.g., "Small Talk Basics")
 * @param {string} lessonData.gradeLevel - Grade level
 * @param {string} lessonData.status - Progress status ("not_started", "in_progress", "completed")
 * @param {number} lessonData.currentStep - Current step (1, 2, 3)
 * @param {Array} lessonData.stepsCompleted - Array of completed step numbers
 * @param {number} lessonData.practiceScore - Final practice score (0-100)
 * @param {number} lessonData.totalPoints - Points earned
 * @param {boolean} lessonData.realWorldChallengeAccepted - Whether user accepted challenge
 * @param {boolean} lessonData.realWorldChallengeCompleted - Whether challenge was completed
 * @returns {Promise<void>}
 */
export const saveLessonProgress = async (learnerId, lessonData) => {
  try {
    console.log('Saving lesson progress:', { learnerId, lessonData });
    
    // Create normalized document ID
    const docId = `${learnerId}_${(lessonData.lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}`;
    const progressRef = doc(db, 'lesson_progress', docId);
    
    const progressDoc = {
      ...lessonData,
      learnerId,
      lastAccessedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add startedAt if this is a new lesson
    if (!lessonData.startedAt) {
      progressDoc.startedAt = serverTimestamp();
    }

    // Add completedAt if lesson is completed
    if (lessonData.status === 'completed' && !lessonData.completedAt) {
      progressDoc.completedAt = serverTimestamp();
    }

    // Ensure questionsAnswered array exists
    if (!progressDoc.questionsAnswered) {
      progressDoc.questionsAnswered = [];
    }

    // Ensure pointsEarned exists
    if (!progressDoc.pointsEarned) {
      progressDoc.pointsEarned = 0;
    }

    await setDoc(progressRef, progressDoc, { merge: true });
    console.log('Lesson progress saved successfully');
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    throw error;
  }
};

/**
 * Retrieves progress for a specific lesson
 * @param {string} learnerId - The learner's unique ID
 * @param {string} lessonTopic - Topic name (e.g., "Small Talk Basics")
 * @returns {Promise<Object|null>} - Progress object or null if not found
 */
export const getLessonProgress = async (learnerId, lessonTopic) => {
  try {
    console.log('Getting lesson progress:', { learnerId, lessonTopic });
    
    const docId = `${learnerId}_${(lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}`;
    const progressRef = doc(db, 'lesson_progress', docId);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      const progress = progressSnap.data();
      console.log('Found lesson progress:', progress);
      return progress;
    } else {
      console.log('No lesson progress found');
      return null;
    }
  } catch (error) {
    console.error('Error getting lesson progress:', error);
    throw error;
  }
};

/**
 * Gets progress for ALL lessons for a learner
 * @param {string} learnerId - The learner's unique ID
 * @returns {Promise<Array>} - Array of progress objects
 */
export const getAllLessonProgress = async (learnerId) => {
  try {
    console.log('Getting all lesson progress for learner:', learnerId);
    
    // Simple query without index requirement - just filter by learnerId
    const q = query(
      collection(db, 'lesson_progress'),
      where('learnerId', '==', learnerId)
    );
    
    const querySnapshot = await getDocs(q);
    const progressArray = [];
    
    querySnapshot.forEach((doc) => {
      progressArray.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by lastAccessedAt in JavaScript instead of Firestore
    progressArray.sort((a, b) => {
      const aTime = a.lastAccessedAt?.toDate?.() || new Date(0);
      const bTime = b.lastAccessedAt?.toDate?.() || new Date(0);
      return bTime - aTime; // Descending order (newest first)
    });
    
    console.log(`Found ${progressArray.length} lesson progress records`);
    
    // Cache progress to localStorage for fallback
    try {
      localStorage.setItem(`lessonProgress_${learnerId}`, JSON.stringify(progressArray));
      console.log('Cached lesson progress to localStorage');
    } catch (cacheError) {
      console.error('Error caching progress to localStorage:', cacheError);
    }
    
    return progressArray;
  } catch (error) {
    console.error('Error getting all lesson progress:', error);
    
    // Try to get cached progress from localStorage as fallback
    try {
      const cachedProgress = localStorage.getItem(`lessonProgress_${learnerId}`);
      if (cachedProgress) {
        console.log('Using cached lesson progress from localStorage');
        return JSON.parse(cachedProgress);
      }
    } catch (cacheError) {
      console.error('Error reading cached progress:', cacheError);
    }
    
    // Return empty array instead of throwing error
    console.log('Returning empty progress array due to Firebase error');
    return [];
  }
};

/**
 * Updates which step the user is currently on
 * @param {string} learnerId - The learner's unique ID
 * @param {string} lessonTopic - Topic name
 * @param {number} currentStep - Current step number (1, 2, 3)
 * @param {Array} stepsCompleted - Array of completed step numbers
 * @returns {Promise<void>}
 */
export const updateLessonStep = async (learnerId, lessonTopic, currentStep, stepsCompleted) => {
  try {
    console.log('Updating lesson step:', { learnerId, lessonTopic, currentStep, stepsCompleted });
    
    const docId = `${learnerId}_${(lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}`;
    const progressRef = doc(db, 'lesson_progress', docId);
    
    await updateDoc(progressRef, {
      currentStep,
      stepsCompleted,
      lastAccessedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Lesson step updated successfully');
  } catch (error) {
    console.error('Error updating lesson step:', error);
    throw error;
  }
};

/**
 * Marks a lesson as completed with final score and points
 * @param {string} learnerId - The learner's unique ID
 * @param {string} lessonTopic - Topic name
 * @param {number} practiceScore - Final practice score (0-100)
 * @param {number} totalPoints - Points earned
 * @returns {Promise<void>}
 */
export const markLessonComplete = async (learnerId, lessonTopic, practiceScore, totalPoints) => {
  try {
    console.log('Marking lesson complete:', { learnerId, lessonTopic, practiceScore, totalPoints });
    
    const docId = `${learnerId}_${(lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}`;
    const progressRef = doc(db, 'lesson_progress', docId);
    
    await updateDoc(progressRef, {
      status: 'completed',
      practiceScore,
      totalPoints,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Lesson marked as complete successfully');
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    throw error;
  }
};

/**
 * Clears lesson progress (for restarting a lesson)
 * @param {string} learnerId - The learner's unique ID
 * @param {string} lessonTopic - Topic name
 * @returns {Promise<void>}
 */
export const clearLessonProgress = async (learnerId, lessonTopic) => {
  try {
    console.log('Clearing lesson progress:', { learnerId, lessonTopic });
    
    const docId = `${learnerId}_${(lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}`;
    const progressRef = doc(db, 'lesson_progress', docId);
    
    await deleteDoc(progressRef);
    console.log('Lesson progress cleared successfully');
  } catch (error) {
    console.error('Error clearing lesson progress:', error);
    throw error;
  }
};

/**
 * Gets lesson progress statistics for a learner
 * @param {string} learnerId - The learner's unique ID
 * @returns {Promise<Object>} - Statistics object
 */
export const getLessonProgressStats = async (learnerId) => {
  try {
    console.log('Getting lesson progress stats for learner:', learnerId);
    
    const allProgress = await getAllLessonProgress(learnerId);
    
    const stats = {
      totalLessons: allProgress.length,
      completedLessons: allProgress.filter(p => p.status === 'completed').length,
      inProgressLessons: allProgress.filter(p => p.status === 'in_progress').length,
      notStartedLessons: allProgress.filter(p => p.status === 'not_started').length,
      completionPercentage: 0,
      totalPointsEarned: 0,
      averageScore: 0
    };
    
    if (stats.totalLessons > 0) {
      stats.completionPercentage = Math.round((stats.completedLessons / stats.totalLessons) * 100);
    }
    
    const completedWithScores = allProgress.filter(p => p.status === 'completed' && p.practiceScore !== null);
    if (completedWithScores.length > 0) {
      stats.totalPointsEarned = completedWithScores.reduce((sum, p) => sum + (p.totalPoints || 0), 0);
      stats.averageScore = Math.round(
        completedWithScores.reduce((sum, p) => sum + p.practiceScore, 0) / completedWithScores.length
      );
    }
    
    console.log('Lesson progress stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error getting lesson progress stats:', error);
    
    // Return default stats instead of throwing error
    const defaultStats = {
      totalLessons: 0,
      completedLessons: 0,
      inProgressLessons: 0,
      notStartedLessons: 0,
      completionPercentage: 0,
      totalPointsEarned: 0,
      averageScore: 0
    };
    
    console.log('Returning default stats due to error:', defaultStats);
    return defaultStats;
  }
};

// ============================================================================
// TOPIC MASTERY FUNCTIONS
// ============================================================================

/**
 * Updates topic mastery based on performance
 * @param {string} learnerId - The learner's user ID
 * @param {string} topicName - Name of the topic
 * @param {Object} performanceData - Performance data
 * @param {number} performanceData.score - Score achieved
 * @param {number} performanceData.timeSpent - Time spent on session
 * @returns {Promise<void>}
 */
export const updateTopicMastery = async (learnerId, topicName, performanceData) => {
  try {
    console.log('📚 Updating topic mastery for:', learnerId, 'topic:', topicName);
    
    // First ensure the learner profile exists
    const existingProfile = await getLearnerProfile(learnerId);
    if (!existingProfile) {
      console.log('📝 Learner profile does not exist, creating new profile...');
      await createLearnerProfile(learnerId);
    }
    
    // Check if mastery record exists
    const masteryRef = collection(db, 'topic_mastery');
    const q = query(
      masteryRef,
      where('learnerId', '==', learnerId),
      where('topicName', '==', topicName)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Create new mastery record
      await addDoc(masteryRef, {
        learnerId,
        topicName,
        currentLevel: 1,
        percentComplete: Math.min(performanceData.score, 100),
        lastPracticed: serverTimestamp(),
        totalSessions: 1
      });
      console.log('✅ New topic mastery record created');
    } else {
      // Update existing record
      const docRef = querySnapshot.docs[0].ref;
      const currentData = querySnapshot.docs[0].data();
      
      const newPercentComplete = Math.min(
        currentData.percentComplete + (performanceData.score * 0.1), 
        100
      );
      
      await updateDoc(docRef, {
        percentComplete: newPercentComplete,
        lastPracticed: serverTimestamp(),
        totalSessions: currentData.totalSessions + 1,
        currentLevel: Math.min(Math.floor(newPercentComplete / 20) + 1, 5)
      });
      console.log('✅ Topic mastery record updated');
    }
  } catch (error) {
    console.error('❌ Error updating topic mastery:', error);
    throw error;
  }
};

/**
 * Gets mastery data for a specific topic
 * @param {string} learnerId - The learner's user ID
 * @param {string} topicName - Name of the topic
 * @returns {Promise<Object|null>} - Mastery data or null if not found
 */
export const getTopicMastery = async (learnerId, topicName) => {
  try {
    console.log('Getting topic mastery for:', learnerId, 'topic:', topicName);
    
    const masteryRef = collection(db, 'topic_mastery');
    const q = query(
      masteryRef,
      where('learnerId', '==', learnerId),
      where('topicName', '==', topicName)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const masteryData = { 
        id: querySnapshot.docs[0].id, 
        ...querySnapshot.docs[0].data() 
      };
      console.log('Topic mastery found:', masteryData);
      return masteryData;
    } else {
      console.log('Topic mastery not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting topic mastery:', error);
    throw error;
  }
};

/**
 * Gets mastery data for all topics for a learner
 * @param {string} learnerId - The learner's user ID
 * @returns {Promise<Array>} - Array of mastery documents
 */
export const getAllTopicMastery = async (learnerId) => {
  try {
    console.log('Getting all topic mastery for:', learnerId);
    
    const masteryRef = collection(db, 'topic_mastery');
    const q = query(
      masteryRef,
      where('learnerId', '==', learnerId),
      orderBy('lastPracticed', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const masteryData = [];
    
    querySnapshot.forEach((doc) => {
      masteryData.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Found', masteryData.length, 'topic mastery records');
    return masteryData;
  } catch (error) {
    console.error('Error getting all topic mastery:', error);
    throw error;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Helper function to format timestamps for display
 * @param {Object} timestamp - Firestore timestamp
 * @returns {string} - Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp.toDate();
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

/**
 * Helper function to calculate streak from session history
 * @param {Array} sessions - Array of session documents
 * @returns {number} - Current streak count
 */
export const calculateStreak = (sessions) => {
  if (!sessions || sessions.length === 0) return 0;
  
  // Sort sessions by completion date (most recent first)
  const sortedSessions = sessions.sort((a, b) => 
    b.completedAt.toDate() - a.completedAt.toDate()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Start of today
  
  for (const session of sortedSessions) {
    const sessionDate = session.completedAt.toDate();
    sessionDate.setHours(0, 0, 0, 0); // Start of session day
    
    const dayDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === streak) {
      streak++;
    } else if (dayDiff > streak) {
      break; // Gap in streak
    }
  }
  
  return streak;
};

// ============================================================================
// LESSON RESUME FUNCTIONS
// ============================================================================

/**
 * Saves an individual question answer to lesson progress
 * @param {string} learnerId - The learner's unique ID
 * @param {string} lessonTopic - Topic name
 * @param {Object} questionData - Question answer data
 * @param {number} questionData.questionId - Question ID
 * @param {number} questionData.selectedOption - Selected option index
 * @param {boolean} questionData.wasCorrect - Whether answer was correct
 * @param {number} questionData.points - Points earned for this question
 * @returns {Promise<void>}
 */
export const saveQuestionAnswer = async (learnerId, lessonTopic, questionData) => {
  try {
    console.log('Saving question answer:', { learnerId, lessonTopic, questionData });
    
    const docId = `${learnerId}_${(lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}`;
    const progressRef = doc(db, 'lesson_progress', docId);
    
    // Get current progress
    const progressSnap = await getDoc(progressRef);
    if (!progressSnap.exists()) {
      throw new Error('Lesson progress not found');
    }
    
    const currentProgress = progressSnap.data();
    const questionsAnswered = currentProgress.questionsAnswered || [];
    
    // Update or add question answer
    const existingIndex = questionsAnswered.findIndex(q => q.questionId === questionData.questionId);
    if (existingIndex >= 0) {
      questionsAnswered[existingIndex] = questionData;
    } else {
      questionsAnswered.push(questionData);
    }
    
    // Calculate total points
    const totalPoints = questionsAnswered.reduce((sum, q) => sum + (q.points || 0), 0);
    
    // Update progress
    await updateDoc(progressRef, {
      questionsAnswered,
      pointsEarned: totalPoints,
      lastAccessedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Question answer saved successfully');
  } catch (error) {
    console.error('Error saving question answer:', error);
    throw error;
  }
};

/**
 * Saves lesson data to cache for resuming
 * @param {string} learnerId - The learner's unique ID
 * @param {string} lessonTopic - Topic name
 * @param {Object} lessonData - Complete lesson data
 * @returns {Promise<void>}
 */
export const saveLessonData = async (learnerId, lessonTopic, lessonData) => {
  try {
    console.log('Saving lesson data:', { learnerId, lessonTopic });
    
    const docId = `${learnerId}_${(lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}_data`;
    const lessonDataRef = doc(db, 'lesson_data', docId);
    
    await setDoc(lessonDataRef, {
      learnerId,
      lessonTopic,
      lessonData,
      savedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('Lesson data saved successfully');
  } catch (error) {
    console.error('Error saving lesson data:', error);
    throw error;
  }
};

/**
 * Retrieves saved lesson data for resuming
 * @param {string} learnerId - The learner's unique ID
 * @param {string} lessonTopic - Topic name
 * @returns {Promise<Object|null>} Saved lesson data or null
 */
export const getLessonData = async (learnerId, lessonTopic) => {
  try {
    console.log('Getting lesson data:', { learnerId, lessonTopic });
    
    const docId = `${learnerId}_${(lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}_data`;
    const lessonDataRef = doc(db, 'lesson_data', docId);
    const lessonDataSnap = await getDoc(lessonDataRef);
    
    if (lessonDataSnap.exists()) {
      const data = lessonDataSnap.data();
      console.log('Found saved lesson data');
      return data.lessonData;
    } else {
      console.log('No saved lesson data found');
      return null;
    }
  } catch (error) {
    console.error('Error getting lesson data:', error);
    throw error;
  }
};

/**
 * Updates lesson progress to link to saved lesson data
 * @param {string} learnerId - The learner's unique ID
 * @param {string} lessonTopic - Topic name
 * @param {string} lessonDataId - ID of saved lesson data
 * @returns {Promise<void>}
 */
export const linkLessonProgressToData = async (learnerId, lessonTopic, lessonDataId) => {
  try {
    console.log('Linking lesson progress to data:', { learnerId, lessonTopic, lessonDataId });
    
    const docId = `${learnerId}_${(lessonTopic || '').toLowerCase().replace(/\s+/g, '-')}`;
    const progressRef = doc(db, 'lesson_progress', docId);
    
    await updateDoc(progressRef, {
      lessonDataId,
      updatedAt: serverTimestamp()
    });
    
    console.log('Lesson progress linked to data successfully');
  } catch (error) {
    console.error('Error linking lesson progress to data:', error);
    throw error;
  }
};
