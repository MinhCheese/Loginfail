import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screen/LoginScreen';
import WelcomeScreen from './screen/WelcomeScreen';
import SignUpScreen from './screen/SignUpScreen';
import ForgotPasswordScreen from './screen/ForgotPasswordScreen'; // Import ForgotPasswordScreen

export type RootStackParamList = {
  Login: undefined;
  Welcome: undefined;
  SignUp: undefined;
  ForgotPassword: undefined; // Đã được khai báo
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
