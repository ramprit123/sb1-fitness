import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Flame, Play, Target, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface WorkoutOption {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: number;
  calories: number;
  image: string;
  description: string;
}

const workoutOptions: WorkoutOption[] = [
  {
    id: '1',
    title: 'Quick HIIT',
    duration: '15 min',
    difficulty: 'Intermediate',
    exercises: 8,
    calories: 180,
    image:
      'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    description: 'High-intensity interval training for a quick energy boost',
  },
  {
    id: '2',
    title: 'Full Body Strength',
    duration: '45 min',
    difficulty: 'Advanced',
    exercises: 12,
    calories: 420,
    image:
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    description: 'Complete strength training targeting all major muscle groups',
  },
  {
    id: '3',
    title: 'Morning Energizer',
    duration: '20 min',
    difficulty: 'Beginner',
    exercises: 6,
    calories: 150,
    image:
      'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    description: 'Perfect morning routine to start your day with energy',
  },
  {
    id: '4',
    title: 'Core Focus',
    duration: '25 min',
    difficulty: 'Intermediate',
    exercises: 10,
    calories: 200,
    image:
      'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    description: 'Targeted core strengthening and stability exercises',
  },
];

interface WorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  onStartWorkout: (workout: WorkoutOption) => void;
}

export default function WorkoutModal({
  visible,
  onClose,
  onStartWorkout,
}: WorkoutModalProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutOption | null>(
    null
  );
  const slideAnim = useSharedValue(height);
  const overlayAnim = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      overlayAnim.value = withTiming(1, { duration: 300 });
      slideAnim.value = withSpring(0, { damping: 20, stiffness: 300 });
      // Reset selected workout when modal opens
      setSelectedWorkout(null);
    } else {
      overlayAnim.value = withTiming(0, { duration: 200 });
      slideAnim.value = withTiming(height, { duration: 300 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayAnim.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const WorkoutCard = ({ workout }: { workout: WorkoutOption }) => {
    const isSelected = selectedWorkout?.id === workout.id;
    const scaleAnim = useSharedValue(1);

    const cardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }));

    const handlePress = () => {
      scaleAnim.value = withSpring(0.95, { duration: 100 }, () => {
        scaleAnim.value = withSpring(1, { duration: 100 });
      });
      setSelectedWorkout(workout);
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Animated.View
          style={[
            styles.workoutOptionCard,
            isSelected && styles.workoutOptionCardSelected,
            cardStyle,
          ]}
        >
          <View style={styles.cardContent}>
            <Image
              source={{ uri: workout.image }}
              style={styles.workoutOptionImage}
            />
            <View style={styles.workoutOptionInfo}>
              <View style={styles.workoutOptionHeader}>
                <Text style={styles.workoutOptionTitle}>{workout.title}</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(workout.difficulty) },
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {workout.difficulty}
                  </Text>
                </View>
              </View>
              <Text style={styles.workoutOptionDescription} numberOfLines={2}>
                {workout.description}
              </Text>
              <View style={styles.workoutOptionMeta}>
                <View style={styles.metaItem}>
                  <Clock color="#6B7280" size={14} />
                  <Text style={styles.metaText}>{workout.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Target color="#6B7280" size={14} />
                  <Text style={styles.metaText}>
                    {workout.exercises} exercises
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Flame color="#6B7280" size={14} />
                  <Text style={styles.metaText}>{workout.calories} cal</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handleStartWorkout = () => {
    if (selectedWorkout) {
      onStartWorkout(selectedWorkout);
      onClose();
      setSelectedWorkout(null);
    }
  };

  const handleClose = () => {
    setSelectedWorkout(null);
    onClose();
  };

  // Don't render anything if not visible
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity
          style={styles.overlayTouch}
          onPress={handleClose}
          activeOpacity={1}
        />
        <Animated.View style={[styles.modal, modalStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Start New Workout</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>Choose Your Workout</Text>
            {workoutOptions.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </ScrollView>

          {selectedWorkout && (
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartWorkout}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.startButtonGradient}
                >
                  <Play color="white" size={20} />
                  <Text style={styles.startButtonText}>
                    Start {selectedWorkout.title}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 16,
  },
  workoutOptionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutOptionCardSelected: {
    borderColor: '#3B82F6',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  workoutOptionImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  workoutOptionInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  workoutOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  workoutOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  workoutOptionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  workoutOptionMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
