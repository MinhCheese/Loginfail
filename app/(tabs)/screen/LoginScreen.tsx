import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet,Alert } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword, getAuth, signInWithCredential, FacebookAuthProvider, GoogleAuthProvider} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../index';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Google Sign-In
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '814932420157-a8046j972o51n8jfqoeqv7oop212u7op.apps.googleusercontent.com', 
  });
   // Facebook OAuth Config
   const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: '837453645258944', 
    redirectUri: AuthSession.makeRedirectUri(),
  });
  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(FIREBASE_AUTH, credential); // Sử dụng Firebase để đăng nhập
        Alert.alert('Đăng nhập thành công với Google!');
        navigation.navigate('Welcome'); // Điều hướng sau khi đăng nhập thành công
      }
    } catch (error:any) {
      Alert.alert('Đăng nhập Google thất bại', error.message);
    }
  };
  
  React.useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { access_token } = fbResponse.params;
      const credential = FacebookAuthProvider.credential(access_token);
  
      signInWithCredential(FIREBASE_AUTH, credential)
        .then(() => {
          // Điều hướng đến trang chủ sau khi đăng nhập thành công
          navigation.navigate('Welcome');
        })
        .catch((error) => {
          console.error('Lỗi khi đăng nhập bằng Facebook:', error);
          setErrorMessage(error.message);
        });
    }
  }, [fbResponse]);
  

  type CustomFacebookLoginResult = {
    type: 'success' | 'cancel' | 'error';
    token?: string; // Use optional chaining for token
    expiration?: Date;
};

const handleFacebookLogin = async () => {
  try {
    const result = await fbPromptAsync();
    if (result?.type === 'success') {
      const { access_token } = result.params;
      const credential = FacebookAuthProvider.credential(access_token);
      await signInWithCredential(FIREBASE_AUTH, credential);

      // Facebook login success, navigate to Welcome screen
      Alert.alert('Đăng nhập thành công với Facebook!');
      navigation.navigate('Welcome');  // Ensure 'Welcome' is a valid route in your navigation
    }
  } catch (error: any) {
    Alert.alert('Đăng nhập Facebook thất bại', error.message);
  }
};


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      setErrorMessage('');
      setPassword('');
      navigation.navigate('Welcome');
    } catch (error: any) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Tài khoản không tồn tại';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu không chính xác';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Tài khoản hoặc mật khẩu không chính xác';
          break;
        default:
          errorMessage = 'Lỗi không xác định';
      }
      setErrorMessage(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#4285F4' }]} onPress={handleGoogleLogin}>
        <Ionicons name="logo-google" size={24} color="#ffffff" />
        
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#3B5998' }]} onPress={handleFacebookLogin} disabled={!fbRequest}>
        <Ionicons name="logo-facebook" size={24} color="#ffffff" />
        
      </TouchableOpacity>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Đăng Ký Tài Khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Quên Mật Khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa', // Light background color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#00796b', // Title color
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    borderColor: '#00796b', // Light green border
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputPassword: {
    flex: 1,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    borderColor: '#00796b', // Light green border
    borderWidth: 1,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#00796b', // Dark green color
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    textAlign: 'center',
    color: '#00796b',
    fontSize: 18,
    marginBottom: 10,
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#e57373', 
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LoginScreen;
