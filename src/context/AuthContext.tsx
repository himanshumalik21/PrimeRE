import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types/property';
import { 
  INITIAL_USER, 
  initOpenSourceDb, 
  saveUserToDb, 
  type DbUser 
} from '../db/ekThikanaDb';
import { 
  sendPhoneOtp, 
  verifyPhoneOtp, 
  registerNewUserWithPhone 
} from '../services/phoneAuthService';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; demoOtp: string }>;
  verifyOtpAndLogin: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser?: boolean; message: string }>;
  completeRegistration: (phone: string, name: string, email: string, profession?: string, workplace?: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  toggleSaveProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
  toggleCompareProperty: (propertyId: string) => void;
  isPropertyCompared: (propertyId: string) => boolean;
  clearComparedProperties: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ekthikana_active_user');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      id: INITIAL_USER.id,
      name: INITIAL_USER.name,
      email: INITIAL_USER.email,
      phone: INITIAL_USER.phone,
      avatar: INITIAL_USER.avatar,
      role: INITIAL_USER.role,
      profession: INITIAL_USER.profession,
      workplace: INITIAL_USER.workplace,
      isPhoneVerified: true,
      savedPropertyIds: [],
      comparedPropertyIds: [],
      myListingsCount: 1,
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('ekthikana_is_authenticated');
    return saved ? JSON.parse(saved) : true;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize open-source IndexedDB
  useEffect(() => {
    initOpenSourceDb();
  }, []);

  // Save session state to localStorage
  useEffect(() => {
    localStorage.setItem('ekthikana_active_user', JSON.stringify(user));
    localStorage.setItem('ekthikana_is_authenticated', JSON.stringify(isAuthenticated));
  }, [user, isAuthenticated]);

  const sendOtp = async (phone: string) => {
    return await sendPhoneOtp(phone);
  };

  const verifyOtpAndLogin = async (phone: string, otp: string) => {
    const result = await verifyPhoneOtp(phone, otp);
    if (result.success && result.user) {
      const dbUser = result.user;
      const profile: UserProfile = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        avatar: dbUser.avatar,
        role: dbUser.role,
        profession: dbUser.profession,
        workplace: dbUser.workplace,
        isPhoneVerified: true,
        savedPropertyIds: dbUser.savedPostIds || [],
        comparedPropertyIds: [],
        myListingsCount: 0,
      };
      setUser(profile);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
    }
    return result;
  };

  const completeRegistration = async (
    phone: string,
    name: string,
    email: string,
    profession?: string,
    workplace?: string
  ) => {
    const newUser = await registerNewUserWithPhone(phone, name, email, profession, workplace);
    const profile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      avatar: newUser.avatar,
      role: newUser.role,
      profession: newUser.profession,
      workplace: newUser.workplace,
      isPhoneVerified: true,
      savedPropertyIds: [],
      comparedPropertyIds: [],
      myListingsCount: 0,
    };
    setUser(profile);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser({
      id: 'guest',
      name: 'Guest User',
      email: '',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'Working Professional',
      isPhoneVerified: false,
      savedPropertyIds: [],
      comparedPropertyIds: [],
      myListingsCount: 0,
    });
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      const dbUser: DbUser = {
        id: updated.id,
        phone: updated.phone,
        email: updated.email,
        name: updated.name,
        avatar: updated.avatar,
        role: updated.role,
        profession: updated.profession,
        workplace: updated.workplace,
        isPhoneVerified: updated.isPhoneVerified,
        savedPostIds: updated.savedPropertyIds,
        createdAt: new Date().toISOString(),
      };
      saveUserToDb(dbUser);
      return updated;
    });
  };

  const toggleSaveProperty = (propertyId: string) => {
    setUser(prev => {
      const exists = prev.savedPropertyIds.includes(propertyId);
      const newSaved = exists
        ? prev.savedPropertyIds.filter(id => id !== propertyId)
        : [...prev.savedPropertyIds, propertyId];
      return { ...prev, savedPropertyIds: newSaved };
    });
  };

  const isPropertySaved = (propertyId: string) => {
    return user.savedPropertyIds.includes(propertyId);
  };

  const toggleCompareProperty = (propertyId: string) => {
    setUser(prev => {
      const exists = prev.comparedPropertyIds.includes(propertyId);
      let newCompared: string[];
      if (exists) {
        newCompared = prev.comparedPropertyIds.filter(id => id !== propertyId);
      } else {
        if (prev.comparedPropertyIds.length >= 4) {
          newCompared = [...prev.comparedPropertyIds.slice(1), propertyId];
        } else {
          newCompared = [...prev.comparedPropertyIds, propertyId];
        }
      }
      return { ...prev, comparedPropertyIds: newCompared };
    });
  };

  const isPropertyCompared = (propertyId: string) => {
    return user.comparedPropertyIds.includes(propertyId);
  };

  const clearComparedProperties = () => {
    setUser(prev => ({ ...prev, comparedPropertyIds: [] }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        sendOtp,
        verifyOtpAndLogin,
        completeRegistration,
        logout,
        updateUserProfile,
        toggleSaveProperty,
        isPropertySaved,
        toggleCompareProperty,
        isPropertyCompared,
        clearComparedProperties,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
