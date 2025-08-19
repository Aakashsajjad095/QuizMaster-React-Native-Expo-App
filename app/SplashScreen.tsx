import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, Typography } from '../src/constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SplashScreen = () => {
  const [logoAnim] = useState(new Animated.Value(0));
  const [textAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start animations sequence
    Animated.sequence([
      // Logo animation
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Text animation
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/LoginScreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: Animated.multiply(logoAnim, pulseAnim),
                  },
                  {
                    rotate: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.logoText}>🧠</Text>
          </Animated.View>

          {/* App Name */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textAnim,
                transform: [
                  {
                    translateY: textAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.appName}>QuizMaster</Text>
            <Text style={styles.tagline}>Challenge Your Mind</Text>
          </Animated.View>

          {/* Loading indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: textAnim,
              },
            ]}
          >
            <View style={styles.loadingDots}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        scale: pulseAnim,
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [1, 1.1],
                          outputRange: [1.1, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        scale: pulseAnim,
                      },
                    ],
                  },
                ]}
              />
            </View>
          </Animated.View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
  },
  logoContainer: {
    marginBottom: hp('4%'),
  },
  logoText: {
    fontSize: wp('25%'),
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: hp('8%'),
  },
  appName: {
    fontSize: wp('10%'),
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp('1%'),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: wp('4%'),
    fontFamily: Typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: 1,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: hp('10%'),
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('1.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: wp('1%'),
  },
});

export default SplashScreen;