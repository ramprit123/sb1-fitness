import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import {
  Footprints,
  Flame,
  Clock,
  Play,
  Apple,
  Camera,
  ChartBar as BarChart3,
  Trophy,
  ChevronRight,
} from 'lucide-react-native';
import WorkoutModal from '@/components/WorkoutModal';
import FormCheckModal from '@/components/FormCheckModal';

const { width } = Dimensions.get('window');

interface WorkoutData {
  currentExercise: number;
  totalExercises: number;
  exerciseName: string;
  timeRemaining: string;
  isActive: boolean;
}

export default function HomeScreen() {
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.9);
  const progressAnim = useSharedValue(0);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [formCheckModalVisible, setFormCheckModalVisible] = useState(false);
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    currentExercise: 2,
    totalExercises: 4,
    exerciseName: 'Push-ups',
    timeRemaining: '12:30',
    isActive: true,
  });

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    scaleAnim.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    progressAnim.value = withTiming(
      workoutData.currentExercise / workoutData.totalExercises,
      {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      }
    );
  }, [workoutData]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value * 100}%`,
    };
  });

  const StatCard = ({ icon: Icon, title, value, color, onPress }: any) => {
    const pulseAnim = useSharedValue(1);
    const pressAnim = useSharedValue(0);

    useEffect(() => {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    }, []);

    const pulseStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        pressAnim.value,
        [0, 1],
        [pulseAnim.value, 0.95]
      );
      return {
        transform: [{ scale }],
      };
    });

    const handlePress = () => {
      pressAnim.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      onPress?.();
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View style={[styles.statCard, pulseStyle]}>
          <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
            <Icon color={color} size={20} />
          </View>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const ActionButton = ({
    icon: Icon,
    title,
    subtitle,
    color,
    onPress,
  }: any) => {
    const pressAnim = useSharedValue(0);

    const pressStyle = useAnimatedStyle(() => {
      const scale = interpolate(pressAnim.value, [0, 1], [1, 0.95]);
      return {
        transform: [{ scale }],
      };
    });

    const handlePress = () => {
      pressAnim.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      onPress?.();
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View style={[styles.actionButton, pressStyle]}>
          <View style={[styles.actionIcon, { backgroundColor: color }]}>
            <Icon color="white" size={20} />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>{title}</Text>
            <Text style={styles.actionSubtitle}>{subtitle}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const WorkoutCard = ({ title, duration, level, image, onPress }: any) => {
    const hoverAnim = useSharedValue(0);

    const hoverStyle = useAnimatedStyle(() => {
      const scale = interpolate(hoverAnim.value, [0, 1], [1, 1.02]);
      return {
        transform: [{ scale }],
      };
    });

    const handlePress = () => {
      hoverAnim.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 150 })
      );
      onPress?.();
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Animated.View style={[styles.workoutCard, hoverStyle]}>
          <Image source={{ uri: image }} style={styles.workoutImage} />
          <View style={styles.workoutOverlay}>
            <Text style={styles.workoutTitle}>{title}</Text>
            <Text style={styles.workoutInfo}>
              {duration} • {level}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handleContinueWorkout = () => {
    Alert.alert(
      'Continue Workout',
      `Resume ${workoutData.exerciseName}?\nTime remaining: ${workoutData.timeRemaining}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            router.push('/workouts');
          },
        },
      ]
    );
  };

  const handleStartNewWorkout = () => {
    setWorkoutModalVisible(true);
  };

  const handleWorkoutStart = (workout: any) => {
    Alert.alert(
      'Workout Started!',
      `Starting ${workout.title}\nDuration: ${workout.duration}\nGet ready to sweat! 💪`,
      [
        {
          text: "Let's Go!",
          onPress: () => {
            // Update workout data to reflect new workout
            setWorkoutData({
              currentExercise: 0,
              totalExercises: workout.exercises,
              exerciseName: workout.title,
              timeRemaining: workout.duration,
              isActive: true,
            });
            router.push('/workouts');
          },
        },
      ]
    );
  };

  const handleNutritionPlan = () => {
    router.push('/nutrition');
  };

  const handleFormCheck = () => {
    setFormCheckModalVisible(true);
  };

  const handleProgressPhotos = () => {
    router.push('/progress');
  };

  const handleStatsPress = (statType: string) => {
    switch (statType) {
      case 'steps':
        Alert.alert(
          'Steps Tracker',
          '🚶‍♂️ Daily step tracking and goals\n\nToday: 8,432 steps\nGoal: 10,000 steps\nProgress: 84%'
        );
        break;
      case 'calories':
        Alert.alert(
          'Calories Burned',
          '🔥 Calories burned today\n\nActive calories: 420 kcal\nTotal calories: 1,850 kcal\nGoal: 2,200 kcal'
        );
        break;
      case 'active':
        Alert.alert(
          'Active Time',
          '⏱️ Total active minutes today\n\nActive time: 45 minutes\nExercise: 30 minutes\nStanding: 15 minutes'
        );
        break;
    }
  };

  const handleWorkoutPress = (workoutType: string) => {
    Alert.alert('Start Workout', `Begin ${workoutType} workout?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start', onPress: () => router.push('/workouts') },
    ]);
  };

  const handleChallengePress = () => {
    Alert.alert(
      "Today's Challenge",
      '🏆 Complete 3 workouts to earn a badge!\n\nProgress: 1/3 workouts completed\n\nReward: "Consistency Champion" badge + 50 XP points',
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'View All Challenges',
          onPress: () => {
            Alert.alert(
              'Challenges',
              '🎯 Weekly Challenges:\n\n• Complete 5 workouts (1/5)\n• Burn 2000 calories (420/2000)\n• Try 3 new exercises (0/3)\n• Workout 3 days in a row (1/3)'
            );
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, animatedStyle]}>
          <View>
            <View style={styles.brandContainer}>
              <Text style={styles.brandIcon}>🏋️</Text>
              <Text style={styles.brandText}>FitAI</Text>
            </View>
            <Text style={styles.greeting}>Good morning, Alex</Text>
            <Text style={styles.date}>Monday, February 12</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View style={[styles.statsContainer, animatedStyle]}>
          <StatCard
            icon={Footprints}
            title="Steps"
            value="8,432/10,000"
            color="#3B82F6"
            onPress={() => handleStatsPress('steps')}
          />
          <StatCard
            icon={Flame}
            title="Calories"
            value="420 kcal"
            color="#EF4444"
            onPress={() => handleStatsPress('calories')}
          />
          <StatCard
            icon={Clock}
            title="Active"
            value="45 min"
            color="#10B981"
            onPress={() => handleStatsPress('active')}
          />
        </Animated.View>

        {/* AI Workout Plan Card */}
        <Animated.View style={[styles.workoutPlanCard, animatedStyle]}>
          <LinearGradient
            colors={['#3B82F6', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <Text style={styles.workoutPlanTitle}>Your AI Workout Plan</Text>
            <Text style={styles.workoutPlanSubtitle}>
              Upper Body Focus • 45 min
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>
            </View>

            <Text style={styles.progressText}>
              {workoutData.currentExercise} of {workoutData.totalExercises}{' '}
              exercises completed
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinueWorkout}
            >
              <Text style={styles.continueButtonText}>Continue Workout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsContainer, animatedStyle]}>
          <View style={styles.actionsRow}>
            <ActionButton
              icon={Play}
              title="Start New"
              subtitle="Workout"
              color="#3B82F6"
              onPress={handleStartNewWorkout}
            />
            <ActionButton
              icon={Apple}
              title="Nutrition"
              subtitle="Plan"
              color="#6366F1"
              onPress={handleNutritionPlan}
            />
          </View>
          <View style={styles.actionsRow}>
            <ActionButton
              icon={Camera}
              title="Form"
              subtitle="Check"
              color="#3B82F6"
              onPress={handleFormCheck}
            />
            <ActionButton
              icon={BarChart3}
              title="Progress"
              subtitle="Photos"
              color="#6366F1"
              onPress={handleProgressPhotos}
            />
          </View>
        </Animated.View>

        {/* Upcoming Workouts */}
        <Animated.View style={[styles.section, animatedStyle]}>
          <Text style={styles.sectionTitle}>Upcoming Workouts</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.workoutsScroll}
          >
            <WorkoutCard
              title="Lower Body"
              duration="40 min"
              level="Intermediate"
              image="https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2"
              onPress={() => handleWorkoutPress('Lower Body')}
            />
            <WorkoutCard
              title="Core Strength"
              duration="30 min"
              level="Beginner"
              image="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2"
              onPress={() => handleWorkoutPress('Core Strength')}
            />
            <WorkoutCard
              title="HIIT Cardio"
              duration="25 min"
              level="Advanced"
              image="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2"
              onPress={() => handleWorkoutPress('HIIT Cardio')}
            />
          </ScrollView>
        </Animated.View>

        {/* Community */}
        <Animated.View style={[styles.section, animatedStyle]}>
          <Text style={styles.sectionTitle}>Community</Text>
          <TouchableOpacity
            style={styles.challengeCard}
            onPress={handleChallengePress}
          >
            <View style={styles.challengeIcon}>
              <Trophy color="#F59E0B" size={24} />
            </View>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>Today's Challenge</Text>
              <Text style={styles.challengeSubtitle}>
                Complete 3 workouts to earn a badge!
              </Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Modals */}
      <WorkoutModal
        visible={workoutModalVisible}
        onClose={() => setWorkoutModalVisible(false)}
        onStartWorkout={handleWorkoutStart}
      />

      <FormCheckModal
        visible={formCheckModalVisible}
        onClose={() => setFormCheckModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  workoutPlanCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  gradientCard: {
    padding: 24,
  },
  workoutPlanTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  workoutPlanSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  actionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  workoutsScroll: {
    flexDirection: 'row',
  },
  workoutCard: {
    width: 200,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  workoutOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  workoutInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    marginRight: 16,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  challengeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});
