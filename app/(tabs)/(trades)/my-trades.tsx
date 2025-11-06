import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/common';
import { tradingApi } from '../../../services/tradingApi';
import { TradingOrder } from '../../../types/trading';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';

type FilterType = 'all' | 'color' | 'number';

export default function MyTrades() {
  const [trades, setTrades] = useState<TradingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Fetch trades from API
  const fetchTrades = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const orders = await tradingApi.myOrders({ limit: 50 });
      setTrades(orders);
    } catch (error: any) {
      console.error('Failed to fetch trades:', error);
      Alert.alert('Error', 'Failed to load your trades. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrades(false);
    setRefreshing(false);
  };

  // Filter trades by game type - with safety check
  const filteredTrades = Array.isArray(trades) ? trades.filter(trade => {
    if (filterType === 'all') return true;
    
    // Handle both 'color'/'colour' and 'number' variants
    const gameType = (trade.gameType || '').toLowerCase();
    const tradeType = (trade as any).tradeType?.toLowerCase() || '';
    const roundType = (trade as any).roundType?.toLowerCase() || '';
    
    if (filterType === 'color') {
      return gameType === 'color' || gameType === 'colour' || 
             tradeType === 'colour' || roundType === 'colour';
    }
    
    if (filterType === 'number') {
      return gameType === 'number' || tradeType === 'number' || roundType === 'number';
    }
    
    return false;
  }) : [];

  // Calculate stats - with safety checks
  const stats = {
    total: filteredTrades.length,
    totalAmount: filteredTrades.reduce((sum, t) => sum + (t.totalAmount || 0), 0),
    totalPayout: filteredTrades.reduce((sum, t) => sum + (t.payout || 0), 0),
    won: filteredTrades.filter(t => t.status === 'won').length,
    lost: filteredTrades.filter(t => t.status === 'lost').length,
    pending: filteredTrades.filter(t => t.status === 'placed').length,
  };

  // Format date
  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    
    // Check if date is valid
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return Colors.success;
      case 'lost':
        return Colors.error;
      case 'refunded':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return 'checkmark-circle';
      case 'lost':
        return 'close-circle';
      case 'refunded':
        return 'refresh-circle';
      default:
        return 'time';
    }
  };

  // Render trade card
  const renderTradeCard = (trade: TradingOrder) => {
    // Get the actual round type from the trade data
    const roundType = (trade as any).roundType || trade.gameType || '';
    const isColorTrade = roundType.toLowerCase().includes('colour') || roundType.toLowerCase().includes('color');
    
    // Extract selections from the nested structure
    let selections: Array<{ option: string; amount: number }> = [];
    
    if (Array.isArray(trade.selections)) {
      selections = trade.selections;
    } else {
      // Handle nested colorTrades/numberTrades structure
      const tradeData = trade as any;
      if (tradeData.colorTrades) {
        Object.entries(tradeData.colorTrades).forEach(([color, trades]: [string, any]) => {
          if (Array.isArray(trades)) {
            trades.forEach((t: any) => {
              selections.push({ option: color, amount: t.amount || 0 });
            });
          }
        });
      }
      if (tradeData.numberTrades) {
        Object.entries(tradeData.numberTrades).forEach(([number, trades]: [string, any]) => {
          if (Array.isArray(trades)) {
            trades.forEach((t: any) => {
              selections.push({ option: number, amount: t.amount || 0 });
            });
          }
        });
      }
    }
    
    return (
      <View style={styles.tradeCard}>
        {/* Header */}
        <View style={styles.tradeHeader}>
          <View style={styles.tradeHeaderLeft}>
            <View style={[styles.gameTypeBadge, { backgroundColor: isColorTrade ? '#EC4899' : '#3B82F6' }]}>
              <Text style={styles.gameTypeText}>
                {isColorTrade ? '🎨 Color' : '🔢 Number'}
              </Text>
            </View>
            <Text style={styles.roundText}>Round #{trade.roundId?.slice(-6) || 'N/A'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trade.status) }]}>
            <Ionicons name={getStatusIcon(trade.status)} size={14} color={Colors.white} />
            <Text style={styles.statusText}>{trade.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Selections */}
        {selections.length > 0 && (
          <View style={styles.selectionsSection}>
            <Text style={styles.selectionsLabel}>Your Bets:</Text>
            <View style={styles.selectionsGrid}>
              {selections.map((selection, index) => (
                <View key={index} style={styles.selectionChip}>
                  <Text style={styles.selectionText}>
                    {selection.option} • ₹{selection.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Amounts */}
        <View style={styles.amountsSection}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total Bet:</Text>
            <Text style={styles.amountValue}>₹{trade.totalAmount || 0}</Text>
          </View>
          {trade.payout > 0 && (
            <View style={styles.amountRow}>
              <Text style={[styles.amountLabel, { color: Colors.success }]}>Payout:</Text>
              <Text style={[styles.amountValue, { color: Colors.success, fontWeight: Typography.fontWeight.bold }]}>
                +₹{trade.payout}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.tradeFooter}>
          <Text style={styles.dateText}>{formatDate(trade.createdAt)}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Trades</Text>
            <Text style={styles.subtitle}>View your trading history</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={refreshing || loading}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        {!loading && trades.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.statLabel}>Total Trades</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#10B981' }]}>
              <Text style={styles.statLabel}>Won</Text>
              <Text style={styles.statValue}>{stats.won}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.statLabel}>Lost</Text>
              <Text style={styles.statValue}>{stats.lost}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F59E0B' }]}>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={styles.statValue}>{stats.pending}</Text>
            </View>
          </View>
        )}

        {/* Filter Tabs */}
        {!loading && trades.length > 0 && (
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterTab, filterType === 'all' && styles.activeFilterTab]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filterType === 'color' && styles.activeFilterTab]}
              onPress={() => setFilterType('color')}
            >
              <Text style={[styles.filterText, filterType === 'color' && styles.activeFilterText]}>
                🎨 Color
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filterType === 'number' && styles.activeFilterTab]}
              onPress={() => setFilterType('number')}
            >
              <Text style={[styles.filterText, filterType === 'number' && styles.activeFilterText]}>
                🔢 Number
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        >
          {/* Loading State */}
          {loading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading your trades...</Text>
            </View>
          )}

          {/* Empty State */}
          {!loading && filteredTrades.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="list-outline" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Trades Found</Text>
              <Text style={styles.emptyText}>
                {trades.length === 0 
                  ? "You haven't placed any trades yet"
                  : `No ${filterType} trades found`
                }
              </Text>
            </View>
          )}

          {/* Trades List */}
          {!loading && filteredTrades.length > 0 && (
            <View style={styles.tradesContainer}>
              {filteredTrades.map((trade, index) => (
                <React.Fragment key={trade.id || `trade-${index}`}>
                  {renderTradeCard(trade)}
                </React.Fragment>
              ))}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    padding: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['6xl'],
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['6xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tradesContainer: {
    padding: Spacing.lg,
  },
  tradeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tradeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gameTypeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  gameTypeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  roundText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  selectionsSection: {
    marginBottom: Spacing.md,
  },
  selectionsLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  selectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  selectionChip: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  amountsSection: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  amountValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  tradeFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  dateText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});
