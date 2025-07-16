import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // <-- Import the new library
import { Feather } from '@expo/vector-icons';
import { SleepSession } from '@/types/sleep';
import { useSleepStore } from '@/store/sleepStore';
import Colors from '@/constants/colors';

interface EditSessionModalProps {
  visible: boolean;
  session: SleepSession | null;
  onClose: () => void;
}

export default function EditSessionModal({
  visible,
  session,
  onClose,
}: EditSessionModalProps) {
  const { updateSession } = useSleepStore();

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');

  // --- NEW STATE MANAGEMENT ---
  // We only need one state to control picker visibility
  const [isPickerVisible, setPickerVisible] = useState(false);
  // And one state to know which date we are editing ('start' or 'end')
  const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');

  useEffect(() => {
    if (session) {
      setStartTime(new Date(session.startTime));
      setEndTime(session.endTime ? new Date(session.endTime) : new Date());
      setNotes(session.notes || '');
    }
  }, [session]);

  const handleSave = () => {
    if (!session) return;
    updateSession(session.id, {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      notes,
    });
    onClose();
  };

  // --- NEW HANDLER FUNCTIONS ---
  const showDateTimePicker = (mode: 'start' | 'end') => {
    setPickerMode(mode);
    setPickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    if (pickerMode === 'start') {
      setStartTime(date);
    } else {
      setEndTime(date);
    }
    hideDateTimePicker();
  };

  if (!session) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Sleep Session</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.label}>Start Time</Text>
            {/* Pressing this now calls our new function */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => showDateTimePicker('start')}
            >
              <Text style={styles.dateText}>{startTime.toLocaleString()}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>End Time</Text>
            {/* Pressing this now calls our new function */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => showDateTimePicker('end')}
            >
              <Text style={styles.dateText}>{endTime.toLocaleString()}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.input}
              placeholder="Add notes about your sleep"
              placeholderTextColor={Colors.dark.subtext}
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={200}
            />
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Feather name="save" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* --- NEW DATETIME PICKER COMPONENT --- */}
      {/* It sits outside the main view and is controlled by state */}
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        // Show the correct date depending on which button was pressed
        date={pickerMode === 'start' ? startTime : endTime}
        onConfirm={handleConfirm}
        onCancel={hideDateTimePicker}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
    maxHeight: 400,
  },
  label: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 8,
    marginTop: 16,
  },
  datePickerButton: {
    backgroundColor: Colors.dark.background,
    padding: 12,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});