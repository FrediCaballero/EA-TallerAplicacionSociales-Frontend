import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import AuthForm from './components/AuthForm';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [notification, setNotification] = useState('');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://backend-api-gateway-64uq.onrender.com/tasks', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();
      setTasks(data.filter(task => task.visible !== false));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAuth = async (email, password, type) => {
    try {
      const endpoint = type === 'register' ? '/register' : '/login';
      const response = await fetch(`https://backend-api-gateway-64uq.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      const userData = { email: data.email, token: data.token };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setNotification(`Bienvenido, ${email}`);
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Error en autenticación:', error);
      setNotification(error.message);
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setNotification('Sesión cerrada.');
    setTimeout(() => setNotification(''), 5000);
  };

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center bg-white text-[#24262e] p-4 rounded">Task Management</h1>

      {notification && (
        <div className="bg-green-500 text-white p-4 rounded mb-4 text-center">
          {notification}
        </div>
      )}

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add New Task
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={() => {
            fetchTasks();
            setShowTaskForm(false);
          }}
        />
      )}

      <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
    </div>
  );
};

export default App;
