import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Play, Clock, Target, TrendingUp, Filter, Search } from 'lucide-react-native';
import { router } from 'expo-router';

interface Workout {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  category: string;
  exercises: number;
  calories: number;
}

const workouts: Workout[] = [
  {
    id: '1',
    title: 'Full Body HIIT',
    duration: '30 min',
    difficulty: 'Advanced',
    category: 'STRENGTH',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    exercises: 12,
    calories: 350,
  },
  {
    id: '2',
    title: 'Morning Yoga Flow',
    duration: '20 min',
    difficulty: 'Beginner',
    category: 'YOGA',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    exercises: 8,
    calories: 120,
  },
  {
    id: '3',
    title: 'Core Crusher',
    duration: '15 min',
    difficulty: 'Intermediate',
    category: 'CORE',
    image: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    exercises: 10,
    calories: 180,
  },
  {
    id: '4',
    title: 'Cardio Blast',
    duration: '25 min',
    difficulty: 'Intermediate',
    category: 'CARDIO',
    image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    exercises: 8,
    calories: 280,
  },
  {
    id: '5',
    title: 'Upper Body Power',
    duration: '35 min',
    difficulty: 'Advanced',
    category: 'STRENGTH',
    image: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    exercises: 14,
    calories: 400,
  },
  {
    id: '6',
    title: 'Flexibility & Stretch',
    duration: '18 min',
    difficulty: 'Beginner',
    category: 'FLEXIBILITY',
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    exercises: 6,
    calories: 90,
  },
];

export default function WorkoutsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const categories = ['ALL', 'STRENGTH', 'CARDIO', 'YOGA', 'CORE', 'FLEXIBILITY'];

  const filteredWorkouts = selectedCategory === 'ALL' 
    ? workouts 
    : workouts.filter(workout => workout.category === selectedCategory);

  const WorkoutCard = ({ workout }: { workout: Workout }) => {
    const scaleAnim = useSharedValue(0);
    const pressAnim = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(pressAnim.value, [0, 1], [1, 0.95]);
      return {
        transform: [{ scale }],
      };
    });

    const handlePress = () => {
      pressAnim.value = withTiming(1, { duration: 100 }, () => {
        pressAnim.value = withTiming(0, { duration: 100 });
      });

      // Navigate to workout details
      router.push(`/(tabs)/workouts/${workout.id}`);
    };

    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
        case 'Beginner': return '#10B981';
        case 'Intermediate': return '#F59E0B';
        case 'Advanced': return '#EF4444';
        default: return '#6B7280';
      }
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Animated.View style={[styles.workoutCard, animatedStyle]}>
          <Image source={{ uri: workout.image }} style={styles.workoutImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.workoutOverlay}
          >
            <View style={styles.workoutBadge}>
              <Text style={styles.workoutCategory}>{workout.category}</Text>
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <View style={styles.workoutMeta}>
                <View style={styles.metaItem}>
                  <Clock color="white" size={14} />
                  <Text style={styles.metaText}>{workout.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Target color={getDifficultyColor(workout.difficulty)} size={14} />
                  <Text style={[styles.metaText, { color: getDifficultyColor(workout.difficulty) }]}>
                    {workout.difficulty}
                  </Text>
                </View>
              </View>
              <Text style={styles.exerciseCount}>{workout.exercises} exercises • ~{workout.calories} cal</Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={handlePress}>
              <Play color="white" size={20} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const CategoryButton = ({ category }: { category: string }) => {
    const isSelected = selectedCategory === category;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isSelected && styles.categoryButtonActive
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text style={[
          styles.categoryButtonText,
          isSelected && styles.categoryButtonTextActive
        ]}>
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search color="#6B7280" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter color="#6B7280" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp color="#3B82F6" size={24} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Clock color="#10B981" size={24} />
            <Text style={styles.statValue}>8.5h</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statCard}>
            <Target color="#F59E0B" size={24} />
            <Text style={styles.statValue}>2,840</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <CategoryButton key={category} category={category} />
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>
          {selectedCategory === 'ALL' ? 'All Workouts' : `${selectedCategory} Workouts`}
        </Text>
        
        {filteredWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </ScrollView>
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
    paddingTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
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
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  workoutCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  workoutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'space-between',
  },
  workoutBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  workoutCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  workoutInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  exerciseCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  playButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});