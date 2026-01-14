import { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { Todo } from "@/types/todo";
import { TodoCard } from "@/Components/TodoCard";
import { ResourceSavingView } from "@react-navigation/elements";

export default function CalendarScreen() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  async function fetchTodos(): Promise<Todo[]> {
    const res = await fetch(`http://localhost:4000/todos`);
    if (!res.ok) throw new Error("Failed to fetch todos");
    return res.json();
  }

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const emptyMessage =
    filter === "all"
      ? "No tasks scheduled."
      : filter === "active"
      ? "No active tasks."
      : "No completed tasks.";

  const addTodoMutation = useMutation({
    mutationFn: async ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => {
      const response = await fetch(`http://localhost:4000/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, completed: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      return response.json() as Promise<Todo>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:4000/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete todo");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const updatedCompleted = !todo.completed;
      const res = await fetch(`http://localhost:4000/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updatedCompleted }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      return { ...todo, completed: updatedCompleted };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  function handleDeleteTodo(id: number) {
    deleteTodoMutation.mutate(id, {
      onError: (err) => {
        alert(err instanceof Error ? err.message : "Failed to delete todo");
      },
    });
  }

  function handleToggleTodo(todo: Todo) {
    toggleTodoMutation.mutate(todo, {
      onError: (err) => {
        alert(err instanceof Error ? err.message : "Failed to update todo");
      },
    });
  }

  function handleAddTodo() {
    if (!(title.trim() && description.trim())) return;

    addTodoMutation.mutate(
      { title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          closeModal();
        },
        onError: (err) => {
          alert(err instanceof Error ? err.message : "Failed to add todo");
        },
      }
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.filterRow}>
          <Pressable
            style={[
              styles.filterButton,
              filter === "all" && styles.filterButtonActive,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "all" && styles.filterTextActive,
              ]}
            >
              {`All (${todos.length})`}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === "active" && styles.filterButtonActive,
            ]}
            onPress={() => setFilter("active")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "active" && styles.filterTextActive,
              ]}
            >
              {`Active (${activeCount})`}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === "completed" && styles.filterButtonActive,
            ]}
            onPress={() => setFilter("completed")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "completed" && styles.filterTextActive,
              ]}
            >
              {`Completed (${completedCount})`}
            </Text>
          </Pressable>
        </View>
        <View>
          <Text style={styles.title}>Calendar / To-Do Page</Text>
          <Text style={styles.subtitle}>Your tasks for today</Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={styles.addButtonText}>Add Todo</Text>
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        {isLoading && (
          <ActivityIndicator size="large" color="#247bff" testID="loading" />
        )}

        {!isLoading && isError ? (
          <Text style={styles.errorText}>
            {(error as Error)?.message ?? "Failed to load todos"}
          </Text>
        ) : (
          <FlatList
            data={filteredTodos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TodoCard
                todo={item}
                onDelete={handleDeleteTodo}
                onToggleComplete={handleToggleTodo}
              />
            )}
            contentContainerStyle={
              todos.length === 0 && !isLoading
                ? styles.emptyListContent
                : styles.listContent
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            }
          />
        )}
      </View>

      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Todo</Text>

            <Text style={styles.inputLabel}>Title*</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter todo title"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Description*</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter todo description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.primaryButton,
                  !(title.trim() && description.trim()) && { opacity: 0.6 },
                ]}
                disabled={!(title.trim() && description.trim())}
                onPress={handleAddTodo}
              >
                <Text style={styles.primaryText}>Add Todo</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f1f1f",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderColor: "#dcdfe6",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#247bff",
    borderColor: "#247bff",
  },
  filterText: {
    fontSize: 14,
    color: "#5c5c5c",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#5c5c5c",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#5c5c5c",
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#247bff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
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
