import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TradingRound } from '@/types/trading';

interface RoundsListProps {
  rounds: TradingRound[];
  selectedRoundId: string | null;
  onSelectRound: (roundId: string) => void;
  title: string;
  emptyMessage?: string;
}

// Helper to format date
const formatDateTime = (date: any): string => {
  if (!date) return 'N/A';
  
  try {
    let dateObj: Date;
    
    // Handle Firestore Timestamp serialized from backend (has _seconds and _nanoseconds)
    if (date._seconds !== undefined) {
      dateObj = new Date(date._seconds * 1000);
    }
    // Handle Date object
    else if (date instanceof Date) {
      dateObj = date;
    } 
    // Handle string or number timestamp
    else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } 
    else {
      return 'N/A';
    }
    
    // Validate the date
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    
    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    // If in the past
    if (diffMs < 0) {
      return dateObj.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // If less than 60 minutes away
    if (diffMins < 60) {
      return `in ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    }
    
    // If less than 24 hours away
    if (diffHours < 24) {
      return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
    
    // Otherwise show date
    return dateObj.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'N/A';
  }
};

// Get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'upcoming':
      return '⏳';
    case 'active':
    case 'open':
      return '▶️';
    case 'closed':
      return '🔒';
    case 'completed':
    case 'settled':
      return '✅';
    case 'cancelled':
      return '❌';
    default:
      return '⏸️';
  }
};

export const RoundsList: React.FC<RoundsListProps> = ({
  rounds,
  selectedRoundId,
  onSelectRound,
  title,
  emptyMessage = 'No rounds available'
}) => {
  if (rounds.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🕐</Text>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>({rounds.length})</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roundsScroll}>
        {rounds.map((round) => {
          const isSelected = selectedRoundId === round.id;
          const canSelect = round.status === 'active' || round.status === 'open' || round.status === 'upcoming';
          
          return (
            <TouchableOpacity
              key={round.id}
              onPress={() => canSelect && onSelectRound(round.id)}
              disabled={!canSelect}
              style={[
                styles.roundCard,
                isSelected && styles.roundCardSelected,
                !canSelect && styles.roundCardDisabled
              ]}
            >
              {/* Status Icon */}
              <Text style={styles.statusIcon}>{getStatusIcon(round.status)}</Text>
              
              {/* Round Info */}
              <View style={styles.roundInfo}>
                <View style={styles.roundHeader}>
                  <Text style={[styles.roundNumber, isSelected && styles.textWhite]}>
                    Round #{round.roundNumber}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    isSelected && styles.statusBadgeSelected
                  ]}>
                    <Text style={[styles.statusText, isSelected && styles.statusTextSelected]}>
                      {round.status === 'active' || round.status === 'open' ? 'ACTIVE' : round.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.roundId, isSelected && styles.textWhite]}>
                  ID: {round.roundId?.substring(0, 8) || round.id.substring(0, 8)}
                </Text>

                {/* Stats */}
                <View style={styles.statsRow}>
                  {/* Trades Count */}
                  <View style={styles.statBox}>
                    <Text style={[styles.statLabel, isSelected && styles.textWhite]}>Trades</Text>
                    <Text style={[styles.statValue, isSelected && styles.textWhite]}>
                      {round.totalTrades || 0}
                    </Text>
                  </View>

                  {/* Start Time */}
                  {round.startTime && (round.status === 'upcoming' || round.status === 'active') && (
                    <View style={[styles.timeBox, isSelected && styles.timeBoxSelected]}>
                      <Text style={[styles.timeLabel, isSelected && styles.timeLabelSelected]}>
                        🕐 Starts
                      </Text>
                      <Text style={[styles.timeValue, isSelected && styles.timeValueSelected]}>
                        {formatDateTime(round.startTime)}
                      </Text>
                    </View>
                  )}

                  {/* Closing Time */}
                  {round.resultDeclarationTime && (round.status === 'active' || round.status === 'open') && (
                    <View style={[styles.timeBox, isSelected && styles.timeBoxSelected]}>
                      <Text style={[styles.timeLabel, isSelected && styles.timeLabelSelected]}>
                        🔒 Closes
                      </Text>
                      <Text style={[styles.timeValue, isSelected && styles.timeValueSelected]}>
                        {formatDateTime(round.resultDeclarationTime)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Selected Indicator */}
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  count: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  emptyContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  roundsScroll: {
    flexGrow: 0,
  },
  roundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    marginRight: 12,
    width: 280,
    position: 'relative',
  },
  roundCardSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  roundCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F3F4F6',
  },
  statusIcon: {
    fontSize: 24,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  roundInfo: {
    flex: 1,
  },
  roundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  roundNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#065F46',
  },
  statusTextSelected: {
    color: '#FFFFFF',
  },
  roundId: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  timeBox: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBoxSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeLabel: {
    fontSize: 10,
    color: '#1E40AF',
    marginBottom: 2,
  },
  timeLabelSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  timeValueSelected: {
    color: '#FFFFFF',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  textWhite: {
    color: '#FFFFFF',
  },
});

export default RoundsList;
