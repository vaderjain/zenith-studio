/**
 * Mock User Profile with company context
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  companyName: string;
  companyDomain: string;
  role: string;
  preferences: {
    relevanceBoost: boolean;
    emailNotifications: boolean;
    signalAlerts: boolean;
  };
}

export const currentUser: UserProfile = {
  id: "user_1",
  email: "sarah@cloudsync.io",
  name: "Sarah Chen",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  companyName: "CloudSync",
  companyDomain: "cloudsync.io",
  role: "Head of Sales",
  preferences: {
    relevanceBoost: true,
    emailNotifications: true,
    signalAlerts: true,
  },
};

export function getCurrentUser(): UserProfile {
  return currentUser;
}

export function updateUserPreferences(
  preferences: Partial<UserProfile["preferences"]>
): UserProfile {
  Object.assign(currentUser.preferences, preferences);
  return currentUser;
}
