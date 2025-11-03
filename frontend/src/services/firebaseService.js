import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

class FirebaseService {
  constructor() {
    this.db = db;
  }

  // ==================== USER BOOKMARKS ====================
  
  /**
   * Save a bookmark for the user
   * @param {string} userId - User ID
   * @param {Object} bookmarkData - Bookmark data
   */
  async saveBookmark(userId, bookmarkData) {
    try {
      const bookmarkRef = collection(this.db, 'users', userId, 'bookmarks');
      const bookmark = {
        ...bookmarkData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(bookmarkRef, bookmark);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving bookmark:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all bookmarks for a user
   * @param {string} userId - User ID
   */
  async getUserBookmarks(userId) {
    try {
      const bookmarksRef = collection(this.db, 'users', userId, 'bookmarks');
      const q = query(bookmarksRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bookmarks = [];
      querySnapshot.forEach((doc) => {
        bookmarks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, bookmarks };
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return { success: false, error: error.message, bookmarks: [] };
    }
  }

  /**
   * Delete a bookmark
   * @param {string} userId - User ID
   * @param {string} bookmarkId - Bookmark ID
   */
  async deleteBookmark(userId, bookmarkId) {
    try {
      await deleteDoc(doc(this.db, 'users', userId, 'bookmarks', bookmarkId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== SAVED RESULTS ====================
  
  /**
   * Save a result (protocol, tool recommendation, troubleshooting)
   * @param {string} userId - User ID
   * @param {Object} resultData - Result data
   */
  async saveResult(userId, resultData) {
    try {
      const resultsRef = collection(this.db, 'users', userId, 'saved_results');
      const result = {
        ...resultData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(resultsRef, result);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving result:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get saved results for a user
   * @param {string} userId - User ID
   * @param {string} type - Result type (protocol, tools, troubleshoot, routes)
   */
  async getSavedResults(userId, type = null) {
    try {
      const resultsRef = collection(this.db, 'users', userId, 'saved_results');
      let q;
      
      if (type) {
        q = query(
          resultsRef, 
          where('type', '==', type),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(resultsRef, orderBy('createdAt', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const results = [];
      
      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, results };
    } catch (error) {
      console.error('Error getting saved results:', error);
      return { success: false, error: error.message, results: [] };
    }
  }

  /**
   * Delete a saved result
   * @param {string} userId - User ID
   * @param {string} resultId - Result ID
   */
  async deleteSavedResult(userId, resultId) {
    try {
      await deleteDoc(doc(this.db, 'users', userId, 'saved_results', resultId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting saved result:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update a saved result
   * @param {string} userId - User ID
   * @param {string} resultId - Result ID
   * @param {Object} updateData - Data to update
   */
  async updateSavedResult(userId, resultId, updateData) {
    try {
      const resultRef = doc(this.db, 'users', userId, 'saved_results', resultId);
      await setDoc(resultRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating saved result:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== USER ACTIVITY ====================
  
  /**
   * Log user activity
   * @param {string} userId - User ID
   * @param {Object} activityData - Activity data
   */
  async logActivity(userId, activityData) {
    try {
      const activityRef = collection(this.db, 'users', userId, 'activity');
      const activity = {
        ...activityData,
        timestamp: serverTimestamp()
      };
      
      await addDoc(activityRef, activity);
      return { success: true };
    } catch (error) {
      console.error('Error logging activity:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user activity history
   * @param {string} userId - User ID
   * @param {number} limitCount - Number of activities to retrieve
   */
  async getUserActivity(userId, limitCount = 50) {
    try {
      const activityRef = collection(this.db, 'users', userId, 'activity');
      const q = query(
        activityRef, 
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const activities = [];
      
      querySnapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, activities };
    } catch (error) {
      console.error('Error getting user activity:', error);
      return { success: false, error: error.message, activities: [] };
    }
  }

  // ==================== USER PREFERENCES ====================
  
  /**
   * Save user preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - User preferences
   */
  async saveUserPreferences(userId, preferences) {
    try {
      const prefsRef = doc(this.db, 'users', userId, 'preferences', 'settings');
      await setDoc(prefsRef, {
        ...preferences,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return { success: true };
    } catch (error) {
      console.error('Error saving preferences:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user preferences
   * @param {string} userId - User ID
   */
  async getUserPreferences(userId) {
    try {
      const prefsRef = doc(this.db, 'users', userId, 'preferences', 'settings');
      const docSnap = await getDoc(prefsRef);
      
      if (docSnap.exists()) {
        return { success: true, preferences: docSnap.data() };
      } else {
        // Return default preferences
        const defaultPrefs = {
          theme: 'light',
          notifications: true,
          autoSave: true,
          language: 'en'
        };
        return { success: true, preferences: defaultPrefs };
      }
    } catch (error) {
      console.error('Error getting preferences:', error);
      return { success: false, error: error.message, preferences: {} };
    }
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Check if user has saved a specific result
   * @param {string} userId - User ID
   * @param {string} contentHash - Hash of the content to check
   */
  async isResultSaved(userId, contentHash) {
    try {
      const resultsRef = collection(this.db, 'users', userId, 'saved_results');
      const q = query(resultsRef, where('contentHash', '==', contentHash));
      const querySnapshot = await getDocs(q);
      
      return { success: true, isSaved: !querySnapshot.empty };
    } catch (error) {
      console.error('Error checking if result is saved:', error);
      return { success: false, error: error.message, isSaved: false };
    }
  }

  /**
   * Get user statistics
   * @param {string} userId - User ID
   */
  async getUserStats(userId) {
    try {
      const [bookmarksResult, resultsResult, activityResult] = await Promise.all([
        this.getUserBookmarks(userId),
        this.getSavedResults(userId),
        this.getUserActivity(userId, 10)
      ]);

      const stats = {
        totalBookmarks: bookmarksResult.bookmarks?.length || 0,
        totalSavedResults: resultsResult.results?.length || 0,
        recentActivity: activityResult.activities?.length || 0,
        resultsByType: {}
      };

      // Count results by type
      if (resultsResult.results) {
        resultsResult.results.forEach(result => {
          const type = result.type || 'unknown';
          stats.resultsByType[type] = (stats.resultsByType[type] || 0) + 1;
        });
      }

      return { success: true, stats };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { success: false, error: error.message, stats: {} };
    }
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();
export default firebaseService;
