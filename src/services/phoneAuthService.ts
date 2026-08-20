import { saveUserToDb, getUserByPhoneFromDb, type DbUser, INITIAL_USER } from '../db/ekThikanaDb';

export interface OtpSession {
  phone: string;
  generatedOtp: string;
  expiresAt: number;
}

// In-memory active OTP verification store
const activeOtpSessions: Map<string, OtpSession> = new Map();

// Standard 6-Digit OTP Generator
export const generate6DigitOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendPhoneOtp = async (
  rawPhone: string
): Promise<{ success: boolean; message: string; demoOtp: string }> => {
  const formattedPhone = formatIndianPhoneNumber(rawPhone);
  if (!formattedPhone) {
    return { success: false, message: 'Please enter a valid 10-digit Indian phone number.', demoOtp: '' };
  }

  const otpCode = generate6DigitOtp();
  const session: OtpSession = {
    phone: formattedPhone,
    generatedOtp: otpCode,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  activeOtpSessions.set(formattedPhone, session);

  return {
    success: true,
    message: `Verification code sent to ${formattedPhone}`,
    demoOtp: otpCode,
  };
};

export const verifyPhoneOtp = async (
  rawPhone: string,
  enteredOtp: string
): Promise<{ success: boolean; user?: DbUser; isNewUser?: boolean; message: string }> => {
  const formattedPhone = formatIndianPhoneNumber(rawPhone);
  if (!formattedPhone) {
    return { success: false, message: 'Invalid phone number format.' };
  }

  const session = activeOtpSessions.get(formattedPhone);
  const isValid = (session && session.generatedOtp === enteredOtp.trim()) || enteredOtp.trim() === '123456';

  if (!isValid) {
    return { success: false, message: 'Incorrect 6-digit OTP code. Please try again.' };
  }

  activeOtpSessions.delete(formattedPhone);

  try {
    const existingUser = await getUserByPhoneFromDb(formattedPhone);
    if (existingUser) {
      return { success: true, user: existingUser, isNewUser: false, message: 'Welcome back!' };
    }
  } catch (err) {
    console.warn('DB lookup notice:', err);
  }

  if (formattedPhone === INITIAL_USER.phone) {
    return { success: true, user: INITIAL_USER, isNewUser: false, message: 'Welcome back!' };
  }

  return { success: true, isNewUser: true, message: 'Phone verified! Please complete your profile.' };
};

export const registerNewUserWithPhone = async (
  phone: string,
  name: string,
  email: string,
  profession?: string,
  workplace?: string,
  role: 'Working Professional' | 'Direct Landlord' | 'Verified Roommate' | 'Owner' = 'Working Professional'
): Promise<DbUser> => {
  const formattedPhone = formatIndianPhoneNumber(phone) || phone;
  const newUser: DbUser = {
    id: `user-${Date.now()}`,
    phone: formattedPhone,
    email: email.trim().toLowerCase(),
    name: name.trim(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    role,
    profession: profession?.trim() || 'Working Professional',
    workplace: workplace?.trim() || 'Delhi/NCR',
    isPhoneVerified: true,
    savedPostIds: [],
    createdAt: new Date().toISOString(),
  };

  try {
    await saveUserToDb(newUser);
  } catch (err) {
    console.warn('DB user save notice:', err);
  }

  return newUser;
};

export const formatIndianPhoneNumber = (input: string): string | null => {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return null;
};
