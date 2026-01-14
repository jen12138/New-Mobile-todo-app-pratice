import { View, Text, StyleSheet, Pressable } from "react-native";
import { Todo } from "@/types/todo";

type Props = {
  todo: Todo;
  onDelete?: (id: number) => void;
  onToggleComplete?: (todo: Todo) => void;
};

export function TodoCard({ todo, onDelete, onToggleComplete }: Props) {
  const statusColor = todo.completed ? "#2ecc71" : "#f39c12";
  const statusLabel = todo.completed ? "Done" : "Pending";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{todo.title}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={styles.description}>{todo.description}</Text>

      <View style={styles.actions}>
        <Pressable
          style={[
            styles.actionButton,
            todo.completed && styles.disabledButton,
          ]}
          onPress={() => onToggleComplete?.(todo)}
          disabled={todo.completed}
        >
          <Text style={styles.actionText}>
            {todo.completed ? "Completed" : "Mark Done"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete?.(todo.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f1f1f",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#5c5c5c",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#247bff",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
  deleteButton: {
    backgroundColor: "#f5e6e6",
  },
  deleteText: {
    color: "#c0392b",
    fontWeight: "600",
  },
});
