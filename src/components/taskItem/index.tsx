import { useState } from "react";
import { 
  Card, CardContent, Typography, IconButton, TextField, 
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Box 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Action, Task } from "../../types";
import { noop } from "../../utils/common";

type TaskItemProps = {
  task: Task;
  callBack?: (id: string | number , action: Action, data?: string ) => void;
};

const TaskItem = ({ task, callBack = noop }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState(task.todo);
  const [isLoading, setIsLoading] = useState(false)
  const handleEdit = () => setIsEditing(true);
  const handleClose = () => setIsEditing(false);

  const handleUpdate = () => {
    setIsLoading(true)
    fetch(`https://dummyjson.com/todos/${task.id}`, {
      method: 'PUT' /* or PATCH */,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: false
      })
    })
      .then((res) => res.json())
      .then(() => {
        alert("Todo updated successfully ")
        callBack(task.id, 'update', updatedTodo);
        handleClose();
      })
      .catch(() => {
        alert("Unable to update todo")
      })
      .finally(() => {
        setIsLoading(false)
      })
      


  };

  const handleDelete = () => {
    
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // Column on mobile, row on larger screens
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: 2,
      }}
    >
      {/* Task Text */}
      <CardContent sx={{ textAlign: "center" }}>
        <Typography>{task.todo}</Typography>
      </CardContent>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: { xs: 1, sm: 0 }, // Add margin on mobile to separate icons from text
        }}
      >
        <IconButton onClick={handleEdit} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => callBack(task.id, "delete")} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={updatedTodo}
            onChange={(e) => setUpdatedTodo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TaskItem;
