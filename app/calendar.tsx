import styles from "./calendar.styles";
import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useForm, Controller } from "react-hook-form";

import { FilterTabs } from "@/features/todos/components/FilterTabs";
import type { Todo } from "@/types/todo";


import { TodoCard } from "@/Components/TodoCard";
import { AddTodoModal } from "@/Components/AddTodoModal";
import {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useTodosQuery,
  useToggleTodoMutation,
} from "@/features/todos/hooks";


 export type TodoFormValues = {
  title: string;
  description: string;
};



export default function CalendarScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues:{ title:"", description:"" }
  }) 

  const titleValue = watch("title");
  const descriptionValue = watch("description")

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useTodosQuery();
  const addTodoMutation = useAddTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();
  const toggleTodoMutation = useToggleTodoMutation();

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

  function handleAddTodo(values: TodoFormValues) {
    const {title, description } =values;
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
        <FilterTabs
  filter={filter}
  counts={{ all: todos.length, active: activeCount, completed: completedCount }}
  onChange={setFilter}
/>

          
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

      <AddTodoModal
        visible={isModalOpen}
        control={control}
        onSubmit={handleSubmit(handleAddTodo)}
        onCancel={closeModal}
        disabled={!(titleValue.trim() && descriptionValue.trim())}
      />

    </SafeAreaView>
  );
}
