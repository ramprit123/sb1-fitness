import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Apple, Droplets, Zap, Target, Plus } from 'lucide-react-native';

export default function NutritionScreen() {
  const MacroCard = ({ title, current, target, color, icon: Icon }: any) => (
    <View style={styles.macroCard}>
      <View style={[styles.macroIcon, { backgroundColor: `${color}20` }]}>
        <Icon color={color} size={20} />
      </View>
      <Text style={styles.macroTitle}>{title}</Text>
      <Text style={styles.macroValue}>{current}g</Text>
      <Text style={styles.macroTarget}>of {target}g</Text>
      <View style={styles.macroProgress}>
        <View style={[styles.macroProgressFill, { 
          width: `${(current / target) * 100}%`,
          backgroundColor: color 
        }]} />
      </View>
    </View>
  );

  const MealCard = ({ title, calories, time, items }: any) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View>
          <Text style={styles.mealTitle}>{title}</Text>
          <Text style={styles.mealTime}>{time}</Text>
        </View>
        <View style={styles.mealCalories}>
          <Text style={styles.caloriesText}>{calories}</Text>
          <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      </View>
      <View style={styles.mealItems}>
        {items.map((item: string, index: number) => (
          <Text key={index} style={styles.mealItem}>• {item}</Text>
        ))}
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Plus color="#6B7280" size={20} />
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Nutrition</Text>
        
        {/* Daily Calories */}
        <View style={styles.caloriesCard}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.caloriesGradient}
          >
            <Text style={styles.caloriesTitle}>Today's Calories</Text>
            <Text style={styles.caloriesValue}>1,420</Text>
            <Text style={styles.caloriesTarget}>of 2,000 kcal</Text>
            <View style={styles.caloriesProgress}>
              <View style={[styles.caloriesProgressFill, { width: '71%' }]} />
            </View>
          </LinearGradient>
        </View>

        {/* Macros */}
        <Text style={styles.sectionTitle}>Macronutrients</Text>
        <View style={styles.macrosContainer}>
          <MacroCard
            title="Protein"
            current={89}
            target={120}
            color="#EF4444"
            icon={Zap}
          />
          <MacroCard
            title="Carbs"
            current={145}
            target={200}
            color="#F59E0B"
            icon={Apple}
          />
          <MacroCard
            title="Fat"
            current={65}
            target={80}
            color="#8B5CF6"
            icon={Droplets}
          />
        </View>

        {/* Meals */}
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        
        <MealCard
          title="Breakfast"
          calories={420}
          time="8:00 AM"
          items={['Oatmeal with berries', 'Greek yogurt', 'Black coffee']}
        />
        
        <MealCard
          title="Lunch"
          calories={650}
          time="12:30 PM"
          items={['Grilled chicken salad', 'Quinoa bowl', 'Avocado']}
        />
        
        <MealCard
          title="Dinner"
          calories={350}
          time="7:00 PM"
          items={['Salmon with vegetables', 'Brown rice']}
        />
        
        <MealCard
          title="Snacks"
          calories={0}
          time="Throughout day"
          items={[]}
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
  caloriesCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  caloriesGradient: {
    padding: 24,
    alignItems: 'center',
  },
  caloriesTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  caloriesTarget: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  caloriesProgress: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  caloriesProgressFill: {
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
  macrosContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  macroCard: {
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
  macroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  macroTarget: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  macroProgress: {
    width: '100%',
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  mealCard: {
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  mealTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  mealCalories: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  mealItems: {
    marginBottom: 16,
  },
  mealItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});