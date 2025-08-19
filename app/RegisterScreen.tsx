import React, { useState, useEffect, useRef } from 'react';
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
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, Typography } from '../src/constants/theme';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(50)).current;
  const loadingRotation = useRef(new Animated.Value(0)).current;
  const loadingScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(formAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Loading animation
  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(loadingRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(loadingScale, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(loadingScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  };

  const stopLoadingAnimation = () => {
    loadingRotation.stopAnimation();
    loadingScale.stopAnimation();
    progressAnim.setValue(0);
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    startLoadingAnimation();
    
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

    // Simulate registration process
    setTimeout(() => {
      stopLoadingAnimation();
      setIsLoading(false);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/Home') }
      ]);
    }, 2000);
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput('');
  };

  const navigateToLogin = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: headerAnim,
                transform: [{ translateY: Animated.multiply(headerAnim, -20) }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={navigateToLogin}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.headerSpacer} />
          </Animated.View>

          <KeyboardAvoidingView 
            style={styles.keyboardContainer} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Welcome Section */}
              <Animated.View
                style={[
                  styles.welcomeSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                  },
                ]}
              >
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={['#ff6b6b', '#ee5a24', '#ff9ff3']}
                    style={styles.logoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.logo}>🧠</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.title}>Join QuizMaster</Text>
                <Text style={styles.subtitle}>Create your account and start your learning journey</Text>
              </Animated.View>

              {/* Form */}
              <Animated.View 
                style={[
                  styles.form,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: formAnim }]
                  }
                ]}
              >
                {/* Full Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'fullName' && styles.inputWrapperFocused
                  ]}>
                    <View style={styles.inputIconContainer}>
                      <MaterialIcons name="person-outline" size={22} color={focusedInput === 'fullName' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={fullName}
                      onChangeText={setFullName}
                      onFocus={() => handleInputFocus('fullName')}
                      onBlur={handleInputBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'email' && styles.inputWrapperFocused
                  ]}>
                    <View style={styles.inputIconContainer}>
                      <MaterialIcons name="email" size={22} color={focusedInput === 'email' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email address"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => handleInputFocus('email')}
                      onBlur={handleInputBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'password' && styles.inputWrapperFocused
                  ]}>
                    <View style={styles.inputIconContainer}>
                      <MaterialIcons name="lock-outline" size={22} color={focusedInput === 'password' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a strong password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => handleInputFocus('password')}
                      onBlur={handleInputBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                        size={22} 
                        color="rgba(255, 255, 255, 0.7)" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'confirmPassword' && styles.inputWrapperFocused
                  ]}>
                    <View style={styles.inputIconContainer}>
                      <MaterialIcons name="lock-outline" size={22} color={focusedInput === 'confirmPassword' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => handleInputFocus('confirmPassword')}
                      onBlur={handleInputBlur}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} 
                        size={22} 
                        color="rgba(255, 255, 255, 0.7)" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Terms and Conditions */}
                <TouchableOpacity 
                  style={styles.termsContainer}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                    {agreeToTerms && (
                      <AntDesign name="check" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms & Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>

                {/* Register Button */}
                <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
                  <TouchableOpacity
                    style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={isLoading ? ['#999', '#666'] : ['#ff6b6b', '#ee5a24', '#ff9ff3']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View
                            style={{
                              transform: [
                                {
                                  rotate: loadingRotation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                  }),
                                },
                                { scale: loadingScale },
                              ],
                            }}
                          >
                            <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
                          </Animated.View>
                          <Text style={styles.buttonText}>Creating Account...</Text>
                          <View style={styles.progressBar}>
                            <Animated.View
                              style={[
                                styles.progressFill,
                                {
                                  width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                  }),
                                },
                              ]}
                            />
                          </View>
                        </View>
                      ) : (
                        <View style={styles.buttonContent}>
                          <MaterialIcons name="person-add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                          <Text style={styles.buttonText}>Create Account</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                {/* Social Register */}
                <View style={styles.socialContainer}>
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                      <AntDesign name="google" size={24} color="#DB4437" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                      <AntDesign name="apple1" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                      <AntDesign name="facebook-square" size={24} color="#4267B2" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={navigateToLogin} activeOpacity={0.8}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    fontSize: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrapperFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0.2,
  },
  inputIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 8,
    marginRight: -8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  registerButton: {
    marginBottom: 30,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  progressBar: {
    width: 120,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  socialContainer: {
    marginBottom: 30,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  loginText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;