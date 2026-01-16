import { Controller, Control } from "react-hook-form";
import {
  Modal,
  Pressable,
  TextInput,
  View,
  Text,
  StyleSheet,
} from "react-native";


import type { TodoFormValues } from "@/app/calendar";

type AddTodoModalProps = {
  visible: boolean;
  control: Control<TodoFormValues>;
  onSubmit: () => void;
  onCancel: () => void;
  disabled?: boolean;
};

export function AddTodoModal({
  visible,
  control,
  onSubmit,
  onCancel,
  disabled = false,
}: AddTodoModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Add New Todo</Text>

          <Text style={styles.inputLabel}>Title*</Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter todo title"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter todo description"
                value={value}
                onChangeText={onChange}
                multiline
              />
            )}
          />

          <View style={styles.modalActions}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, disabled && { opacity: 0.6 }]}
              disabled={disabled}
              onPress={onSubmit}
            >
              <Text style={styles.primaryText}>Add Todo</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#5c5c5c",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdfe6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#1f1f1f",
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#247bff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
