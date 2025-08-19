import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define the parameter list for all screens in the stack
export type RootStackParamList = {
  Home: undefined;
  QuizList: {
    category?: string;
    difficulty?: string;
  };
  QuizGame: {
    quizId: string;
  };
  QuizResults: {
    quizId: string;
    score: number;
    totalQuestions: number;
  };
  Leaderboard: {
    type?: 'global' | 'local' | 'weekly' | 'monthly';
  };
  Profile: undefined;
  Achievements: undefined;
  EditProfile: undefined;
  Settings: undefined;
  QuizDetail: {
    quizId: string;
  };
  LiveQuiz: {
    liveQuizId: string;
  };
  Auth: undefined;
};

// Navigation prop types for each screen
export type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type QuizListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QuizList'>;
export type QuizGameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QuizGame'>;
export type QuizResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QuizResults'>;
export type LeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Leaderboard'>;
export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
export type AchievementsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Achievements'>;

// Route prop types for each screen
export type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type QuizListScreenRouteProp = RouteProp<RootStackParamList, 'QuizList'>;
export type QuizGameScreenRouteProp = RouteProp<RootStackParamList, 'QuizGame'>;
export type QuizResultsScreenRouteProp = RouteProp<RootStackParamList, 'QuizResults'>;
export type LeaderboardScreenRouteProp = RouteProp<RootStackParamList, 'Leaderboard'>;
export type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
export type AchievementsScreenRouteProp = RouteProp<RootStackParamList, 'Achievements'>;

// Combined navigation and route props
export type HomeProps = {
  navigation: HomeNavigationProp;
  route: HomeRouteProp;
};

export type QuizListScreenProps = {
  navigation: QuizListScreenNavigationProp;
  route: QuizListScreenRouteProp;
};

export type QuizGameScreenProps = {
  navigation: QuizGameScreenNavigationProp;
  route: QuizGameScreenRouteProp;
};

export type QuizResultsScreenProps = {
  navigation: QuizResultsScreenNavigationProp;
  route: QuizResultsScreenRouteProp;
};

export type LeaderboardScreenProps = {
  navigation: LeaderboardScreenNavigationProp;
  route: LeaderboardScreenRouteProp;
};

export type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
};

// Declare global navigation types for TypeScript