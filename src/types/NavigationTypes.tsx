import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// 1. Tentukan semua rute dan parameter yang mereka terima
export type RootStackParamList = {
  LoginScreen: undefined;
  Main: undefined;// Tidak ada parameter yang dilewatkan
};

export type MainTabParamList = {
  Home: undefined;
  Contact: { source?: string };
  Profile: undefined;
  HomeScreen: undefined;
  Departemen: { selectedDept?: any };
  Employee: {
    departmentId: string;
    departmentName: string;
    departmentIcon?: string;
    departmentColor?: string;
  } | undefined;

}

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;