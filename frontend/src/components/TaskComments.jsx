import { useState, useEffect } from 'react';

const TaskComments = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ user: '', comment: '' });

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://backend-api-gateway-64uq.onrender.com/tasks/${taskId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://backend-api-gateway-64uq.onrender.com/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setNewComment({ user: '', comment: '' });
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      
      <div className="space-y-2 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded">
            <p className="font-medium text-gray-700 text-sm">{comment.user}</p>
            <p className="text-gray-600">{comment.comment}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(comment.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Your name"
          value={newComment.user}
          onChange={(e) => setNewComment({ ...newComment, user: e.target.value })}
          className="block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment.comment}
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskComments;