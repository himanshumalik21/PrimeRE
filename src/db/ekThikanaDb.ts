import Dexie, { type Table } from 'dexie';
import type { CommunityRentalPost, PostComment, ChatMessage } from '../types/property';

export interface DbUser {
  id: string;
  phone: string;
  email: string;
  name: string;
  avatar: string;
  role: 'Working Professional' | 'Direct Landlord' | 'Verified Roommate' | 'Owner';
  profession?: string;
  workplace?: string;
  isPhoneVerified: boolean;
  savedPostIds: string[];
  createdAt: string;
}

export class EkThikanaDatabase extends Dexie {
  users!: Table<DbUser, string>;
  posts!: Table<CommunityRentalPost, string>;
  comments!: Table<PostComment, string>;
  chatMessages!: Table<ChatMessage, string>;

  constructor() {
    super('ekThikana_opensource_db');
    this.version(1).stores({
      users: 'id, phone, email, name, isPhoneVerified, createdAt',
      posts: 'id, title, author.id, monthlyRent, locality, region, bhk, rentalCategory, createdAt',
      comments: 'id, authorId, timestamp',
      chatMessages: 'id, threadId, senderId, timestamp',
    });
  }
}

export const db = new EkThikanaDatabase();

// Default demo user seeded into IndexedDB
export const INITIAL_USER: DbUser = {
  id: 'user-rohan-mehta',
  phone: '+91 98101 44520',
  email: 'rohan.mehta@delhincr.in',
  name: 'Rohan Mehta',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'Working Professional',
  profession: 'Senior Product Manager',
  workplace: 'DLF Cyber City, Gurugram',
  isPhoneVerified: true,
  savedPostIds: [],
  createdAt: new Date().toISOString(),
};

// Database helper functions
export const initOpenSourceDb = async (): Promise<void> => {
  try {
    const existing = await db.users.get(INITIAL_USER.id);
    if (!existing) {
      await db.users.add(INITIAL_USER);
    }
  } catch (err) {
    console.warn('IndexedDB initial setup notice:', err);
  }
};

export const saveUserToDb = async (user: DbUser): Promise<void> => {
  await db.users.put(user);
};

export const getUserByPhoneFromDb = async (phone: string): Promise<DbUser | undefined> => {
  return await db.users.where('phone').equals(phone).first();
};

export const getUserByIdFromDb = async (id: string): Promise<DbUser | undefined> => {
  return await db.users.get(id);
};
