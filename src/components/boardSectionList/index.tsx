import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { INITIAL_TASKS } from '../../data';
import { Action, BoardSections as BoardSectionsType, Task } from '../../types';
import { getTaskById } from '../../utils/tasks';
import { findBoardSectionContainer, initializeBoard } from '../../utils/board';
import BoardSection from '../boardSection';
import TaskItem from '../taskItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, CircularProgress } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
const BoardSectionList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const initialBoardSections = initializeBoard(INITIAL_TASKS);
  const [boardSections, setBoardSections] =
    useState<BoardSectionsType>(initialBoardSections);
  const [taskInput, setTaskInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    // Find the containers
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setBoardSections((boardSection) => {
      const activeItems = boardSection[activeContainer];
      const overItems = boardSection[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...boardSection,
        [activeContainer]: [
          ...boardSection[activeContainer].filter(
            (item) => item.id !== active.id
          )
        ],
        [overContainer]: [
          ...boardSection[overContainer].slice(0, overIndex),
          boardSections[activeContainer][activeIndex],
          ...boardSection[overContainer].slice(
            overIndex,
            boardSection[overContainer].length
          )
        ]
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = boardSections[activeContainer].findIndex(
      (task) => task.id === active.id
    );
    const overIndex = boardSections[overContainer].findIndex(
      (task) => task.id === over?.id
    );

    if (activeIndex !== overIndex) {
      setBoardSections((boardSection) => ({
        ...boardSection,
        [overContainer]: arrayMove(
          boardSection[overContainer],
          activeIndex,
          overIndex
        )
      }));
    }

    setActiveTaskId(null);
  };


  const addTask = () => {
    if (!taskInput.trim()) return;

    setIsAdding(true)

    fetch('https://dummyjson.com/todos/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: taskInput,
        completed: false,
        userId: 5
      })
    })
      .then((res) => res.json())
      .then((newTask:Task) => {
        const defaultSection = 'backlog';
        newTask.id = uuidv4();
        setBoardSections((prevBoardSections) => ({
          ...prevBoardSections,
          [defaultSection]: [newTask,...prevBoardSections[defaultSection]]
        }));

        setTasks((prevTasks) => [newTask,...prevTasks]);

        setTaskInput('');
      })
    .finally(()=>setIsAdding(false))
      
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation
  };

  const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;

  const handleAction = async (id: string | number, action: Action, data?: string) => {
    console.log("test",id,action,data);
    
    if (!id) return;
  
    if (action === "delete") {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  
      setBoardSections((prevBoardSections) => {
        const updatedSections = { ...prevBoardSections };
        for (const section in updatedSections) {
          updatedSections[section] = updatedSections[section].filter((task) => task.id !== id);
        }
        return updatedSections;
      });
    }
  
    if (action === "update" && data) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? { ...task, todo: data } : task))
      );

      setBoardSections((prevBoardSections) => {
        const updatedSections = { ...prevBoardSections };
        for (const section in updatedSections) {
          updatedSections[section] = updatedSections[section].map((task) =>
            task.id === id ? { ...task, todo: data } : task
          );
        }
        return updatedSections;
      });
    }
  };
  

  useEffect(() => {
    setIsLoading(true)
    fetch('https://dummyjson.com/todos')
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const tasks = res.todos;
        const boardSections = initializeBoard(tasks);
        setBoardSections(boardSections);
        setTasks(tasks);
      })
    .finally(()=>setIsLoading(false))
      
  }, []);

  if (isLoading) 
    return (
      <Container style={{ padding: '10px', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      </Container>
    );

  return (
    <Container style={{ padding: '10px' }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        style={{ marginBottom: '10px' }}
      >
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="New Task"
            variant="outlined"
            value={taskInput}
            size="small"
            onChange={(e) => setTaskInput(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={addTask}
            disabled={isAdding}
          >
             {isAdding? "Loading..." :"Add Task"}
          </Button>
        </Grid>
      </Grid>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Grid container spacing={2}>
          {Object.keys(boardSections).map((boardSectionKey) => (
            <Grid item xs={6} sm={6} key={boardSectionKey}>
              <BoardSection
                id={boardSectionKey}
                title={boardSectionKey}
                tasks={boardSections[boardSectionKey]}
                callBack={handleAction}
              />
            </Grid>
          ))}
          <DragOverlay dropAnimation={dropAnimation}>
            {task ? <TaskItem task={task} /> : null}
          </DragOverlay>
        </Grid>
      </DndContext>
    </Container>
  );
};

export default BoardSectionList;
