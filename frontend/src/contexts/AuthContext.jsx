import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Sign up with email and password
  async function signup(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(result.user, {
      displayName: displayName
    });

    // Try to create user profile in Firestore (graceful failure)
    try {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        role: 'user',
        preferences: {
          theme: 'light',
          notifications: true
        }
      });
    } catch (error) {
      console.warn('Could not create user profile in Firestore:', error);
      // Continue without Firestore - authentication still works
    }

    return result;
  }

  // Sign in with email and password
  function signin(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign in with Google
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Try to check/create user profile in Firestore (graceful failure)
    try {
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
          role: 'user',
          preferences: {
            theme: 'light',
            notifications: true
          }
        });
      }
    } catch (error) {
      console.warn('Could not access/create user profile in Firestore:', error);
      // Continue without Firestore - authentication still works
    }

    return result;
  }

  // Sign out
  function logout() {
    return signOut(auth);
  }

  // Reset password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Load user profile from Firestore
  async function loadUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        // Create a basic profile if it doesn't exist
        const basicProfile = {
          uid: uid,
          email: currentUser?.email,
          displayName: currentUser?.displayName,
          createdAt: new Date().toISOString(),
          role: 'user',
          preferences: {
            theme: 'light',
            notifications: true
          }
        };
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set a basic profile even if Firestore fails
      const basicProfile = {
        uid: uid,
        email: currentUser?.email,
        displayName: currentUser?.displayName,
        createdAt: new Date().toISOString(),
        role: 'user',
        preferences: {
          theme: 'light',
          notifications: true
        }
      };
      setUserProfile(basicProfile);
    }
  }

  useEffect(() => {
    let timeoutId;
    
    try {
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.warn('AuthContext: Auth initialization timeout, proceeding without auth');
        setLoading(false);
      }, 10000); // 10 second timeout

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          clearTimeout(timeoutId); // Clear timeout since auth resolved
          setCurrentUser(user);
          if (user) {
            await loadUserProfile(user.uid);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        } catch (error) {
          console.error('AuthContext: Error in auth state change:', error);
          setLoading(false);
        }
      });

      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (error) {
      console.error('AuthContext: Error setting up auth listener:', error);
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    signin,
    signInWithGoogle,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Initializing ProtoGen</h2>
            <p className="text-gray-500">Setting up your laboratory management system...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
