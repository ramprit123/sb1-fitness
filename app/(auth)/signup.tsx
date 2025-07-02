import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Apple,
  Chrome,
  ArrowLeft,
} from 'lucide-react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const mounted = useRef(false);

  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: 'oauth_apple',
  });

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const scaleAnim = useSharedValue(0.9);

  useEffect(() => {
    mounted.current = true;
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 300 });
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 200 });

    return () => {
      mounted.current = false;
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }, { scale: scaleAnim.value }],
  }));

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name) return 'Full name is required';
    if (name.trim().length < 2)
      return 'Name must be at least 2 characters long';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8)
      return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password))
      return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password))
      return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password))
      return 'Password must contain at least one number';
    return undefined;
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      confirmPassword,
      password
    );

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!isLoaded) return;

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) return;

    if (mounted.current) {
      setIsLoading(true);
    }

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
      });

      // For development, we'll assume email verification is not required
      // In production, you might want to handle email verification
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(tabs)/home');
      } else {
        // Handle incomplete signup (usually means email verification required)
        console.log('Signup incomplete:', signUpAttempt.status);
        Alert.alert(
          'Verify Email',
          'Please check your email and verify your account to continue.',
          [{ text: 'OK' }]
        );
      }
    } catch (err: any) {
      console.log('Signup error:', err);
      let errorMessage = 'Account creation failed. Please try again.';

      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        if (clerkError.code === 'form_identifier_exists') {
          errorMessage =
            'An account with this email already exists. Please sign in instead.';
        } else if (clerkError.message) {
          errorMessage = clerkError.message;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'apple') => {
    try {
      setIsLoading(true);

      const startOAuthFlow =
        provider === 'google' ? startGoogleOAuthFlow : startAppleOAuthFlow;

      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      console.log('OAuth signup error:', err);
      Alert.alert(
        'Error',
        `Failed to create account with ${provider}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const SocialButton = ({ icon: Icon, title, onPress, colors }: any) => {
    const pressAnim = useSharedValue(0);

    const pressStyle = useAnimatedStyle(() => {
      const scale = interpolate(pressAnim.value, [0, 1], [1, 0.95]);
      return {
        transform: [{ scale }],
      };
    });

    const handlePress = () => {
      pressAnim.value = withTiming(1, { duration: 100 }, () => {
        pressAnim.value = withTiming(0, { duration: 100 });
      });
      onPress();
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View style={[styles.socialButton, pressStyle]}>
          <LinearGradient colors={colors} style={styles.socialButtonGradient}>
            <Icon color="white" size={20} />
            <Text style={styles.socialButtonText}>{title}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#6B7280" size={24} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandIcon}>🏋️</Text>
              <Text style={styles.brandText}>FitAI</Text>
            </View>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.welcomeSubtitle}>
              Join thousands of users on their fitness journey
            </Text>
          </View>

          {/* Social Signup Buttons */}
          <View style={styles.socialContainer}>
            <SocialButton
              icon={Apple}
              title="Sign up with Apple"
              colors={['#000000', '#333333']}
              onPress={() => handleSocialSignup('apple')}
            />
            <SocialButton
              icon={Chrome}
              title="Sign up with Google"
              colors={['#4285F4', '#34A853']}
              onPress={() => handleSocialSignup('google')}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Signup Form */}
          <View style={styles.formContainer}>
            {/* General Error */}
            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name && styles.inputWrapperError,
                ]}
              >
                <User color="#9CA3AF" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Full name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.name && (
                <Text style={styles.fieldErrorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email && styles.inputWrapperError,
                ]}
              >
                <Mail color="#9CA3AF" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email address"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.email && (
                <Text style={styles.fieldErrorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputWrapperError,
                ]}
              >
                <Lock color="#9CA3AF" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff color="#9CA3AF" size={20} />
                  ) : (
                    <Eye color="#9CA3AF" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.fieldErrorText}>{errors.password}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword && styles.inputWrapperError,
                ]}
              >
                <Lock color="#9CA3AF" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff color="#9CA3AF" size={20} />
                  ) : (
                    <Eye color="#9CA3AF" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.fieldErrorText}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.signupButton,
                isLoading && styles.signupButtonDisabled,
              ]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <LinearGradient
                colors={
                  isLoading ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1D4ED8']
                }
                style={styles.signupButtonGradient}
              >
                {isLoading ? (
                  <Text style={styles.signupButtonText}>
                    Creating Account...
                  </Text>
                ) : (
                  <>
                    <Text style={styles.signupButtonText}>Create Account</Text>
                    <ArrowRight color="white" size={20} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  socialContainer: {
    gap: 16,
    marginBottom: 28,
  },
  socialButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  socialButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 16,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 4,
  },
  signupButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  termsLink: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  fieldErrorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
    marginLeft: 4,
  },
  inputWrapperError: {
    borderColor: '#DC2626',
    borderWidth: 2,
  },
});
