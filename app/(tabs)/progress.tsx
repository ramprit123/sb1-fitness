import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Calendar, Award, Target, Camera } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const StatCard = ({ title, value, change, color, icon: Icon }: any) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
          <Icon color={color} size={20} />
        </View>
        <View style={[styles.changeIndicator, { backgroundColor: change > 0 ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.changeText}>{change > 0 ? '+' : ''}{change}%</Text>
        </View>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const AchievementCard = ({ title, description, date, icon: Icon, color }: any) => (
    <View style={styles.achievementCard}>
      <View style={[styles.achievementIcon, { backgroundColor: color }]}>
        <Icon color="white" size={24} />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{title}</Text>
        <Text style={styles.achievementDescription}>{description}</Text>
        <Text style={styles.achievementDate}>{date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Progress</Text>
        
        {/* Weekly Progress */}
        <View style={styles.weeklyCard}>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.weeklyGradient}
          >
            <Text style={styles.weeklyTitle}>This Week</Text>
            <Text style={styles.weeklyValue}>6/7</Text>
            <Text style={styles.weeklySubtitle}>Workout Goals Completed</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '86%' }]} />
            </View>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Weight Lost"
            value="12 lbs"
            change={8}
            color="#EF4444"
            icon={TrendingUp}
          />
          <StatCard
            title="Workouts"
            value="24"
            change={15}
            color="#3B82F6"
            icon={Calendar}
          />
        </View>

        {/* Progress Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progress Photos</Text>
            <TouchableOpacity style={styles.addPhotoButton}>
              <Camera color="#6B7280" size={20} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
            <View style={styles.photoCard}>
              <Text style={styles.photoDate}>Jan 1</Text>
              <View style={styles.photoPlaceholder}>
                <Camera color="#9CA3AF" size={32} />
              </View>
            </View>
            <View style={styles.photoCard}>
              <Text style={styles.photoDate}>Jan 15</Text>
              <View style={styles.photoPlaceholder}>
                <Camera color="#9CA3AF" size={32} />
              </View>
            </View>
            <View style={styles.photoCard}>
              <Text style={styles.photoDate}>Feb 1</Text>
              <View style={styles.photoPlaceholder}>
                <Camera color="#9CA3AF" size={32} />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        
        <AchievementCard
          title="7-Day Streak"
          description="Completed workouts for 7 days straight"
          date="2 days ago"
          icon={Award}
          color="#F59E0B"
        />
        
        <AchievementCard
          title="Goal Crusher"
          description="Reached monthly calorie burn target"
          date="1 week ago"
          icon={Target}
          color="#10B981"
        />
        
        <AchievementCard
          title="Early Bird"
          description="Completed 5 morning workouts"
          date="2 weeks ago"
          icon={TrendingUp}
          color="#6366F1"
        />
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 24,
  },
  weeklyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  weeklyGradient: {
    padding: 24,
    alignItems: 'center',
  },
  weeklyTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  weeklyValue: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  weeklySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIndicator: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addPhotoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  photosScroll: {
    flexDirection: 'row',
  },
  photoCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  photoDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});