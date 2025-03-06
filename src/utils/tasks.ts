import { Task, Status } from '../types';

export const getTasksByStatus = (tasks: Task[], status: Status) => {
  return tasks.filter((task) => status === "backlog"? !task.completed : task.completed );
};

export const getTaskById = (tasks: Task[], id: string) => {
  return tasks.find((task) => task.id === id);
};
