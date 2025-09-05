import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Task } from '../ClaudeCoordination';

interface TaskCardProps {
  task: Task;
  onPress?: (task: Task) => void;
  onLongPress?: (task: Task) => void;
  style?: any;
  showProgress?: boolean;
  compact?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onLongPress,
  style,
  showProgress = true,
  compact = false,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const progressWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: task.progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [task.progress]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'in_progress':
        return '#007AFF';
      case 'completed':
        return '#32CD32';
      case 'failed':
        return '#FF3B30';
      case 'cancelled':
        return '#8E8E93';
      default:
        return '#8E8E93';
    }
  };

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'urgent':
        return '#FF3B30';
      case 'high':
        return '#FF9500';
      case 'medium':
        return '#FFCC02';
      case 'low':
        return '#32CD32';
      default:
        return '#8E8E93';
    }
  };

  const getStatusIcon = (status: Task['status']): string => {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'in_progress':
        return 'play-arrow';
      case 'completed':
        return 'check-circle';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        compact && styles.compactContainer,
        { transform: [{ scale: scaleValue }] },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress?.(task)}
        onLongPress={() => onLongPress?.(task)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
        activeOpacity={0.9}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, compact && styles.compactTitle]} numberOfLines={compact ? 1 : 2}>
              {task.title}
            </Text>
            <View style={styles.badges}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <Icon
              name={getStatusIcon(task.status)}
              size={24}
              color={getStatusColor(task.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {task.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Description */}
        {!compact && task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Progress Bar */}
        {showProgress && task.status === 'in_progress' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(task.progress)}%</Text>
          </View>
        )}

        {/* Agents */}
        {!compact && task.assignedAgents.length > 0 && (
          <View style={styles.agentsContainer}>
            <Icon name="smart-toy" size={16} color="#8E8E93" />
            <Text style={styles.agentsText}>
              {task.assignedAgents.length} agent{task.assignedAgents.length !== 1 ? 's' : ''} assigned
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Icon name="access-time" size={14} color="#8E8E93" />
            <Text style={styles.timeText}>
              {task.status === 'completed' && task.actualDuration
                ? `Completed in ${formatDuration(task.actualDuration)}`
                : task.estimatedDuration
                ? `Est. ${formatDuration(task.estimatedDuration)}`
                : 'No estimate'}
            </Text>
          </View>
          
          <Text style={styles.dateText}>
            {formatDate(task.updatedAt)}
          </Text>
        </View>

        {/* Type indicator */}
        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(task.type) }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const getTypeColor = (type: Task['type']): string => {
  switch (type) {
    case 'development':
      return '#007AFF';
    case 'analysis':
      return '#5856D6';
    case 'testing':
      return '#32CD32';
    case 'deployment':
      return '#FF9500';
    case 'review':
      return '#AF52DE';
    default:
      return '#8E8E93';
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  compactContainer: {
    marginVertical: 3,
  },
  touchable: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
  },
  compactTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 4,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    minWidth: 35,
    textAlign: 'right',
  },
  agentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  agentsText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  typeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
});

export default TaskCard;