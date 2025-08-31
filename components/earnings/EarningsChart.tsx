import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Card from '../common/Card';

const { width } = Dimensions.get('window');

const EarningsChart: React.FC = () => {
  // Mock data for the chart - in a real app, this would come from API
  const weeklyData = [
    { day: 'Mon', earnings: 45 },
    { day: 'Tue', earnings: 60 },
    { day: 'Wed', earnings: 35 },
    { day: 'Thu', earnings: 80 },
    { day: 'Fri', earnings: 55 },
    { day: 'Sat', earnings: 70 },
    { day: 'Sun', earnings: 50 },
  ];

  const maxEarnings = Math.max(...weeklyData.map(d => d.earnings));
  const chartWidth = width - 80; // Accounting for padding
  const chartHeight = 150;

  return (
    <Card>
      <Text style={styles.title}>Weekly Earnings Chart</Text>
      <Text style={styles.subtitle}>Your earnings performance this week</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {weeklyData.map((item, index) => {
            const barHeight = (item.earnings / maxEarnings) * chartHeight;
            const barWidth = (chartWidth - 60) / weeklyData.length - 10;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: barHeight, 
                        width: barWidth,
                        backgroundColor: index === 6 ? '#007bff' : '#28a745' // Highlight current day
                      }
                    ]} 
                  />
                  <Text style={styles.barValue}>₹{item.earnings}</Text>
                </View>
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.summaryStats}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>₹{weeklyData.reduce((sum, d) => sum + d.earnings, 0)}</Text>
          <Text style={styles.statLabel}>Total This Week</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>₹{Math.round(weeklyData.reduce((sum, d) => sum + d.earnings, 0) / 7)}</Text>
          <Text style={styles.statLabel}>Daily Average</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>₹{Math.max(...weeklyData.map(d => d.earnings))}</Text>
          <Text style={styles.statLabel}>Best Day</Text>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#28a745' }]} />
          <Text style={styles.legendText}>Previous Days</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#007bff' }]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 180,
    paddingBottom: 30,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 150,
  },
  bar: {
    borderRadius: 4,
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    position: 'absolute',
    bottom: -25,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default EarningsChart;
