import  { useState } from 'react';
import TaskComments from './TaskComments';

const TaskList = ({ tasks, onTaskUpdate }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  const toggleStatus = async (taskId, currentStatus, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`https://backend-api-gateway-64uq.onrender.com/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: currentStatus === 'pending' ? 'completed' : 'pending'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`https://backend-api-gateway-64uq.onrender.com/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Call onTaskUpdate to refresh the task list after deletion
      onTaskUpdate();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="border rounded-lg p-4 hover:bg-gray-600"
        >
          <div className="flex justify-between items-center">
            <div onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                 className="flex-1 cursor-pointer">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="text-gray-400 mt-2">{task.description}</p>
              <p className="text-sm text-gray-300 mt-1">Assigned to: {task.assigned_to}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2 py-1 rounded text-sm ${
                task.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {task.status}
              </span>
              <button
                onClick={(e) => toggleStatus(task.id, task.status, e)}
                className={`px-3 py-1 rounded text-white ${
                  task.status === 'completed' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
              </button>
              <button
                onClick={(e) => deleteTask(task.id, e)}
                className="px-3 py-1 mt-2 rounded text-white bg-red-400 hover:bg-red-500"
              >
                Delete Task
              </button>
            </div>
          </div>
          
          {selectedTask === task.id && (
            <TaskComments taskId={task.id} />
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;