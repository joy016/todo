'use client';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Modal,
  Paper,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import { pink } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { TODO_DATA } from '@/lib/constant';

interface Todo {
  item: string;
  checked: boolean;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '300px', md: '400px' },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

export default function Home() {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [open, setOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    item: '',
    checked: false,
  });
  const [score, setScore] = useState(0);

  useEffect(() => {
    const itemStored = localStorage.getItem('todoItems');
    if (itemStored) {
      setTodoItems(JSON.parse(itemStored));
    }
  }, []);

  useEffect(() => {
    if (todoItems.length > 0)
      localStorage.setItem('todoItems', JSON.stringify(todoItems));
    else {
      localStorage.removeItem('todoItems');
    }

    const totalItems = todoItems.length;
    const completedCount = todoItems.filter((item) => item.checked).length;
    const percentage = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;
    setScore(percentage);
  }, [todoItems]);

  const handleDelete = (index: any) => {
    setTodoItems((prevValue) => prevValue.filter((_, i) => i !== index));
  };

  const handleCheck = (index: any) => {
    const newItems = [...todoItems];
    newItems[index].checked = !newItems[index].checked;
    setTodoItems(newItems);
    setScore(score);
  };

  const handleClearChecks = () => {
    const updatedItems = todoItems.map((item) =>
      item.checked ? { ...item, checked: false } : item
    );
    setTodoItems(updatedItems);
  };

  const handleChangeTodo = (event: any) => {
    setNewTodo({
      ...newTodo,
      item: event.target.value,
    });
  };

  const handleAddTodo = () => {
    if (newTodo.item.trim() != '') {
      setTodoItems((prevValue) => {
        const updateItems = [...prevValue, newTodo];
        return updateItems;
      });
      setNewTodo({ item: '', checked: false });
      setOpen(false);
    }
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '5rem',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: '1em',
            width: { xs: '80%', lg: '50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '30px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              padding: '0 20px',
              justifyContent: 'space-between',
            }}
          >
            <Typography>My Daily Todo Task</Typography>
            <Typography>{`Score ${score.toFixed(2)} %`}</Typography>
          </Box>
          <FormGroup>
            {todoItems.map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={item.checked}
                        sx={{
                          color: pink[800],
                          '&.Mui-checked': {
                            color: pink[600],
                          },
                        }}
                        onChange={() => handleCheck(index)}
                      />
                    }
                    sx={{
                      textDecoration: item.checked ? 'line-through' : 'none',
                    }}
                    label={item.item}
                  />
                  <IconButton
                    onClick={() => handleDelete(index)}
                    aria-label="delete"
                    sx={{
                      color: pink[800],
                      '&.Mui-checked': {
                        color: pink[600],
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              );
            })}
          </FormGroup>
          <Box
            sx={{
              display: 'flex',
              gap: '5px',
            }}
          >
            <Button
              onClick={handleOpenModal}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ width: '50%' }}
            >
              Add Todo
            </Button>
            <Button
              variant="outlined"
              color="error"
              disabled={score <= 0}
              onClick={handleClearChecks}
              sx={{ width: '50%' }}
            >
              Clear Checks
            </Button>
          </Box>

          <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <TextField
                id="outlined-basic"
                label="Add Todo"
                variant="outlined"
                fullWidth
                onChange={handleChangeTodo}
                value={newTodo.item}
              />
              <Button variant="contained" onClick={handleAddTodo}>
                Save Todo
              </Button>
            </Box>
          </Modal>
        </Paper>
      </Box>
    </>
  );
}
