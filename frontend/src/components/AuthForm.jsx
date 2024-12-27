import { useState } from 'react';

const AuthForm = ({ onAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('login');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setError('');
        await onAuth(email, password, type);
      } catch (err) {
        setError(err.message);
      }
    };
  
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center text-[#24262e]">
          {type === 'login' ? 'Iniciar Sesión' : 'Registrar Usuario'}
        </h2>
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setType(type === 'login' ? 'register' : 'login')}
            className="text-blue-500 hover:underline"
          >
            {type === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    );
  };
  

export default AuthForm;
