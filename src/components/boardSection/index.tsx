import React from "react";
import Box from "@mui/material/Box";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Typography from "@mui/material/Typography";
import { Action, Task } from "../../types";
import TaskItem from "../taskItem";
import SortableTaskItem from "../sortableTaskItem";
import { capitalize } from "@mui/material";
import { noop } from "../../utils/common";

type BoardSectionProps = {
  id: string;
  title: string;
  tasks: Task[];
  callBack?: (id: string | number , action: Action ) => void;
};;
;
const BoardSection = ({ id, title, tasks, callBack = noop }: BoardSectionProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box
      sx={{
        backgroundColor: title === "done" ? "#53b65b" : "#FF5733",
        padding: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: 2,
        height: "100%",
        color: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {capitalize(title)}
      </Typography>
      <SortableContext id={id} items={tasks} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef}>
          {tasks.map((task) => (
            <Box key={task.id} sx={{ mb: 2 }}>
              <SortableTaskItem id={task.id}>
                <TaskItem task={task} callBack={callBack}  />
              </SortableTaskItem>
            </Box>
          ))}
        </div>
      </SortableContext>
    </Box>
  );
};

export default BoardSection;
