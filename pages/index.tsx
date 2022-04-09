import type { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import styles from '../styles/Home.module.css';

type ITaskList = ITask[];
interface ITask {
  id: number;
  text: string;
  done: boolean;
  isEdit: boolean;
}

enum TaskType {
  All = 'ALL',
  Done = 'DONE',
  Undone = 'UNDONE',
}

const Home: NextPage = () => {
  const [enteredText, setEnteredText] = useState<string>('');
  const [editedTask, setEditedTask] = useState<ITask>();
  const [textEditedTask, setTextEditedTask] = useState<string | null>(null);
  const [tasksList, setTasksList] = useState<ITaskList | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [tasksTypeToDisplay, setTasksTypeToDisplay] = useState<TaskType>(
    TaskType.All
  );

  const textChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredText(event.target.value);
  };

  const todoEditHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTextEditedTask(event.target.value);
  };

  const submitNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(enteredText, false);
    setEnteredText('');
  };

  const addTodo = (newTodo: string, isDone: boolean) => {
    if (tasksList !== null && tasksList.length !== 0) {
      let newId = tasksList[tasksList.length - 1].id + 1;
      setTasksList([
        ...tasksList,
        { id: newId, text: newTodo, done: isDone, isEdit: false },
      ]);
    } else {
      let newId = 0;
      setTasksList([{ id: newId, text: newTodo, done: isDone, isEdit: false }]);
    }
  };

  const editArray = (
    editedArray: any[],
    replacedItem: { id: any; text?: string; done?: boolean; isEdit?: boolean }
  ) => {
    return editedArray.map((element) => {
      if (element.id === replacedItem.id) {
        return replacedItem;
      } else return element;
    });
  };

  const deleteTodo = (tasksList, deletedTodo) => {
    return tasksList.filter((todo) => todo.id !== deletedTodo.id);
  };

  return (
    <div className={styles.container}>
      <h1>tasksList</h1>

      <form onSubmit={submitNewItem}>
        <div>
          <div className={styles.control}>
            <label htmlFor="todo" className={styles.label}>
              add todo
            </label>

            <input
              id="todo"
              type="text"
              required
              value={enteredText}
              onChange={textChangeHandler}
              className={`${styles.input} form-control`}
            />
          </div>
        </div>
        <div className="">
          <button id="submit-form" type="submit" className={styles.button}>
            ADD
          </button>
        </div>
      </form>

      <div>
        {tasksList &&
          tasksList.map((todo, index) => {
            if (tasksTypeToDisplay === 'done' && todo.done === false) return;
            if (tasksTypeToDisplay === 'todo' && todo.done === true) return;
            return !todo.isEdit ? (
              <div key={todo.id}>
                <div
                  id={`todo-${todo.id}`}
                  className={todo.done ? 'finished' : 'unfinished'}
                >
                  {todo.text}
                </div>
                <button
                  onClick={() => {
                    const oldTodo = tasksList[index];

                    setTasksList(
                      editArray(tasksList, {
                        id: oldTodo.id,
                        text: oldTodo.text,
                        done: !oldTodo.done,
                        isEdit: false,
                      })
                    );
                  }}
                >
                  done
                </button>
                <button
                  onClick={() => {
                    if (isEdit) return;
                    setIsEdit(true);

                    const oldTodo = tasksList[index];

                    setTasksList(
                      editArray(tasksList, {
                        id: oldTodo.id,
                        text: oldTodo.text,
                        done: oldTodo.done,
                        isEdit: true,
                      })
                    );
                  }}
                >
                  edit
                </button>
                <button
                  onClick={() => {
                    setTasksList(deleteTodo(tasksList, tasksList[index]));
                  }}
                >
                  delete
                </button>
              </div>
            ) : (
              <form
                onSubmit={() => {
                  const oldTodo = tasksList[index];
                  setIsEdit(false);

                  setTasksList(
                    editArray(tasksList, {
                      id: oldTodo.id,
                      text:
                        textEditedTask !== null ? textEditedTask : oldTodo.text,
                      done: oldTodo.done,
                      isEdit: false,
                    })
                  );

                  setTextEditedTask(null);
                }}
              >
                <div>
                  <div className={styles.control}>
                    <label htmlFor="editedTodo" className={styles.label}>
                      edit:
                    </label>

                    <input
                      id="editedTodo"
                      type="text"
                      required
                      value={
                        textEditedTask !== null ? textEditedTask : todo.text
                      }
                      onChange={todoEditHandler}
                      className={`${styles.input} form-control`}
                    />
                  </div>
                </div>
                <div className="">
                  <button
                    id="submit-form"
                    type="submit"
                    className={styles.button}
                  >
                    save
                  </button>
                </div>
              </form>
            );
          })}
      </div>

      <button
        onClick={() => {
          setTasksTypeToDisplay(TaskType.All);
        }}
      >
        ALL
      </button>
      <button
        onClick={() => {
          setTasksTypeToDisplay(TaskType.Undone);
        }}
      >
        TODO
      </button>
      <button
        onClick={() => {
          setTasksTypeToDisplay(TaskType.Done);
        }}
      >
        DONE
      </button>
    </div>
  );
};

export default Home;
