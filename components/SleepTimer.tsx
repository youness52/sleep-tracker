import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons'; // 👈 Replacing lucide-react-native
import { useSleepStore } from '@/store/sleepStore';
import { formatTime } from '@/utils/date';
import Colors from '@/constants/colors';

export default function SleepTimer() {
  const { isTracking, activeSleepSession, startSleep, endSleep } = useSleepStore();
  const [notes, setNotes] = useState('');
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking && activeSleepSession) {
      interval = setInterval(() => {
        const start = new Date(activeSleepSession.startTime);
        const now = new Date();
        const diff = now.getTime() - start.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTracking, activeSleepSession]);

  const handleStartSleep = () => {
    startSleep(notes);
    setNotes('');
  };

  const handleEndSleep = () => {
    endSleep();
    setElapsedTime('00:00:00');
  };

  return (
    <View style={styles.container}>
      {isTracking ? (
        <>
          <View style={styles.timerContainer}>
            <Feather name="clock" size={24} color={Colors.dark.primary} />
            <Text style={styles.timerText}>{elapsedTime}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Started at:</Text>
            <Text style={styles.infoValue}>
              {activeSleepSession && formatTime(new Date(activeSleepSession.startTime))}
            </Text>
          </View>

          {activeSleepSession?.notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{activeSleepSession.notes}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, styles.endButton]}
            onPress={handleEndSleep}
          >
            <Feather name="sun" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>End Sleep</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add notes about your sleep (optional)"
              placeholderTextColor={Colors.dark.subtext}
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={200}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartSleep}
          >
            <Feather name="moon" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Start Sleep</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.dark.card,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
    minHeight: 80,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  startButton: {
    backgroundColor: Colors.dark.primary,
  },
  endButton: {
    backgroundColor: Colors.dark.danger,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});
