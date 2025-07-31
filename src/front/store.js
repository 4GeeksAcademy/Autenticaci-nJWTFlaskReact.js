export const initialStore = () => {
  return {
    message: null,
    user: null,
    token: localStorage.getItem("token") || null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "login":
      //es clave para guardar el token en el localStorage
      console.log("Token recibido:", action.payload.token);
      localStorage.setItem("token", action.payload.token);
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "logout":
      localStorage.removeItem("token");
      return {
        ...store,
        user: null,
        token: null,
      };

    case "set_user":
      return {
        ...store,
        user: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    default:
      throw Error("Unknown action.");
  }
}
