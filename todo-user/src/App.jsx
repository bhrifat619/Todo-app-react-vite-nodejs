
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
  }, [])
  // new add todo
  const addTodo = async () => {
    if (!text.trim()) return;
    const fetchData = await fetch("http://localhost:8080/todos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );
    const data = await fetchData.json();
    setTodos(data.todos);
    setText("");
  };
  // delete todo
  const deleteTodo = async (id) => {
    const res = await fetch(`http://localhost:8080/todos/${id}`, { method: "DELETE" });
    const data = await res.json();
    setTodos(data.todos);
  };

  // TODO: edit UI ফাংশন
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };
  const saveEdit = async () => {
    if (!editText.trim()) return;

    // Backend update করা (একটি POST বা PATCH route add করতে হবে)
    const res = await fetch(`http://localhost:8080/todos/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    });
    const data = await res.json();
    setTodos(data.todos);
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };
  return (
    <div className="min-w-fit min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8">
      <div className="min-w-fit mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">Daily Task Manager</h1>
          <p className="text-gray-600 text-lg sm:text-xl">Organize your day with efficiency</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Add Task */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-fit sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
              <div className="space-y-4">
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-base"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your task here..."
                />
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 text-base"
                  onClick={addTodo}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Add Task</span>
                    <span className="text-xl">+</span>
                  </span>
                </button>
              </div>

              {/* Stats */}
              {todos.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{todos.length}</p>
                    <p className="text-gray-600 text-sm">Total Tasks</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Tasks List */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 min-h-[500px]">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Today's Tasks</h2>

              {todos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks yet</h3>
                  <p className="text-gray-400">Add your first task to get started!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {todos.map((t) => (
                    <div
                      key={t.id}
                      className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-4 border border-gray-200 hover:border-blue-200 transition-all duration-300"
                    >
                      {editingId === t.id ? (
                        <div className="flex items-center gap-4">
                          <input
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-base"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 shadow-sm flex items-center gap-2 whitespace-nowrap"
                            >
                              <span>✓</span>
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200 shadow-sm flex items-center gap-2 whitespace-nowrap"
                            >
                              <span>×</span>
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-medium text-lg flex-1 pr-4 break-words">
                            {t.text}
                          </span>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => startEdit(t)}
                              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200 shadow-sm flex items-center gap-2 whitespace-nowrap"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteTodo(t.id)}
                              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors duration-200 shadow-sm flex items-center gap-2 whitespace-nowrap"
                            >
                              <span>🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
