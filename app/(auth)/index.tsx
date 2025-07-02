import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Apple,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const mounted = useRef(false);

  const { signIn, setActive, isLoaded } = useSignIn();
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
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!isLoaded) return;

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) return;

    if (mounted.current) {
      setIsLoading(true);
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)/home');
      } else {
        // Handle other statuses if needed
        console.log('Sign in incomplete:', signInAttempt.status);
        setErrors({ general: 'Sign in incomplete. Please try again.' });
      }
    } catch (err: any) {
      console.log('Sign in error:', err);
      let errorMessage = 'Sign in failed. Please try again.';

      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        if (clerkError.code === 'form_identifier_not_found') {
          errorMessage = 'No account found with this email address.';
        } else if (clerkError.code === 'form_password_incorrect') {
          errorMessage = 'Incorrect password. Please try again.';
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

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
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
      console.log('OAuth error:', err);
      Alert.alert(
        'Error',
        `Failed to sign in with ${provider}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const SocialButton = ({
    icon: Icon,
    imgSrc,
    title,
    onPress,
    colors,
  }: any) => {
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
            {imgSrc ? (
              <Image
                source={imgSrc}
                style={{ width: 20, height: 20, borderRadius: 10 }}
              />
            ) : (
              <Icon color="white" size={20} />
            )}
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandIcon}>🏋️</Text>
              <Text style={styles.brandText}>FitAI</Text>
            </View>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue your fitness journey
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
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
                      // Clear email error when user starts typing
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
                      // Clear password error when user starts typing
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

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={
                    isLoading ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1D4ED8']
                  }
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <Text style={styles.loginButtonText}>Signing In...</Text>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Sign In</Text>
                      <ArrowRight color="white" size={20} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <SocialButton
              icon={Apple}
              title="Continue with Apple"
              colors={['#000000', '#333333']}
              onPress={() => handleSocialLogin('apple')}
            />
            <SocialButton
              imgSrc={require('../../assets/images/google-icon-logo.png')}
              title="Continue with Google"
              colors={['#000000', '#333333']}
              onPress={() => handleSocialLogin('google')}
            />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
    paddingTop: 40,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  brandText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  welcomeTitle: {
    fontSize: 28,
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
    marginBottom: 32,
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
    marginBottom: 32,
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
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signupLink: {
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
