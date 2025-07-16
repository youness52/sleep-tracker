import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Svg, Rect, Text as SvgText, Line } from 'react-native-svg';
import { useSleepStore } from '@/store/sleepStore';
import { formatDuration } from '@/utils/date';
import Colors from '@/constants/colors';

type ChartPeriod = 'week' | 'month';

export default function SleepChart() {
  const [period, setPeriod] = useState<ChartPeriod>('week');
  const { getWeeklyData, getMonthlyData, getWeeklyStats, getMonthlyStats } = useSleepStore();
  
  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();
  
  const data = period === 'week' ? weeklyData : monthlyData;
  const stats = period === 'week' ? weeklyStats : monthlyStats;
  
  const chartWidth = Dimensions.get('window').width - 48;
  const chartHeight = 200;
  const barWidth = chartWidth / (period === 'week' ? 7 : 30) - 4;
  
  // Find the maximum duration for scaling
  const maxDuration = Math.max(
    ...data.map(item => item.duration),
    480 // Minimum of 8 hours for scale
  );
  
  // Calculate the scale factor
  const scaleY = (chartHeight - 40) / maxDuration;
  
  // Calculate recommended sleep (8 hours)
  const recommendedSleep = 480; // 8 hours in minutes
  const recommendedY = chartHeight - (recommendedSleep * scaleY) - 20;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sleep Stats</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'week' && styles.activePeriodButton,
            ]}
            onPress={() => setPeriod('week')}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === 'week' && styles.activePeriodButtonText,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'month' && styles.activePeriodButton,
            ]}
            onPress={() => setPeriod('month')}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === 'month' && styles.activePeriodButtonText,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatDuration(stats.averageDuration)}
          </Text>
          <Text style={styles.statLabel}>Average</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatDuration(stats.longestSession)}
          </Text>
          <Text style={styles.statLabel}>Longest</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Recommended sleep line */}
          <Line
            x1={0}
            y1={recommendedY}
            x2={chartWidth}
            y2={recommendedY}
            stroke={Colors.dark.info}
            strokeWidth={1}
            strokeDasharray="5,5"
          />
          <SvgText
            x={5}
            y={recommendedY - 5}
            fontSize={10}
            fill={Colors.dark.info}
          >
            8h
          </SvgText>
          
          {/* Render bars */}
          {data.map((item, index) => {
            const barHeight = item.duration * scaleY;
            const x = index * (barWidth + 4);
            const y = chartHeight - barHeight - 20;
            
            return (
              <React.Fragment key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={
                    item.duration >= recommendedSleep
                      ? Colors.dark.success
                      : item.duration >= recommendedSleep * 0.75
                      ? Colors.dark.primary
                      : Colors.dark.danger
                  }
                  rx={4}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight - 5}
                  fontSize={10}
                  fill={Colors.dark.subtext}
                  textAnchor="middle"
                >
                  {period === 'week' ? item.day : index % 5 === 0 ? index + 1 : ''}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: Colors.dark.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 4,
  },
  chartContainer: {
    height: 200,
    marginTop: 10,
  },
});