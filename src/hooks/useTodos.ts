import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/firebase';
import type { Todo, TodoPriority } from '../types/todo';

const COLLECTION = 'todos';
const TITLE_MAX_LENGTH = 500;

const priorityOrder: Record<TodoPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function sortTodos(list: Todo[]): Todo[] {
  return [...list].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.priority !== b.priority)
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    return 0;
  });
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase 모드: 실시간 구독
  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError(null);
      return;
    }

    const q = query(
      collection(db, COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Todo[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? '',
            completed: data.completed ?? false,
            priority: (data.priority ?? 'medium') as TodoPriority,
            createdAt: data.createdAt as Timestamp,
            updatedAt: data.updatedAt as Timestamp,
          };
        });
        setTodos(sortTodos(list));
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message ?? '데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 로컬 모드: Firebase 없을 때 CRUD
  const addTodo = useCallback(
    (title: string, priority: TodoPriority) => {
      const trimmed = title.trim();
      if (!trimmed || trimmed.length > TITLE_MAX_LENGTH) return;

      const id = uuidv4();
      const now = Timestamp.fromDate(new Date());
      const newTodo: Todo = {
        id,
        title: trimmed,
        completed: false,
        priority,
        createdAt: now,
        updatedAt: now,
      };

      if (db) {
        setDoc(doc(db, COLLECTION, id), {
          id,
          title: trimmed,
          completed: false,
          priority,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).catch((err) => setError(err.message));
      } else {
        setTodos((prev) => sortTodos([...prev, newTodo]));
      }
    },
    []
  );

  const updateTodo = useCallback(
    (
      id: string,
      updates: Partial<Pick<Todo, 'title' | 'completed' | 'priority'>>
    ) => {
      if (db) {
        const ref = doc(db, COLLECTION, id);
        const payload = { ...updates, updatedAt: serverTimestamp() };
        updateDoc(ref, payload).catch((err) => setError(err.message));
      } else {
        setTodos((prev) =>
          sortTodos(
            prev.map((t) =>
              t.id === id
                ? { ...t, ...updates, updatedAt: Timestamp.fromDate(new Date()) }
                : t
            )
          )
        );
      }
    },
    []
  );

  const deleteTodo = useCallback((id: string) => {
    if (db) {
      deleteDoc(doc(db, COLLECTION, id)).catch((err) => setError(err.message));
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  const toggleComplete = useCallback(
    (id: string, completed: boolean) => {
      updateTodo(id, { completed });
    },
    [updateTodo]
  );

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    isConfigured: !!db,
  };
}
