import type { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [enteredText, setEnteredText] = useState<string>('');
  const [editedTodo, setEditedTodo] = useState<{
    id: number;
    text: string;
    done: boolean;
    isEdit: boolean;
  }>();
  const [editedTextTodo, setEditedTextTodo] = useState<string | null>(null);
  const [todos, setTodos] = useState([
    { id: 0, text: 'Learn Next.js', done: false, isEdit: false },
  ]);

  const textChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredText(event.target.value);
  };

  const todoEditHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTextTodo(event.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(enteredText, false);
    setEnteredText('');
  };

  const addTodo = (newTodo: string, isDone: boolean) => {
    let lastIndex = todos.length > 0 ? todos[todos.length - 1].id + 1 : 0;

    setTodos([
      ...todos,
      { id: lastIndex, text: newTodo, done: isDone, isEdit: false },
    ]);
  };

  const editTodos = (
    editedTodos: any[],
    replacedTodo: { id: any; text?: string; done?: boolean; isEdit?: boolean }
  ) => {
    return editedTodos.map((element) => {
      if (element.id === replacedTodo.id) {
        return replacedTodo;
      } else return element;
    });
  };

  const deleteTodo = (todos, deletedTodo) => {
    return todos.filter((todo) => todo.id !== deletedTodo.id);
  };

  return (
    <div className={styles.container}>
      <h1>todos</h1>

      <form onSubmit={onSubmit}>
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
            GO
          </button>
        </div>
      </form>

      <div>
        {todos.map((todo, index) =>
          !todo.isEdit ? (
            <div key={todo.id}>
              <div
                id={`todo-${todo.id}`}
                className={todo.done ? 'finished' : 'unfinished'}
              >
                {todo.text}
              </div>
              <button
                onClick={() => {
                  const oldTodo = todos[index];

                  setTodos(
                    editTodos(todos, {
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
                  const oldTodo = todos[index];

                  setTodos(
                    editTodos(todos, {
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
                  console.log(deleteTodo(todos, todos[index]));
                  setTodos(deleteTodo(todos, todos[index]));
                }}
              >
                delete
              </button>
            </div>
          ) : (
            <form
              onSubmit={() => {
                const oldTodo = todos[index];

                setTodos(
                  editTodos(todos, {
                    id: oldTodo.id,
                    text:
                      editedTextTodo !== null ? editedTextTodo : oldTodo.text,
                    done: oldTodo.done,
                    isEdit: false,
                  })
                );
              }}
            >
              <div>
                <div className={styles.control}>
                  <label htmlFor="editedTodo" className={styles.label}>
                    edit todo
                  </label>

                  <input
                    id="editedTodo"
                    type="text"
                    required
                    value={editedTextTodo !== null ? editedTextTodo : todo.text}
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
          )
        )}
      </div>
    </div>
  );
};

export default Home;
