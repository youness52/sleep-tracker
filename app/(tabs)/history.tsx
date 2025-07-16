import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useSleepStore } from '@/store/sleepStore';
import SleepCard from '@/components/SleepCard';
import EditSessionModal from '@/components/EditSessionModal';
import { SleepSession } from '@/types/sleep';
import Colors from '@/constants/colors';

export default function HistoryScreen() {
  const { sessions } = useSleepStore();
  const [editingSession, setEditingSession] = useState<SleepSession | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleEdit = (session: SleepSession) => {
    setEditingSession(session);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setEditingSession(null);
  };
  
  // Group sessions by date
  const groupedSessions: { [key: string]: SleepSession[] } = {};
  sessions.forEach(session => {
    if (!session.date) return;
    
    if (!groupedSessions[session.date]) {
      groupedSessions[session.date] = [];
    }
    groupedSessions[session.date].push(session);
  });
  
  // Convert to array for FlatList
  const groupedData = Object.keys(groupedSessions)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map(date => ({
      date,
      sessions: groupedSessions[date],
    }));
  
  return (
    <View style={styles.container}>
      <FlatList
        data={groupedData}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>
              {new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {item.sessions.map((session) => (
              <SleepCard 
                key={session.id} 
                session={session} 
                onEdit={handleEdit}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sleep sessions recorded yet.</Text>
            <Text style={styles.emptySubtext}>
              Start tracking your sleep to see your history here.
            </Text>
          </View>
        }
        contentContainerStyle={
          sessions.length === 0 ? { flex: 1 } : { paddingVertical: 20 }
        }
      />
      
      <EditSessionModal
        visible={modalVisible}
        session={editingSession}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginTop: 8,
  },
});