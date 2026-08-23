"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/lib/types";

const STORAGE_KEY = "tasks";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTasks(JSON.parse(stored));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks([...tasks, { id: crypto.randomUUID(), text: trimmed, done: false }]);
    setText("");
  }

  function toggleTask(id: string) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id: string) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task…"
          aria-label="New task"
        />
        <button type="submit">Add</button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark "${task.text}" as ${task.done ? "not done" : "done"}`}
              />
              <span>{task.text}</span>
              <button
                type="button"
                className="secondary"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete "${task.text}"`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
