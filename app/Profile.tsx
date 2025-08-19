import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useRef, useEffect } from "react";
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import StreakCounter from '../src/components/StreakCounter';
import ProfileStreakCounter from '../src/components/ProfileStreakCounter';
import AnalyticsCard from '../src/components/AnalyticsCard';

import { useAppDispatch, useAppSelector } from "../src/redux/store";
import { logout } from "../src/redux/slices/authSlice";
import useResults from "../src/hooks/useResults";
import { ProfileScreenNavigationProp } from "../src/types/navigation";
import { RootState } from "../src/redux/store";
import { Colors } from "../src/constants/theme";
import { useTheme } from "../src/contexts/ThemeContext";

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const { quizResults } = useAppSelector((state) => state.game);
  const { getOverallStatistics } = useResults();
  const { theme, effectiveTheme, setTheme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;

  const overallStats = useMemo(() => {
    return getOverallStatistics(quizResults);
  }, [quizResults, getOverallStatistics]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this cool Quiz App!",
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong while sharing.");
    }
  };

  const handleContact = () => {
    Linking.openURL("mailto:support@quizapp.com");
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Choose Theme',
      'Select your preferred theme',
      [
        { text: 'Light', onPress: () => setTheme('light') },
        { text: 'Dark', onPress: () => setTheme('dark') },
        { text: 'System', onPress: () => setTheme('system') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
        return 'phone-portrait';
      default:
        return 'sunny';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Theme';
      case 'dark':
        return 'Dark Theme';
      case 'system':
        return 'System Theme';
      default:
        return 'Light Theme';
    }
  };

  // Animation effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Image picker functionality
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture.');
      return;
    }

    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      animateAvatarChange();
      // Here you would typically update the user's avatar in your backend/state
      console.log('New image:', result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      animateAvatarChange();
      // Here you would typically update the user's avatar in your backend/state
      console.log('New image:', result.assets[0].uri);
    }
  };

  const animateAvatarChange = () => {
    Animated.sequence([
      Animated.timing(avatarScale, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(avatarScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerSpacer} />
          </View>
          
        
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Animated.View 
              style={[
                styles.profileHeader,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={handleImagePicker}
                activeOpacity={0.8}
              >
                <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
                  <Image
                    source={{ uri: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" }}
                    style={styles.avatar}
                  />
                  <View style={styles.avatarBorder} />
                  <View style={styles.editIconContainer}>
                    <AntDesign name="camera" size={16} color="#FFFFFF" />
                  </View>
                </Animated.View>
              </TouchableOpacity>
              <Animated.Text 
                style={[
                  styles.username,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                {user?.name || "John Doe"}
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.email,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                {user?.email || "john.doe@example.com"}
              </Animated.Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >

  {/* Profile Streak Counter */}
          <ProfileStreakCounter />

              <Animated.View 
                style={[
                  styles.statsContainer,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                <Animated.View 
                  style={[
                    styles.statCard,
                    { transform: [{ translateY: slideAnim }] }
                  ]}
                >
                  <Text style={styles.statValue}>{overallStats.totalQuizzes}</Text>
                  <Text style={styles.statLabel}>Quizzes Played</Text>
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.statCard,
                    { transform: [{ translateY: slideAnim }] }
                  ]}
                >
                  <Text style={styles.statValue}>{
                    overallStats.averageScore.toFixed(2)
                  }</Text>
                  <Text style={styles.statLabel}>Average Score</Text>
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.statCard,
                    { transform: [{ translateY: slideAnim }] }
                  ]}
                >
                  <Text style={styles.statValue}>{
                    overallStats.passRate.toFixed(2)
                  }%</Text>
                  <Text style={styles.statLabel}>Pass Rate</Text>
                </Animated.View>
               
              </Animated.View>

              {/* Analytics Section */}
              <Animated.View style={[styles.analyticsSection, { transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.sectionTitle}>Performance Insights</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.analyticsScrollContainer}
                  style={styles.analyticsScrollView}
                >
                  <AnalyticsCard type="performance" style={styles.wideAnalyticsCard} />
                  <AnalyticsCard type="category" style={styles.wideAnalyticsCard} />
                  <AnalyticsCard type="difficulty" style={styles.wideAnalyticsCard} />
                  <AnalyticsCard type="time" style={styles.wideAnalyticsCard} />
                </ScrollView>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.menuContainer,
                  { opacity: fadeAnim }
                ]}
              >
                <Animated.View
                  style={[
                    styles.menuItem,
                    { transform: [{ translateX: slideAnim }] }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.menuItemTouchable}
                    onPress={() => navigation.navigate("EditProfile")}
                  >
                    <View style={styles.menuIconContainer}>
                      <AntDesign name="edit" size={24} color="#667eea" />
                    </View>
                    <Text style={styles.menuItemText}>Edit Profile</Text>
                    <AntDesign name="right" size={16} color="#999" />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.menuItem,
                    { transform: [{ translateX: slideAnim }] }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.menuItemTouchable}
                    onPress={() => navigation.navigate("Achievements")}
                  >
                    <View style={styles.menuIconContainer}>
                      <Ionicons name="trophy" size={24} color="#667eea" />
                    </View>
                    <Text style={styles.menuItemText}>Achievements</Text>
                    <AntDesign name="right" size={16} color="#999" />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.menuItem,
                    { transform: [{ translateX: slideAnim }] }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.menuItemTouchable}
                    onPress={() => navigation.navigate("Settings")}
                  >
                    <View style={styles.menuIconContainer}>
                      <AntDesign name="setting" size={24} color="#667eea" />
                    </View>
                    <Text style={styles.menuItemText}>Settings</Text>
                    <AntDesign name="right" size={16} color="#999" />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.menuItem,
                    { transform: [{ translateX: slideAnim }] }
                  ]}
                >
                  <TouchableOpacity style={styles.menuItemTouchable} onPress={handleThemeChange}>
                    <View style={styles.menuIconContainer}>
                      <Ionicons name={getThemeIcon()} size={24} color="#667eea" />
                    </View>
                    <Text style={styles.menuItemText}>{getThemeLabel()}</Text>
                    <AntDesign name="right" size={16} color="#999" />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.menuItem,
                    { transform: [{ translateX: slideAnim }] }
                  ]}
                >
                  <TouchableOpacity style={styles.menuItemTouchable} onPress={handleShare}>
                    <View style={styles.menuIconContainer}>
                      <FontAwesome name="share-alt" size={24} color="#667eea" />
                    </View>
                    <Text style={styles.menuItemText}>Share with Friends</Text>
                    <AntDesign name="right" size={16} color="#999" />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.menuItem,
                    { transform: [{ translateX: slideAnim }] }
                  ]}
                >
                  <TouchableOpacity style={styles.menuItemTouchable} onPress={handleContact}>
                    <View style={styles.menuIconContainer}>
                      <AntDesign name="customerservice" size={24} color="#667eea" />
                    </View>
                    <Text style={styles.menuItemText}>Contact Support</Text>
                    <AntDesign name="right" size={16} color="#999" />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.menuItem,
                    { transform: [{ translateX: slideAnim }] }
                  ]}
                >
                  <TouchableOpacity style={styles.menuItemTouchable} onPress={handleLogout}>
                    <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
                      <Feather name="log-out" size={24} color="#FF4757" />
                    </View>
                    <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                    <AntDesign name="right" size={16} color="#999" />
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
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
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarBorder: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp('4%'),
    paddingHorizontal: wp('3%'),
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#F8F9FA',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('4%'),
    marginHorizontal: wp('1%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: hp('10%'),
    justifyContent: 'center',
  },
  statValue: {
    fontSize: wp('5.5%'),
    fontWeight: "bold",
    color: '#667eea',
    marginBottom: hp('0.5%'),
    textAlign: 'center',
  },
  statLabel: {
    fontSize: wp('3%'),
    color: '#666',
    textAlign: 'center',
    flexShrink: 1,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  menuItemTouchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  menuIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoutIconContainer: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logoutText: {
    color: '#FF4757',
  },
  analyticsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  analyticsScrollView: {
    marginHorizontal: -wp('4%'),
  },
  analyticsScrollContainer: {
    paddingHorizontal: wp('4%'),
    gap: wp('3%'),
  },
  wideAnalyticsCard: {
    width: wp('70%'),
    marginRight: wp('3%'),
  },
});