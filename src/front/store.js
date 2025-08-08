export const initialStore = () => {
  return {
    message: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null },
    ]
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {

    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'set_task_color':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        )
      };

    case 'create_task':
      return {
        ...store,
        todos: [...store.todos, action.payload]
      };

    default:
      throw new Error('Unknown action type.');
  }
}
