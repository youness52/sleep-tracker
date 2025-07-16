import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSleepStore } from '@/store/sleepStore';
import SleepChart from '@/components/SleepChart';
import { formatDuration } from '@/utils/date';
import Colors from '@/constants/colors';
import { Feather } from '@expo/vector-icons'; // 👈 Import Feather

export default function StatsScreen() {
  const { sessions, getWeeklyStats, getMonthlyStats } = useSleepStore();

  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  const totalSleepTime = sessions.reduce(
    (total, session) => total + (session.duration || 0),
    0
  );

  const averageSleepTime = sessions.length > 0
    ? totalSleepTime / sessions.length
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sleep Statistics</Text>
          <Text style={styles.subtitle}>
            {sessions.length} sleep {sessions.length === 1 ? 'session' : 'sessions'} recorded
          </Text>
        </View>

        <View style={styles.overviewContainer}>
          <View style={styles.overviewItem}>
            <View style={styles.iconContainer}>
              <Feather name="clock" size={24} color={Colors.dark.primary} />
            </View>
            <Text style={styles.overviewValue}>
              {formatDuration(averageSleepTime)}
            </Text>
            <Text style={styles.overviewLabel}>Average Sleep</Text>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.iconContainer}>
              <Feather name="moon" size={24} color={Colors.dark.primary} />
            </View>
            <Text style={styles.overviewValue}>
              {formatDuration(totalSleepTime)}
            </Text>
            <Text style={styles.overviewLabel}>Total Sleep</Text>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.iconContainer}>
              <Feather name="calendar" size={24} color={Colors.dark.primary} />
            </View>
            <Text style={styles.overviewValue}>
              {sessions.length}
            </Text>
            <Text style={styles.overviewLabel}>Sessions</Text>
          </View>
        </View>

        <SleepChart />

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Sleep Quality Tips</Text>

          <View style={styles.tipContainer}>
            <Text style={styles.tipNumber}>1</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Consistent Schedule</Text>
              <Text style={styles.tipText}>
                Go to bed and wake up at the same time every day, even on weekends.
              </Text>
            </View>
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.tipNumber}>2</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Limit Screen Time</Text>
              <Text style={styles.tipText}>
                Avoid screens at least 1 hour before bedtime to improve sleep quality.
              </Text>
            </View>
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.tipNumber}>3</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Create a Relaxing Environment</Text>
              <Text style={styles.tipText}>
                Keep your bedroom cool, dark, and quiet for optimal sleep.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop:20,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginTop: 4,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.dark.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  overviewLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.dark.primary,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    lineHeight: 20,
  },
});
