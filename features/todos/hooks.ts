import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Todo } from "@/types/todo";

const TODOS_ENDPOINT = "http://localhost:4000/todos";
const TODOS_QUERY_KEY = ["todos"];

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(TODOS_ENDPOINT);

  if (!res.ok) {
    throw new Error("Failed to fetch todos");
  }

  return res.json();
};

export const useTodosQuery = () =>
  useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: fetchTodos,
  });

export const useAddTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => {
      const response = await fetch(TODOS_ENDPOINT, {
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
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${TODOS_ENDPOINT}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

export const useToggleTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todo: Todo) => {
      const updatedCompleted = !todo.completed;

      const res = await fetch(`${TODOS_ENDPOINT}/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updatedCompleted }),
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }

      return { ...todo, completed: updatedCompleted };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};
