export type UserRole = 'admin' | 'client';

export interface UserProfile {
  id: string;
  role: UserRole;
}
