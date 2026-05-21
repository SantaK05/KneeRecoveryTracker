import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home:           undefined;
  ExerciseList:   undefined;
  ExerciseDetail: { exerciseIndex: number };
  Feedback:       undefined;
};

export type HistoryStackParamList = {
  History:       undefined;
  SessionDetail: { sessionId: string };
};

export type RootTabParamList = {
  HomeTab:    NavigatorScreenParams<HomeStackParamList>;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
};
