import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Save, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService } from '../services/firebaseService';

const SaveButton = ({ 
  data, 
  type, 
  title, 
  variant = 'save', // 'save' or 'bookmark'
  size = 'default', // 'sm', 'default', 'lg'
  className = '' 
}) => {
  const { currentUser } = useAuth();
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentHash, setContentHash] = useState('');

  // Generate content hash for duplicate detection
  useEffect(() => {
    if (data) {
      try {
        // Use a simple hash function instead of btoa to avoid Unicode issues
        const jsonString = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < jsonString.length; i++) {
          const char = jsonString.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        setContentHash(Math.abs(hash).toString(16).slice(0, 16));
      } catch (error) {
        console.error('Error generating content hash:', error);
        setContentHash(Date.now().toString(16));
      }
    }
  }, [data]);

  // Check if already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      if (currentUser && contentHash) {
        try {
          const result = await firebaseService.isResultSaved(currentUser.uid, contentHash);
          if (result.success) {
            setIsSaved(result.isSaved);
          }
        } catch (error) {
          console.error('Error checking if result is saved:', error);
        }
      }
    };

    checkIfSaved();
  }, [currentUser, contentHash]);

  const handleSave = async () => {
    if (!currentUser || !data) return;

    setIsLoading(true);

    try {
      if (isSaved) {
        // If already saved, we could implement unsave functionality here
        // For now, just show it's already saved
        return;
      }

      const saveData = {
        type,
        title: title || `${type} Result`,
        content: data,
        contentHash,
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          url: window.location.pathname
        }
      };

      let result;
      if (variant === 'bookmark') {
        result = await firebaseService.saveBookmark(currentUser.uid, saveData);
      } else {
        result = await firebaseService.saveResult(currentUser.uid, saveData);
      }

      if (result.success) {
        setIsSaved(true);
        
        // Log activity
        await firebaseService.logActivity(currentUser.uid, {
          action: variant === 'bookmark' ? 'bookmark_added' : 'result_saved',
          type,
          title: saveData.title,
          resultId: result.id
        });

        // Show success feedback
        setTimeout(() => {
          // Could trigger a toast notification here
        }, 100);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser || !data) {
    return null; // Don't show save button if not authenticated or no data
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className={`${iconSizes[size]} animate-spin`} />;
    }
    
    if (variant === 'bookmark') {
      return isSaved ? 
        <BookmarkCheck className={iconSizes[size]} /> : 
        <Bookmark className={iconSizes[size]} />;
    } else {
      return isSaved ? 
        <Check className={iconSizes[size]} /> : 
        <Save className={iconSizes[size]} />;
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Saving...';
    if (isSaved) {
      return variant === 'bookmark' ? 'Bookmarked' : 'Saved';
    }
    return variant === 'bookmark' ? 'Bookmark' : 'Save';
  };

  const getButtonClass = () => {
    const baseClass = `inline-flex items-center space-x-2 font-medium rounded-lg transition-all duration-200 ${sizeClasses[size]}`;
    
    if (isSaved) {
      return `${baseClass} bg-green-100 text-green-700 border border-green-200 cursor-default`;
    }
    
    if (variant === 'bookmark') {
      return `${baseClass} bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300`;
    } else {
      return `${baseClass} bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300`;
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading || isSaved}
      className={`${getButtonClass()} ${className}`}
      title={isSaved ? 'Already saved to your account' : `Save this ${type} to your account`}
    >
      {getIcon()}
      <span>{getButtonText()}</span>
    </button>
  );
};

export default SaveButton;
