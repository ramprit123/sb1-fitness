import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Target, Flame, Users, Star, Volume2, VolumeX, Maximize, Heart, Share, Download, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  duration: string;
  reps?: string;
  sets?: string;
  description: string;
  tips: string[];
  targetMuscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl: string;
  completed: boolean;
}

const workoutData = {
  id: '1',
  title: 'Full Body HIIT Blast',
  description: 'A high-intensity interval training workout designed to burn calories and build strength across all major muscle groups.',
  duration: '30 min',
  difficulty: 'Advanced',
  calories: 350,
  rating: 4.8,
  reviews: 1247,
  instructor: 'Sarah Johnson',
  category: 'HIIT',
  equipment: ['Dumbbells', 'Mat', 'Water Bottle'],
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  exercises: [
    {
      id: '1',
      name: 'Burpees',
      duration: '45 sec',
      reps: '10-15',
      sets: '3',
      description: 'A full-body exercise that combines a squat, plank, and jump.',
      tips: [
        'Keep your core engaged throughout',
        'Land softly on your feet',
        'Maintain proper form over speed'
      ],
      targetMuscles: ['Full Body', 'Core', 'Legs', 'Arms'],
      difficulty: 'Advanced',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      completed: false,
    },
    {
      id: '2',
      name: 'Mountain Climbers',
      duration: '30 sec',
      reps: '20-30',
      sets: '3',
      description: 'A cardio exercise that targets your core while building endurance.',
      tips: [
        'Keep your hips level',
        'Drive knees to chest alternately',
        'Maintain plank position'
      ],
      targetMuscles: ['Core', 'Shoulders', 'Legs'],
      difficulty: 'Intermediate',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      completed: false,
    },
    {
      id: '3',
      name: 'Jump Squats',
      duration: '40 sec',
      reps: '15-20',
      sets: '3',
      description: 'Explosive squat movement that builds lower body power.',
      tips: [
        'Land with soft knees',
        'Keep chest up and core tight',
        'Use your arms for momentum'
      ],
      targetMuscles: ['Glutes', 'Quads', 'Calves'],
      difficulty: 'Intermediate',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      completed: false,
    },
    {
      id: '4',
      name: 'Push-up to T',
      duration: '35 sec',
      reps: '8-12',
      sets: '3',
      description: 'Push-up variation that adds a rotational element for core stability.',
      tips: [
        'Rotate from your core',
        'Keep your body in a straight line',
        'Control the movement'
      ],
      targetMuscles: ['Chest', 'Core', 'Shoulders', 'Arms'],
      difficulty: 'Advanced',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      completed: false,
    },
  ] as Exercise[],
};

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exercises, setExercises] = useState(workoutData.exercises);
  const [isLiked, setIsLiked] = useState(false);
  const [showExerciseDetails, setShowExerciseDetails] = useState(false);

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const videoScaleAnim = useSharedValue(1);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const videoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: videoScaleAnim.value }],
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    videoScaleAnim.value = withSpring(isPlaying ? 1 : 0.98, { duration: 200 });
  };

  const handleExerciseComplete = (exerciseId: string) => {
    setExercises(prev => 
      prev.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      )
    );
  };

  const handleStartWorkout = () => {
    Alert.alert(
      'Start Workout',
      `Begin ${workoutData.title}?\n\nDuration: ${workoutData.duration}\nDifficulty: ${workoutData.difficulty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            Alert.alert('Workout Started!', 'Timer has begun. Good luck! 💪');
          }
        }
      ]
    );
  };

  const handleShare = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Share Workout', 'Share this workout with friends!');
    } else {
      // Native sharing would go here
      Alert.alert('Share Workout', 'Share this workout with friends!');
    }
  };

  const handleDownload = () => {
    Alert.alert('Download Workout', 'Workout saved for offline access!');
  };

  const VideoPlayer = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: workoutData.videoUrl }}
            style={styles.webVideo}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
          <View style={styles.videoOverlay}>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              {isPlaying ? (
                <Pause color="white" size={32} />
              ) : (
                <Play color="white" size={32} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            {isPlaying ? (
              <Pause color="white" size={32} />
            ) : (
              <Play color="white" size={32} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.videoControls}>
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
            {isMuted ? (
              <VolumeX color="white" size={20} />
            ) : (
              <Volume2 color="white" size={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFullscreen(!isFullscreen)}>
            <Maximize color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ExerciseCard = ({ exercise, index }: { exercise: Exercise; index: number }) => {
    const pressAnim = useSharedValue(0);

    const pressStyle = useAnimatedStyle(() => {
      const scale = interpolate(pressAnim.value, [0, 1], [1, 0.98]);
      return {
        transform: [{ scale }],
      };
    });

    const handlePress = () => {
      pressAnim.value = withTiming(1, { duration: 100 }, () => {
        pressAnim.value = withTiming(0, { duration: 100 });
      });
      setCurrentExercise(index);
      setShowExerciseDetails(true);
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Animated.View style={[styles.exerciseCard, pressStyle]}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseNumber}>
              <Text style={styles.exerciseNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseMeta}>
                <Text style={styles.exerciseMetaText}>{exercise.duration}</Text>
                {exercise.reps && (
                  <>
                    <Text style={styles.exerciseMetaDot}>•</Text>
                    <Text style={styles.exerciseMetaText}>{exercise.reps} reps</Text>
                  </>
                )}
                {exercise.sets && (
                  <>
                    <Text style={styles.exerciseMetaDot}>•</Text>
                    <Text style={styles.exerciseMetaText}>{exercise.sets} sets</Text>
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleExerciseComplete(exercise.id)}
            >
              {exercise.completed ? (
                <CheckCircle color="#10B981" size={24} />
              ) : (
                <Circle color="#9CA3AF" size={24} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
          <View style={styles.targetMuscles}>
            {exercise.targetMuscles.slice(0, 3).map((muscle, idx) => (
              <View key={idx} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>{muscle}</Text>
              </View>
            ))}
            {exercise.targetMuscles.length > 3 && (
              <Text style={styles.moreMuscles}>+{exercise.targetMuscles.length - 3}</Text>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Icon color={color} size={20} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={animatedStyle}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft color="#111827" size={24} />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.actionButton, isLiked && styles.actionButtonLiked]} 
                onPress={() => setIsLiked(!isLiked)}
              >
                <Heart color={isLiked ? "#EF4444" : "#6B7280"} size={20} fill={isLiked ? "#EF4444" : "none"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share color="#6B7280" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
                <Download color="#6B7280" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Video Player */}
          <Animated.View style={[styles.videoSection, videoAnimatedStyle]}>
            <VideoPlayer />
          </Animated.View>

          {/* Workout Info */}
          <View style={styles.workoutInfo}>
            <View style={styles.workoutHeader}>
              <View style={styles.workoutTitleSection}>
                <Text style={styles.workoutTitle}>{workoutData.title}</Text>
                <View style={styles.workoutMeta}>
                  <View style={styles.ratingContainer}>
                    <Star color="#F59E0B" size={16} fill="#F59E0B" />
                    <Text style={styles.ratingText}>{workoutData.rating}</Text>
                    <Text style={styles.reviewsText}>({workoutData.reviews} reviews)</Text>
                  </View>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(workoutData.difficulty) }]}>
                    <Text style={styles.difficultyText}>{workoutData.difficulty}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.workoutDescription}>{workoutData.description}</Text>

            <View style={styles.instructorSection}>
              <Text style={styles.instructorLabel}>Instructor</Text>
              <Text style={styles.instructorName}>{workoutData.instructor}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <StatCard
                icon={Clock}
                title="Duration"
                value={workoutData.duration}
                color="#3B82F6"
              />
              <StatCard
                icon={Flame}
                title="Calories"
                value={`${workoutData.calories} kcal`}
                color="#EF4444"
              />
              <StatCard
                icon={Target}
                title="Exercises"
                value={workoutData.exercises.length}
                color="#10B981"
              />
            </View>

            {/* Equipment */}
            <View style={styles.equipmentSection}>
              <Text style={styles.sectionTitle}>Equipment Needed</Text>
              <View style={styles.equipmentList}>
                {workoutData.equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Exercises */}
            <View style={styles.exercisesSection}>
              <Text style={styles.sectionTitle}>Exercises ({workoutData.exercises.length})</Text>
              {exercises.map((exercise, index) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.startButtonGradient}
          >
            <Play color="white" size={20} />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonLiked: {
    backgroundColor: '#FEF2F2',
  },
  videoSection: {
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
  videoContainer: {
    height: 200,
    backgroundColor: '#000',
    position: 'relative',
  },
  webVideo: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  workoutInfo: {
    paddingHorizontal: 20,
  },
  workoutHeader: {
    marginBottom: 16,
  },
  workoutTitleSection: {
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 34,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reviewsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  workoutDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  instructorSection: {
    marginBottom: 24,
  },
  instructorLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
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
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  equipmentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  equipmentText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  exercisesSection: {
    marginBottom: 100,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseMetaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  exerciseMetaDot: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  completeButton: {
    padding: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  targetMuscles: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  muscleTagText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  moreMuscles: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});