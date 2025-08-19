import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, Typography } from '../src/constants/theme';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [buttonPulse] = useState(new Animated.Value(1));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Animate button
    Animated.sequence([
      Animated.timing(buttonPulse, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPulse, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/Home');
    }, 1500);
  };

  const navigateToRegister = () => {
    router.push('/RegisterScreen');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>🧠</Text>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue your quiz journey</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <AntDesign name="mail" size={wp('5%')} color={Colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <AntDesign name="lock" size={wp('5%')} color={Colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather 
                      name={showPassword ? 'eye' : 'eye-off'} 
                      size={wp('5%')} 
                      color="rgba(255, 255, 255, 0.7)" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={isLoading ? ['#ccc', '#999'] : ['#ff6b6b', '#ee5a24']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.buttonText}>Signing In...</Text>
                      </View>
                    ) : (
                      <Text style={styles.buttonText}>Sign In</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <AntDesign name="google" size={wp('6%')} color="#DB4437" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <AntDesign name="apple1" size={wp('6%')} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <AntDesign name="facebook-square" size={wp('6%')} color="#4267B2" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: hp('5%'),
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('8%'),
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: hp('5%'),
  },
  logo: {
    fontSize: wp('15%'),
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: wp('8%'),
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp('1%'),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: wp('4%'),
    fontFamily: Typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: hp('2.5%'),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('4%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIcon: {
    marginRight: wp('3%'),
  },
  input: {
    flex: 1,
    fontSize: wp('4%'),
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  eyeIcon: {
    padding: wp('1%'),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: hp('3%'),
  },
  forgotPasswordText: {
    fontSize: wp('3.5%'),
    fontFamily: Typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loginButton: {
    marginBottom: hp('3%'),
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: hp('2%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: wp('4.5%'),
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialContainer: {
    marginBottom: hp('3%'),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontSize: wp('3.5%'),
    fontFamily: Typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: wp('4%'),
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp('4%'),
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: wp('4%'),
    fontFamily: Typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  registerLink: {
    fontSize: wp('4%'),
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;