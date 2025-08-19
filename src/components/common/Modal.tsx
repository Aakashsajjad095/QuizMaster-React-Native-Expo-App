import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal as RNModal,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width: _SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'center' | 'bottom' | 'top' | 'fullscreen';
  animationType?: 'fade' | 'slide' | 'none';
  backdropOpacity?: number;
  closeOnBackdropPress?: boolean;
  closeOnBackButton?: boolean;
  style?: ViewStyle;
  backdropStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  testID?: string;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  variant = 'center',
  animationType = 'fade',
  backdropOpacity = 0.5,
  closeOnBackdropPress = true,
  closeOnBackButton = true,
  style,
  backdropStyle,
  contentStyle,
  testID,
}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, animationType, fadeAnim, slideAnim]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible && closeOnBackButton) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, closeOnBackButton, onClose]);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (variant) {
      case 'bottom':
        baseStyle.justifyContent = 'flex-end';
        break;
      case 'top':
        baseStyle.justifyContent = 'flex-start';
        baseStyle.paddingTop = insets.top;
        break;
      case 'fullscreen':
        baseStyle.justifyContent = 'flex-start';
        break;
      default: // 'center'
        break;
    }

    return baseStyle;
  };

  const getContentStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: Colors.backgroundPrimary,
      ...Shadows.large,
    };

    switch (variant) {
      case 'bottom':
        baseStyle.width = '100%';
        baseStyle.borderTopLeftRadius = BorderRadius.xl;
        baseStyle.borderTopRightRadius = BorderRadius.xl;
        baseStyle.paddingBottom = insets.bottom;
        baseStyle.maxHeight = SCREEN_HEIGHT * 0.9;
        break;
      case 'top':
        baseStyle.width = '100%';
        baseStyle.borderBottomLeftRadius = BorderRadius.xl;
        baseStyle.borderBottomRightRadius = BorderRadius.xl;
        baseStyle.maxHeight = SCREEN_HEIGHT * 0.9;
        break;
      case 'fullscreen':
        baseStyle.width = '100%';
        baseStyle.height = '100%';
        baseStyle.borderRadius = 0;
        break;
      default: // 'center'
        baseStyle.borderRadius = BorderRadius.xl;
        baseStyle.marginHorizontal = Spacing.lg;
        baseStyle.maxWidth = wp('90%');
        baseStyle.maxHeight = hp('80%');
        break;
    }

    return baseStyle;
  };

  const getAnimatedStyle = () => {
    if (animationType === 'fade') {
      return {
        opacity: fadeAnim,
      };
    } else if (animationType === 'slide') {
      let translateY = 0;
      switch (variant) {
        case 'bottom':
          translateY = slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [SCREEN_HEIGHT, 0],
          }) as unknown as number;
          break;
        case 'top':
          translateY = slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-SCREEN_HEIGHT, 0],
          }) as unknown as number;
          break;
        default:
          translateY = slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }) as unknown as number;
          break;
      }
      return {
        transform: [{ translateY: translateY as unknown as number }],
        opacity: slideAnim,
      };
    }
    return {};
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      testID={testID}
    >
      <View style={[styles.overlay, style]}>
        <TouchableOpacity
          style={[
            styles.backdrop,
            {
              backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
            },
            backdropStyle,
          ]}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />
        
        <View style={getContainerStyle()} pointerEvents="box-none">
          <Animated.View
            style={[
              getContentStyle(),
              contentStyle,
              getAnimatedStyle(),
            ]}
          >
            {children}
          </Animated.View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Modal;