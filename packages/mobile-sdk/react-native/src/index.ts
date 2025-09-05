// Main SDK exports
export { ClaudeCoordination } from './ClaudeCoordination';
export type {
  ClaudeCoordinationConfig,
  AIAgent,
  Task,
  Project,
  MobileAnalytics,
} from './ClaudeCoordination';

// Hooks
export { useClaudeCoordination } from './hooks/useClaudeCoordination';
export type { UseClaudeCoordinationOptions } from './hooks/useClaudeCoordination';

// Components
export { TaskCard } from './components/TaskCard';
export { AgentAvatar } from './components/AgentAvatar';

// Utilities
export * from './utils/constants';
export * from './utils/helpers';

// Re-export common React Native dependencies for convenience
export {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';