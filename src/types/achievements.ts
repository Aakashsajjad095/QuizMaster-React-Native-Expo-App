export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: {
    type: 'quizzes_completed' | 'perfect_scores' | 'streak_days' | 'total_score' | 'category_master';
    target: number;
    category?: string;
  };
  unlockedAt?: Date;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievements {
  achievements: Achievement[];
  totalUnlocked: number;
  recentlyUnlocked: Achievement[];
}

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlockedAt' | 'isUnlocked'>[] = [
  {
    id: 'first_quiz',
    title: 'Getting Started',
    description: 'Complete your first quiz',
    icon: 'play-circle',
    condition: { type: 'quizzes_completed', target: 1 },
    rarity: 'common'
  },
  {
    id: 'quiz_enthusiast',
    title: 'Quiz Enthusiast',
    description: 'Complete 10 quizzes',
    icon: 'trophy',
    condition: { type: 'quizzes_completed', target: 10 },
    rarity: 'common'
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: 'star',
    condition: { type: 'quizzes_completed', target: 50 },
    rarity: 'rare'
  },
  {
    id: 'quiz_legend',
    title: 'Quiz Legend',
    description: 'Complete 100 quizzes',
    icon: 'crown',
    condition: { type: 'quizzes_completed', target: 100 },
    rarity: 'epic'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get 5 perfect scores',
    icon: 'checkmark-circle',
    condition: { type: 'perfect_scores', target: 5 },
    rarity: 'rare'
  },
  {
    id: 'streak_starter',
    title: 'Streak Starter',
    description: 'Maintain a 3-day streak',
    icon: 'flame',
    condition: { type: 'streak_days', target: 3 },
    rarity: 'common'
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: 'bonfire',
    condition: { type: 'streak_days', target: 7 },
    rarity: 'rare'
  },
  {
    id: 'science_expert',
    title: 'Science Expert',
    description: 'Complete 20 Science quizzes',
    icon: 'flask',
    condition: { type: 'category_master', target: 20, category: 'Science' },
    rarity: 'rare'
  },
  {
    id: 'history_buff',
    title: 'History Buff',
    description: 'Complete 20 History quizzes',
    icon: 'library',
    condition: { type: 'category_master', target: 20, category: 'History' },
    rarity: 'rare'
  },
  {
    id: 'math_genius',
    title: 'Math Genius',
    description: 'Complete 20 Math quizzes',
    icon: 'calculator',
    condition: { type: 'category_master', target: 20, category: 'Math' },
    rarity: 'rare'
  },
  {
    id: 'geography_explorer',
    title: 'Geography Explorer',
    description: 'Complete 20 Geography quizzes',
    icon: 'globe',
    condition: { type: 'category_master', target: 20, category: 'Geography' },
    rarity: 'rare'
  },
  {
    id: 'sports_fanatic',
    title: 'Sports Fanatic',
    description: 'Complete 20 Sports quizzes',
    icon: 'football',
    condition: { type: 'category_master', target: 20, category: 'Sports' },
    rarity: 'rare'
  },
  {
    id: 'tech_wizard',
    title: 'Tech Wizard',
    description: 'Complete 20 Technology quizzes',
    icon: 'laptop',
    condition: { type: 'category_master', target: 20, category: 'Technology' },
    rarity: 'rare'
  },
  {
    id: 'ultimate_champion',
    title: 'Ultimate Champion',
    description: 'Reach 10,000 total points',
    icon: 'medal',
    condition: { type: 'total_score', target: 10000 },
    rarity: 'legendary'
  }
];