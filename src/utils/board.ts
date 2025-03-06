import { BoardSections, Status, Task } from '../types';
import { BOARD_SECTIONS } from '../constants';
import { getTasksByStatus } from './tasks';

export const initializeBoard = (tasks: Task[]) => {
  const boardSections: BoardSections = {};
  const backlog = tasks.filter((todo)=>!todo.completed)
  const done = tasks.filter((todo)=>todo.completed)

  boardSections['backlog'] = backlog;
  boardSections['done'] = done;

  return boardSections;
};

export const findBoardSectionContainer = (
  boardSections: BoardSections,
  id: string
) => {
  if (id in boardSections) {
    return id;
  }

  const container = Object.keys(boardSections).find((key) =>
    boardSections[key].find((item:any) => item.id === id)
  );
  return container;
};
