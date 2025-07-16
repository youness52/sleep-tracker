import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSleepStore } from '@/store/sleepStore';
import SleepTimer from '@/components/SleepTimer';
import SleepCard from '@/components/SleepCard';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const { sessions } = useSleepStore();
  
  // Get the most recent 3 sessions
  const recentSessions = sessions.slice(0, 3);
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sleep Tracker</Text>
          <Text style={styles.subtitle}>Track your sleep patterns</Text>
        </View>
        
        <SleepTimer />
        
        {recentSessions.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Recent Sleep</Text>
            
            {recentSessions.map((session) => (
              <SleepCard key={session.id} session={session} />
            ))}
          </View>
        )}
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
  recentContainer: {
    marginTop: 24,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
});