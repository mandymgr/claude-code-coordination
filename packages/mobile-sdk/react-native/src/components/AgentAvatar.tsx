import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AIAgent } from '../ClaudeCoordination';

interface AgentAvatarProps {
  agent: AIAgent;
  onPress?: (agent: AIAgent) => void;
  size?: 'small' | 'medium' | 'large';
  showStatus?: boolean;
  showName?: boolean;
  showStats?: boolean;
  style?: any;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  onPress,
  size = 'medium',
  showStatus = true,
  showName = false,
  showStats = false,
  style,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const pulseValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (agent.status === 'busy') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      pulseValue.setValue(1);
    }
  }, [agent.status]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getSizeConfig = (size: string) => {
    switch (size) {
      case 'small':
        return {
          containerSize: 40,
          iconSize: 20,
          fontSize: 12,
          statusSize: 12,
        };
      case 'large':
        return {
          containerSize: 80,
          iconSize: 40,
          fontSize: 18,
          statusSize: 20,
        };
      default: // medium
        return {
          containerSize: 60,
          iconSize: 30,
          fontSize: 14,
          statusSize: 16,
        };
    }
  };

  const getAgentIcon = (type: AIAgent['type']): string => {
    switch (type) {
      case 'claude':
        return 'psychology';
      case 'gpt4':
        return 'smart-toy';
      case 'gemini':
        return 'auto-awesome';
      case 'custom':
        return 'extension';
      default:
        return 'android';
    }
  };

  const getAgentColor = (type: AIAgent['type']): string => {
    switch (type) {
      case 'claude':
        return '#FF6B35';
      case 'gpt4':
        return '#10A37F';
      case 'gemini':
        return '#4285F4';
      case 'custom':
        return '#8E44AD';
      default:
        return '#95A5A6';
    }
  };

  const getStatusColor = (status: AIAgent['status']): string => {
    switch (status) {
      case 'available':
        return '#32CD32';
      case 'busy':
        return '#FFA500';
      case 'offline':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const formatPerformance = (performance: AIAgent['performance']): string => {
    const { successRate, averageResponseTime } = performance;
    return `${Math.round(successRate * 100)}% • ${Math.round(averageResponseTime)}ms`;
  };

  const sizeConfig = getSizeConfig(size);

  const avatarContent = (
    <Animated.View
      style={[
        styles.container,
        {
          width: sizeConfig.containerSize,
          height: sizeConfig.containerSize,
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.avatar,
          {
            width: sizeConfig.containerSize,
            height: sizeConfig.containerSize,
            backgroundColor: getAgentColor(agent.type),
            transform: [{ scale: pulseValue }],
          },
        ]}
      >
        <Icon
          name={getAgentIcon(agent.type)}
          size={sizeConfig.iconSize}
          color="#FFFFFF"
        />
      </Animated.View>

      {showStatus && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: sizeConfig.statusSize,
              height: sizeConfig.statusSize,
              backgroundColor: getStatusColor(agent.status),
            },
          ]}
        />
      )}
    </Animated.View>
  );

  const content = onPress ? (
    <TouchableOpacity
      onPress={() => onPress(agent)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      {avatarContent}
    </TouchableOpacity>
  ) : (
    avatarContent
  );

  if (!showName && !showStats) {
    return content;
  }

  return (
    <View style={styles.fullContainer}>
      {content}
      {showName && (
        <Text
          style={[
            styles.name,
            { fontSize: sizeConfig.fontSize },
          ]}
          numberOfLines={1}
        >
          {agent.name}
        </Text>
      )}
      {showStats && (
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {formatPerformance(agent.performance)}
          </Text>
          <Text style={styles.tasksText}>
            {agent.performance.tasksCompleted} tasks
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    alignItems: 'center',
    margin: 8,
  },
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    marginTop: 8,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    maxWidth: 100,
  },
  stats: {
    marginTop: 4,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  tasksText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
});

export default AgentAvatar;