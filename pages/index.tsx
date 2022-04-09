import type { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import styles from '../styles/Home.module.css';

type ITaskList = ITask[];
interface ITask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

enum TaskType {
  All = 'ALL',
  Completed = 'COMPLETED',
  Uncompleted = 'UNCOMPLETED',
}

const Home: NextPage = () => {
  const [tasksList, setTasksList] = useState<ITaskList | null>(null);
  const [tasksTypeToDisplay, setTasksTypeToDisplay] = useState<TaskType>(
    TaskType.All
  );
  const [enteredTitleNewTask, setEnteredTitleNewTask] = useState<string>('');
  const [enteredTitleEditedTask, setEnteredTitleEditedTask] = useState<
    string | null
  >(null);
  const [editedTask, setEditedTask] = useState<ITask | null>(null);
  const [hightestId, setHightestId] = useState<number>(0);

  const titleChangeNewTaskHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredTitleNewTask(event.target.value);
  };

  const titleChangeEditedTaskHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredTitleEditedTask(event.target.value);
  };

  const submitNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTask(enteredTitleNewTask);
    setEnteredTitleNewTask('');
  };

  const addTask = (newTaskTitle: string, isCompleted: boolean = false) => {
    let newId = hightestId + 1;

    if (tasksList !== null && tasksList.length > 0) {
      setTasksList([
        ...tasksList,
        {
          id: newId,
          title: newTaskTitle,
          completed: isCompleted,
        },
      ]);
    } else {
      setTasksList([
        {
          id: newId,
          title: newTaskTitle,
          completed: isCompleted,
        },
      ]);
    }
    setHightestId((previousHightestId) => previousHightestId + 1);
  };

  const editTaskInTasksList = (
    editedTaskList: any[],
    replacedTask: {
      id: any;
      title?: string;
      completed?: boolean;
      isEdit?: boolean;
    }
  ) => {
    return editedTaskList.map((task) => {
      return task.id === replacedTask.id ? replacedTask : task;
    });
  };

  const deleteTaskInTasksList = (editedTaskList: any[], deletedTask: ITask) => {
    return editedTaskList.filter(
      (Task: { id: number }) => Task.id !== deletedTask.id
    );
  };

  return (
    <div className={styles.container}>
      <h1>tasksList</h1>

      <form onSubmit={submitNewTask}>
        <div className={styles.control}>
          <label htmlFor="newTask" className={styles.label}>
            add task
          </label>

          <input
            id="newTask"
            type="title"
            required
            value={enteredTitleNewTask}
            onChange={titleChangeNewTaskHandler}
            className={`${styles.input} form-control`}
          />
        </div>
        <div className="">
          <button id="submit-new-task" type="submit" className={styles.button}>
            ADD
          </button>
        </div>
      </form>

      <ul>
        {tasksList &&
          tasksList.map((task, index) => {
            if (
              tasksTypeToDisplay === TaskType.Completed &&
              task.completed === false
            )
              return;
            if (
              tasksTypeToDisplay === TaskType.Uncompleted &&
              task.completed === true
            )
              return;
            return !editedTask ? (
              <li key={`task task--${task.id}`}>
                <div
                  className={`task_name task_name--${task.id} ${
                    task.completed
                      ? 'task_name--completed'
                      : 'task_name--uncompleted'
                  }`}
                >
                  {task.title}
                </div>
                <div
                  className={`task_control-panel task_control-panel--${task.id}`}
                >
                  <button
                    className={`task_button task_button--done`}
                    onClick={() => {
                      const oldTask = tasksList[index];

                      console.log(!oldTask.completed);
                      setTasksList(
                        editTaskInTasksList(tasksList, {
                          ...oldTask,
                          completed: !oldTask.completed,
                        })
                      );
                    }}
                  >
                    done
                  </button>
                  <button
                    className={`task_button task_button--edit`}
                    onClick={() => {
                      if (editedTask) return;
                      setEditedTask(tasksList[index]);
                    }}
                  >
                    edit
                  </button>
                  <button
                    className={`task_button task_button--delete`}
                    onClick={() => {
                      setTasksList(
                        deleteTaskInTasksList(tasksList, tasksList[index])
                      );
                    }}
                  >
                    delete
                  </button>
                </div>
              </li>
            ) : (
              <form
                key={`form-change-title--task-${task.id}`}
                className={`form-change-title form-change-title--task-${task.id}`}
                onSubmit={() => {
                  setTasksList(
                    editTaskInTasksList(tasksList, {
                      ...editedTask,
                      title:
                        enteredTitleEditedTask !== null
                          ? enteredTitleEditedTask
                          : editedTask.title,
                      isEdit: false,
                    })
                  );

                  setEditedTask(null);
                  setEnteredTitleEditedTask(null);
                }}
              >
                <div className={styles.control}>
                  <label htmlFor="editedTask" className={styles.label}>
                    edit:
                  </label>

                  <input
                    id="editedTask"
                    type="text"
                    required
                    value={
                      enteredTitleEditedTask !== null
                        ? enteredTitleEditedTask
                        : task.title
                    }
                    onChange={titleChangeEditedTaskHandler}
                    className={`form-change-title_control`}
                  />
                </div>

                <button
                  id="submit-form"
                  type="submit"
                  className={styles.button}
                >
                  save
                </button>
              </form>
            );
          })}
      </ul>

      <button
        onClick={() => {
          setTasksTypeToDisplay(TaskType.All);
        }}
      >
        ALL
      </button>
      <button
        onClick={() => {
          setTasksTypeToDisplay(TaskType.Uncompleted);
        }}
      >
        TODO
      </button>
      <button
        onClick={() => {
          setTasksTypeToDisplay(TaskType.Completed);
        }}
      >
        DONE
      </button>
    </div>
  );
};

export default Home;
