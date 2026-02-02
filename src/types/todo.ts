import type { Timestamp } from 'firebase/firestore';

export type TodoPriority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TodoInput {
  title: string;
  priority: TodoPriority;
}
