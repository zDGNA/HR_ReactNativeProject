import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';


export type RootStackParamList = {
  LoginScreen: undefined;
  Main: undefined;
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
export interface Employee {
  id: number;
  name: string;
  position: string;
  status: 'Active' | 'Inactive';
  age: number;
  email: string;
  phone: string;
  address: string;
  contract_end: string;
}

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;