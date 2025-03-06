export type Status = 'backlog' | 'done';

export type Task = {
  id: number | string;
  todo: string;
  completed: boolean;
  userId: number | string;
};

export type BoardSections = {
  [name: string]: Task[];
};

export type Action = 'update' | 'delete';

