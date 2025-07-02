import React, { useCallback } from 'react';
import { Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { FontAwesome } from '@expo/vector-icons'; // or pass any icon

WebBrowser.maybeCompleteAuthSession();

type Props = {
  icon?: React.ElementType;
  imgSrc?: any;
  title: string;
  colors: readonly [string, string, ...string[]];
};

export const GoogleSignInButton = React.memo(
  ({ icon: Icon = FontAwesome, imgSrc, title, colors }: Props) => {
    const pressAnim = useSharedValue(0);
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const pressStyle = useAnimatedStyle(() => {
      const scale = interpolate(pressAnim.value, [0, 1], [1, 0.95]);
      return {
        transform: [{ scale }],
      };
    }, []);

    const handleGoogleSignIn = useCallback(async () => {
      // Trigger press animation
      pressAnim.value = withTiming(1, { duration: 100 }, (finished) => {
        if (finished) {
          pressAnim.value = withTiming(0, { duration: 100 });
        }
      });

      // Run OAuth flow independently of animation
      try {
        const { createdSessionId, setActive } = await startOAuthFlow({
          redirectUrl: makeRedirectUri(),
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
        }
      } catch (err) {
        console.error('Google Sign-In Error', err);
      }
    }, [pressAnim, startOAuthFlow]);

    return (
      <TouchableOpacity onPress={handleGoogleSignIn} activeOpacity={0.8}>
        <Animated.View style={[styles.socialButton, pressStyle]}>
          <LinearGradient colors={colors} style={styles.socialButtonGradient}>
            {imgSrc ? (
              <Image source={imgSrc} style={styles.image} />
            ) : Icon ? (
              <Icon name="google" size={20} color="white" />
            ) : null}
            <Text style={styles.socialButtonText}>{title}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  socialButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  socialButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
