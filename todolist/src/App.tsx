import { Todolist } from "./Components/todolist/Todolist";
import { useState } from "react";
import { v1 } from "uuid";
import { AddItemForm } from "./Components/addItemForm/AddItemForm";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import CssBaseline from "@mui/material/CssBaseline";
import Grid2 from '@mui/material/Grid2';

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: TaskType[];
};

type ThemeMode = "dark" | "light";

function App() {
  let todolistID1 = v1();
  let todolistID2 = v1();

  let [todolists, setTodolists] = useState<TodolistType[]>([
    { id: todolistID1, title: "What to learn", filter: "all" },
    { id: todolistID2, title: "What to buy", filter: "all" },
  ]);

  let [tasks, setTasks] = useState<TasksStateType>({
    [todolistID1]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
      { id: v1(), title: "ReactJS", isDone: false },
    ],
    [todolistID2]: [
      { id: v1(), title: "Rest API", isDone: true },
      { id: v1(), title: "GraphQL", isDone: false },
    ],
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#087EA4",
      },
    },
  });

  const removeTask = (taskId: string, todolistId: string) => {
    const newTodolistTasks = {
      ...tasks,
      [todolistId]: tasks[todolistId].filter((t) => t.id !== taskId),
    };
    setTasks(newTodolistTasks);
  };

  const addTask = (title: string, todolistId: string) => {
    const newTask = {
      id: v1(),
      title: title,
      isDone: false,
    };
    const newTodolistTasks = {
      ...tasks,
      [todolistId]: [newTask, ...tasks[todolistId]],
    };
    setTasks(newTodolistTasks);
  };

  const changeTaskStatus = (
    taskId: string,
    taskStatus: boolean,
    todolistId: string
  ) => {
    const newTodolistTasks = {
      ...tasks,
      [todolistId]: tasks[todolistId].map((t) =>
        t.id === taskId ? { ...t, isDone: taskStatus } : t
      ),
    };
    setTasks(newTodolistTasks);
  };

  const updateTask = (todolistId: string, taskId: string, title: string) => {
    const newTodolistTasks = {
      ...tasks,
      [todolistId]: tasks[todolistId].map((t) =>
        t.id === taskId ? { ...t, title } : t
      ),
    };
    setTasks(newTodolistTasks);
  };

  const changeFilter = (filter: FilterValuesType, todolistId: string) => {
    const newTodolists = todolists.map((tl) => {
      return tl.id === todolistId ? { ...tl, filter } : tl;
    });
    setTodolists(newTodolists);
  };

  const removeTodolist = (todolistId: string) => {
    const newTodolists = todolists.filter((tl) => tl.id !== todolistId);
    setTodolists(newTodolists);

    delete tasks[todolistId];
    setTasks({ ...tasks });
  };

  const addTodolist = (title: string) => {
    const todolistId = v1();
    const newTodolist: TodolistType = {
      id: todolistId,
      title: title,
      filter: "all",
    };
    setTodolists([newTodolist, ...todolists]);
    setTasks({ ...tasks, [todolistId]: [] });
  };

  const updateTodolist = (todolistId: string, title: string) => {
    const newTodolists = todolists.map((tl) =>
      tl.id === todolistId ? { ...tl, title } : tl
    );
    setTodolists(newTodolists);
  };

  const changeModeHandler = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: "30px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Switch color={"default"} onChange={changeModeHandler} />
          </div>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid2 container sx={{ mb: "30px" }}>
          <AddItemForm addItem={addTodolist} />
        </Grid2>

        <Grid2 container spacing={4}>
          {todolists.map((tl) => {
            const allTodolistTasks = tasks[tl.id];
            let tasksForTodolist = allTodolistTasks;

            if (tl.filter === "active") {
              tasksForTodolist = allTodolistTasks.filter(
                (task) => !task.isDone
              );
            }

            if (tl.filter === "completed") {
              tasksForTodolist = allTodolistTasks.filter((task) => task.isDone);
            }

            return (
              <Grid2>
                <Paper sx={{ p: "0 20px 20px 20px" }}>
                  <Todolist
                    key={tl.id}
                    todolistId={tl.id}
                    title={tl.title}
                    tasks={tasksForTodolist}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeTaskStatus}
                    filter={tl.filter}
                    removeTodolist={removeTodolist}
                    updateTask={updateTask}
                    updateTodolist={updateTodolist}
                  />
                </Paper>
              </Grid2>
            );
          })}
        </Grid2>
      </Container>
    </ThemeProvider>
  );
}

export default App;
