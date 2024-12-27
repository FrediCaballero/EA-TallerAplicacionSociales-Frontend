import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [notification, setNotification] = useState(''); // Estado para manejar las notificaciones

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://backend-api-gateway-64uq.onrender.com/tasks');
      const data = await response.json();
      // Filtrar solo las tareas visibles
      setTasks(data.filter(task => task.visible !== false));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskCreated = (message) => {
    fetchTasks();
    setShowTaskForm(false);
    setNotification(message); // Mostrar mensaje de notificación

    // Limpiar la notificación después de 5 segundos
    setTimeout(() => setNotification(''), 5000);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center bg-white text-[#24262e] p-4 rounded">Task Management</h1>
      
      {/* Mostrar notificación si existe */}
      {notification && (
        <div className="bg-green-500 text-white p-4 rounded mb-4 text-center">
          {notification}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        >
          + Add New Task
        </button>
      </div>

      {showTaskForm && (
        <TaskForm 
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated} // Pasar el handler para la notificación
        />
      )}

      <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
    </div>
  );
};

export default App;
