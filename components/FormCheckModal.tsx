import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CircleAlert as AlertCircle,
  Camera,
  CircleCheck as CheckCircle,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FormCheckModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FormCheckModal({
  visible,
  onClose,
}: FormCheckModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    feedback: string[];
    improvements: string[];
  } | null>(null);

  const slideAnim = useSharedValue(height);
  const overlayAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const analyzeAnim = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      overlayAnim.value = withTiming(1, { duration: 300 });
      slideAnim.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      overlayAnim.value = withTiming(0, { duration: 200 });
      slideAnim.value = withTiming(height, { duration: 300 });
      setAnalysisResult(null);
      setIsAnalyzing(false);
    }
  }, [visible]);

  React.useEffect(() => {
    if (isAnalyzing) {
      analyzeAnim.value = withTiming(1, { duration: 300 });
      pulseAnim.value = withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      );
    } else {
      analyzeAnim.value = withTiming(0, { duration: 300 });
    }
  }, [isAnalyzing]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayAnim.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const analyzeStyle = useAnimatedStyle(() => ({
    opacity: analyzeAnim.value,
  }));

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const simulateFormAnalysis = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis delay
    setTimeout(() => {
      const mockResults = [
        {
          score: 85,
          feedback: [
            'Good posture alignment',
            'Proper knee tracking',
            'Stable core engagement',
          ],
          improvements: [
            'Lower your squat depth slightly',
            'Keep chest more upright',
          ],
        },
        {
          score: 92,
          feedback: [
            'Excellent form!',
            'Perfect spine alignment',
            'Great range of motion',
          ],
          improvements: [
            'Try to slow down the movement',
            'Focus on controlled breathing',
          ],
        },
        {
          score: 78,
          feedback: ['Good overall technique', 'Nice tempo control'],
          improvements: [
            'Watch your knee alignment',
            'Engage your core more',
            'Keep your weight on your heels',
          ],
        },
      ];

      const randomResult =
        mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleStartAnalysis = () => {
    if (Platform.OS === 'web') {
      // For web platform, show a demo message
      Alert.alert(
        'Form Check Demo',
        'This feature uses device camera for real-time form analysis. On web, this is a demonstration of the UI.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Show Demo', onPress: simulateFormAnalysis },
        ]
      );
    } else {
      simulateFormAnalysis();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#F59E0B';
    return '#EF4444';
  };

  const renderCameraView = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webCameraPlaceholder}>
          <Camera color="#9CA3AF" size={64} />
          <Text style={styles.webCameraText}>Camera Preview</Text>
          <Text style={styles.webCameraSubtext}>
            Camera functionality available on mobile devices
          </Text>
        </View>
      );
    }

    if (!permission) {
      return <View style={styles.cameraContainer} />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Camera color="#9CA3AF" size={48} />
          <Text style={styles.permissionText}>
            Camera access needed for form analysis
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.cameraOverlay}>
          <View style={styles.formGuide}>
            <Text style={styles.formGuideText}>
              Position yourself in the frame
            </Text>
            <Text style={styles.formGuideSubtext}>
              Stand 3-4 feet from camera
            </Text>
          </View>
        </View>
      </CameraView>
    );
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    return (
      <View style={styles.resultContainer}>
        <View style={styles.scoreContainer}>
          <View
            style={[
              styles.scoreCircle,
              { borderColor: getScoreColor(analysisResult.score) },
            ]}
          >
            <Text
              style={[
                styles.scoreText,
                { color: getScoreColor(analysisResult.score) },
              ]}
            >
              {analysisResult.score}
            </Text>
            <Text style={styles.scoreLabel}>Form Score</Text>
          </View>
        </View>

        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>✅ Good Points</Text>
          {analysisResult.feedback.map((item, index) => (
            <View key={index} style={styles.feedbackItem}>
              <CheckCircle color="#10B981" size={16} />
              <Text style={styles.feedbackText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.improvementSection}>
          <Text style={styles.improvementTitle}>💡 Improvements</Text>
          {analysisResult.improvements.map((item, index) => (
            <View key={index} style={styles.improvementItem}>
              <AlertCircle color="#F59E0B" size={16} />
              <Text style={styles.improvementText}>{item}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setAnalysisResult(null)}
        >
          <Text style={styles.retryButtonText}>Analyze Again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
        <Animated.View style={[styles.modal, modalStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>AI Form Check</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.cameraContainer}>
            {renderCameraView()}

            {/* Analysis Overlay */}
            {isAnalyzing && (
              <Animated.View style={[styles.analysisOverlay, analyzeStyle]}>
                <Animated.View style={[styles.analysisIndicator, pulseStyle]}>
                  <Zap color="#3B82F6" size={32} />
                </Animated.View>
                <Text style={styles.analysisText}>Analyzing your form...</Text>
                <Text style={styles.analysisSubtext}>
                  Keep your position steady
                </Text>
              </Animated.View>
            )}

            {/* Camera Controls */}
            {!isAnalyzing && !analysisResult && (
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleCameraFacing}
                >
                  <RotateCcw color="white" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.analyzeButton}
                  onPress={handleStartAnalysis}
                >
                  <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    style={styles.analyzeButtonGradient}
                  >
                    <Zap color="white" size={24} />
                    <Text style={styles.analyzeButtonText}>Analyze Form</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Analysis Results */}
          {analysisResult && renderAnalysisResult()}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
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
  cameraContainer: {
    height: 300,
    backgroundColor: '#000',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  webCameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
  },
  webCameraText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
  },
  webCameraSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGuide: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  formGuideText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  formGuideSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  analysisOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  analysisText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  analysisSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resultContainer: {
    padding: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  improvementSection: {
    marginBottom: 24,
  },
  improvementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  improvementText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
