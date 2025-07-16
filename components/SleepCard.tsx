import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons'; // 👈 Import Feather icons
import { formatDate, formatTime, formatDuration } from '@/utils/date';
import { SleepSession } from '@/types/sleep';
import { useSleepStore } from '@/store/sleepStore';
import Colors from '@/constants/colors';

interface SleepCardProps {
  session: SleepSession;
  onEdit?: (session: SleepSession) => void;
}

export default function SleepCard({ session, onEdit }: SleepCardProps) {
  const { deleteSession } = useSleepStore();

  const confirmDelete = () => {
    Alert.alert(
      'Delete Sleep Session',
      'Are you sure you want to delete this sleep session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => deleteSession(session.id),
          style: 'destructive',
        },
      ]
    );
  };

  if (!session.endTime || !session.duration) {
    return null;
  }

  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Feather name="calendar" size={18} color={Colors.dark.subtext} />
          <Text style={styles.date}>{formatDate(startDate)}</Text>
        </View>

        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(session)}
            >
              <Feather name="edit-2" size={18} color={Colors.dark.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={confirmDelete}>
            <Feather name="trash-2" size={18} color={Colors.dark.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeBlock}>
          <Feather name="moon" size={18} color={Colors.dark.primary} />
          <Text style={styles.timeLabel}>Bedtime</Text>
          <Text style={styles.timeValue}>{formatTime(startDate)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.timeBlock}>
          <Feather name="sun" size={18} color={Colors.dark.warning} />
          <Text style={styles.timeLabel}>Wake up</Text>
          <Text style={styles.timeValue}>{formatTime(endDate)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.timeBlock}>
          <Feather name="clock" size={18} color={Colors.dark.info} />
          <Text style={styles.timeLabel}>Duration</Text>
          <Text style={styles.timeValue}>
            {formatDuration(session.duration)}
          </Text>
        </View>
      </View>

      {session.notes ? (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notes}>{session.notes}</Text>
        </View>
      ) : null}
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 8,
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: Colors.dark.text,
  },
});
