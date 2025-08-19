import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  size: number;
}

interface ConfettiAnimationProps {
  isVisible: boolean;
  duration?: number;
  pieceCount?: number;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  isVisible,
  duration = 3000,
  pieceCount = 50,
}) => {
  const confettiPieces = useRef<ConfettiPiece[]>([]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  useEffect(() => {
    // Initialize confetti pieces
    confettiPieces.current = Array.from({ length: pieceCount }, (_, index) => ({
      id: index,
      x: new Animated.Value(Math.random() * screenWidth),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
  }, [pieceCount]);

  useEffect(() => {
    if (isVisible) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [isVisible, duration]);

  const startAnimation = () => {
    const animations = confettiPieces.current.map((piece) => {
      const fallDuration = Math.random() * 1000 + 2000;
      const swayAmount = Math.random() * 100 + 50;
      const rotationAmount = Math.random() * 720 + 360;
      const initialX = Math.random() * screenWidth;

      // Set initial X position
      piece.x.setValue(initialX);

      return Animated.parallel([
        Animated.timing(piece.y, {
          toValue: screenHeight + 100,
          duration: fallDuration,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(piece.x, {
              toValue: initialX + swayAmount,
              duration: fallDuration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(piece.x, {
              toValue: initialX - swayAmount,
              duration: fallDuration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(piece.x, {
              toValue: initialX + swayAmount,
              duration: fallDuration / 4,
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1 }
        ),
        Animated.loop(
          Animated.timing(piece.rotation, {
            toValue: rotationAmount,
            duration: fallDuration,
            useNativeDriver: true,
          }),
          { iterations: -1 }
        ),
      ]);
    });

    animationRef.current = Animated.stagger(100, animations);
    animationRef.current.start();

    // Auto-stop after duration
    setTimeout(() => {
      stopAnimation();
    }, duration);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    // Reset positions
    confettiPieces.current.forEach((piece) => {
      piece.y.setValue(-50);
      piece.rotation.setValue(0);
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
});

export default ConfettiAnimation;