import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Question } from '../../types';
import { Card, ProgressBar } from '../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
    backgroundColor: Colors.background,
  },
  progressContainer: {
    marginBottom: hp('2%'),
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('4%'),
  },
  progressText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('3.5%'),
    color: Colors.primary,
    marginTop: hp('0.5%'),
    fontWeight: '600',
  },
  questionNumber: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('4%'),
    color: Colors.primary,
    marginBottom: hp('1%'),
    textAlign: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('5%'),
    alignSelf: 'center',
  },
  questionText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('5.2%'),
    color: '#1a1a1a',
    marginBottom: hp('3%'),
    lineHeight: wp('7%'),
    textAlign: 'center',
    paddingHorizontal: wp('2%'),
    fontWeight: '700',
  },

  questionContainer: {
    marginBottom: hp('3%'),
    backgroundColor: '#ffffff',
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
  },
  questionImage: {
    width: '100%',
    height: hp('20%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  answersContainer: {
    marginBottom: hp('2%'),
    gap: hp('1.5%'),
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: wp('4.5%'),
    borderRadius: wp('5%'),
    borderWidth: 2,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    minHeight: hp('8%'),
    transform: [{ scale: 1 }],
    overflow: 'hidden',
  },
  selectedAnswerOption: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  correctAnswerOption: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
    shadowColor: Colors.success,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  incorrectAnswerOption: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
    shadowColor: Colors.error,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  disabledAnswerOption: {
    opacity: 0.6,
  },
  answerOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  answerOptionTextContainer: {
    flex: 1,
  },
  answerOptionIcon: {
    marginLeft: wp('3%'),
  },
  // Animations
  fadeAnim: {
    opacity: new Animated.Value(0),
  },
  slideAnim: {
    transform: [{ translateX: new Animated.Value(0) }],
  },
  scaleAnim: {
    transform: [{ scale: new Animated.Value(1) }],
  },
  // Specific styles for answer animations
  answerAnimations: {
    transform: [{ scale: new Animated.Value(1) }],
  },
  answerLabel: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  answerLabelText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('5%'),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  answerText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('4.5%'),
    flex: 1,
    color: '#2c2c2c',
    lineHeight: wp('6%'),
    fontWeight: '600',
  },
  correctIcon: {
    marginLeft: wp('3%'),
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: wp('4%'),
    padding: wp('2%'),
  },
  correctIconText: {
    fontSize: wp('5%'),
    color: Colors.success,
    fontWeight: 'bold',
  },
  incorrectIcon: {
    marginLeft: wp('3%'),
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: wp('4%'),
    padding: wp('2%'),
  },
  incorrectIconText: {
    fontSize: wp('5%'),
    color: Colors.error,
    fontWeight: 'bold',
  },
  explanationContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    padding: wp('4%'),
    borderRadius: wp('4%'),
    marginTop: hp('2%'),
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  explanationTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('4.2%'),
    color: Colors.primary,
    marginBottom: hp('1%'),
    fontWeight: '700',
  },
  explanationText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: wp('3.8%'),
    color: Colors.textSecondary,
    lineHeight: wp('5.5%'),
    fontWeight: '400',
  },
});

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: number;
  onAnswerSelect: (answerId: number) => void;
  showCorrectAnswer?: boolean;
  disabled?: boolean;
  questionNumber: number;
  totalQuestions: number;
  style?: ViewStyle;
  testID?: string;
  // New props for animations
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  answerAnimations: Animated.Value[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  fadeAnim,
  slideAnim,
  answerAnimations,
  question,
  selectedAnswer,
  onAnswerSelect,
  showCorrectAnswer = false,
  disabled = false,
  questionNumber,
  totalQuestions,
  style,
  testID,
}) => {


  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [questionNumber]);

  const handleAnswerPress = (answerIndex: number) => {
    // Animate the selected answer
    if (answerAnimations[answerIndex]) {
      Animated.sequence([
        Animated.timing(answerAnimations[answerIndex], {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(answerAnimations[answerIndex], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onAnswerSelect(answerIndex);
  };
  const getAnswerStyle = (index: number): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.answerOption,
    };

    if (showCorrectAnswer) {
      if (index === question.correctAnswer) {
        baseStyle.backgroundColor = Colors.successLight;
        baseStyle.borderColor = Colors.success;
      } else if (index === selectedAnswer && index !== question.correctAnswer) {
        baseStyle.backgroundColor = Colors.errorLight;
        baseStyle.borderColor = Colors.error;
      }
    } else if (index === selectedAnswer) {
      baseStyle.backgroundColor = Colors.primaryLight;
      baseStyle.borderColor = Colors.primary;
    }

    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getAnswerTextStyle = (index: number): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.answerText,
    };

    if (showCorrectAnswer) {
      if (index === question.correctAnswer) {
        baseStyle.color = Colors.success;
        baseStyle.fontFamily = Typography.fontFamily.bold;
      } else if (index === selectedAnswer && index !== question.correctAnswer) {
        baseStyle.color = Colors.error;
        baseStyle.fontFamily = Typography.fontFamily.bold;
      }
    } else if (index === selectedAnswer) {
      baseStyle.color = Colors.primary;
      baseStyle.fontFamily = Typography.fontFamily.bold;
    }

    return baseStyle;
  };

  const getAnswerLabelStyle = (index: number): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.answerLabel,
    };

    if (showCorrectAnswer) {
      if (index === question.correctAnswer) {
        baseStyle.backgroundColor = Colors.success;
      } else if (index === selectedAnswer && index !== question.correctAnswer) {
        baseStyle.backgroundColor = Colors.error;
      }
    } else if (index === selectedAnswer) {
      baseStyle.backgroundColor = Colors.primary;
    }

    return baseStyle;
  };

  const getAnswerLabelTextStyle = (index: number): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.answerLabelText,
    };

    if (showCorrectAnswer || index === selectedAnswer) {
      baseStyle.color = Colors.textWhite;
    }

    return baseStyle;
  };

  const renderAnswerOption = (answerText: string, index: number) => {
    const answerLabels = ['A', 'B', 'C', 'D'];
    const label = answerLabels[index] || String.fromCharCode(65 + index);

    return (
      <Animated.View
        key={index}
        style={{
          transform: [{ scale: answerAnimations[index] || 1 }],
        }}
      >
        <TouchableOpacity
          style={getAnswerStyle(index)}
          onPress={() => handleAnswerPress(index)}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <View style={getAnswerLabelStyle(index)}>
            <Text style={getAnswerLabelTextStyle(index)}>
              {label}
            </Text>
          </View>
          
          <Text style={getAnswerTextStyle(index)}>
            {answerText}
          </Text>
          
          {showCorrectAnswer && index === question.correctAnswer && (
            <View style={styles.correctIcon}>
              <Text style={styles.correctIconText}>✓</Text>
            </View>
          )}
          
          {showCorrectAnswer && index === selectedAnswer && index !== question.correctAnswer && (
            <View style={styles.incorrectIcon}>
              <Text style={styles.incorrectIconText}>✗</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <Animated.View 
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={StyleSheet.flatten([styles.container, style])} testID={testID}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            height={hp('0.5%')}
            animated
            progressColor={Colors.primary}
          />
          <Text style={styles.progressText}>
            {questionNumber} of {totalQuestions}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            Question {questionNumber}
          </Text>
          
          <Text style={styles.questionText}>
            {question.question}
          </Text>
          
          {question.imageUrl && (
            <Image
              source={{ uri: question.imageUrl }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {question.options.map((answerText, index) => renderAnswerOption(answerText, index))}
        </View>

        {/* Explanation (shown after answer) */}
        {showCorrectAnswer && question.explanation && (
          <Animated.View 
            style={[
              styles.explanationContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.explanationTitle}>Explanation</Text>
            <Text style={styles.explanationText}>
              {question.explanation}
            </Text>
          </Animated.View>
        )}
      </Card>
    </Animated.View>
  );
};

export default QuestionCard;