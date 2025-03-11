import React, { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import { Task } from '../types';

const useTodo = () => {
  const [todos, setTodos] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/todos');
        if (!response.ok) {
          throw new Error(`Failed to fetch todos: ${response.status}`);
        }
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load todos');
        console.error('Error fetching todos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Setup real-time updates
  useEffect(() => {
    // Replace with your actual Pusher credentials
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || 'YOUR_PUSHER_KEY';
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'YOUR_PUSHER_CLUSTER';
    
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster
    });

    const channel = pusher.subscribe('tasks');
    channel.bind('update', (data: Task[]) => {
      setTodos(data);
    });

    return () => {
      pusher.unbind_all();
      pusher.unsubscribe('tasks');
    };
  }, []);

  const addTodo = useCallback(async (description: string, priority: Task['priority'] = 'medium') => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodo = await response.json();
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
      return null;
    }
  }, []);

  const toggleTodoStatus = useCallback(async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return null;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo status');
      }

      const updatedTodo = await response.json();
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      return null;
    }
  }, [todos]);

  return { 
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodoStatus
  };
};

export default useTodo; 