import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  Bell,
  Shield,
  CircleHelp as HelpCircle,
  Star,
  ChevronRight,
  CreditCard as Edit,
  Award,
  Target,
  Calendar,
  Mail,
  User as UserIcon,
} from 'lucide-react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();
  const MenuButton = ({ icon: Icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Icon color="#6B7280" size={20} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight color="#9CA3AF" size={16} />
    </TouchableOpacity>
  );

  const StatsCard = ({ title, value, icon: Icon, color }: any) => (
    <View style={styles.statsCard}>
      <View style={[styles.statsIcon, { backgroundColor: `${color}20` }]}>
        <Icon color={color} size={20} />
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  );

  const handleSignOut = () => {
    signOut();
    router.push('/(auth)');
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <UserIcon color="#6B7280" size={40} />
              </View>
            )}
            <TouchableOpacity style={styles.editButton}>
              <Edit color="white" size={16} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>
            {user?.fullName ||
              `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
              'User'}
          </Text>
          <Text style={styles.profileEmail}>
            {user?.primaryEmailAddress?.emailAddress || 'No email available'}
          </Text>
          {user?.primaryEmailAddress?.verification?.status === 'verified' && (
            <View style={styles.verificationBadge}>
              <Shield color="#10B981" size={14} />
              <Text style={styles.verificationText}>Verified</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Streak"
            value="7 days"
            icon={Award}
            color="#F59E0B"
          />
          <StatsCard title="Level" value="Pro" icon={Star} color="#8B5CF6" />
          <StatsCard
            title="Goals"
            value="12/15"
            icon={Target}
            color="#10B981"
          />
        </View>

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.menuGroup}>
            <View style={styles.infoItem}>
              <View style={styles.menuIcon}>
                <UserIcon color="#6B7280" size={20} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Full Name</Text>
                <Text style={styles.menuSubtitle}>
                  {user?.fullName ||
                    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                    'Not provided'}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.menuIcon}>
                <Mail color="#6B7280" size={20} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Email</Text>
                <Text style={styles.menuSubtitle}>
                  {user?.primaryEmailAddress?.emailAddress ||
                    'No email available'}
                </Text>
                {user?.primaryEmailAddress?.verification?.status && (
                  <View style={styles.emailStatus}>
                    <Text
                      style={[
                        styles.emailStatusText,
                        user?.primaryEmailAddress?.verification?.status ===
                        'verified'
                          ? styles.emailStatusVerified
                          : styles.emailStatusUnverified,
                      ]}
                    >
                      {user?.primaryEmailAddress?.verification?.status ===
                      'verified'
                        ? '✓ Verified'
                        : '⚠ Unverified'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.menuIcon}>
                <Calendar color="#6B7280" size={20} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Member Since</Text>
                <Text style={styles.menuSubtitle}>
                  {formatDate(user?.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuGroup}>
            <MenuButton
              icon={UserIcon}
              title="Account Settings"
              subtitle="Manage your account information"
              onPress={() => {
                // TODO: Navigate to account settings
                console.log('Navigate to account settings');
              }}
            />
            <MenuButton
              icon={Settings}
              title="App Settings"
              subtitle="App preferences and configuration"
            />
            <MenuButton
              icon={Bell}
              title="Notifications"
              subtitle="Manage your notifications"
            />
            <MenuButton
              icon={Shield}
              title="Privacy & Security"
              subtitle="Control your privacy settings"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuGroup}>
            <MenuButton
              icon={HelpCircle}
              title="Help Center"
              subtitle="Get help and support"
            />
            <MenuButton
              icon={Star}
              title="Rate App"
              subtitle="Share your feedback"
            />
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statsCard: {
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
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  menuGroup: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 32,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  emailStatus: {
    marginTop: 4,
  },
  emailStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emailStatusVerified: {
    color: '#10B981',
  },
  emailStatusUnverified: {
    color: '#F59E0B',
  },
});
