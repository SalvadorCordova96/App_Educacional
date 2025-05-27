// frontend/src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import TextInput from '../components/common/TextInput';
import Button from '../components/common/Button';
import { AuthContext } from '../contexts/AuthContext';

function LoginPage() {
  // Preparado para integración futura con AuthContext
  const { login } = useContext(AuthContext) || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Lógica de autenticación pendiente de integración backend
    setTimeout(() => {
      setLoading(false);
      setError('Funcionalidad de autenticación no implementada aún.');
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-950 to-black">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl backdrop-blur-md">
        <h2 className="mb-6 text-3xl font-bold tracking-wide text-center text-white">Iniciar Sesión</h2>
        <TextInput
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="usuario@correo.com"
          required
        />
        <TextInput
          label="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && <div className="mb-2 text-sm text-center text-red-500">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        <div className="mt-4 text-center">
          <span className="text-gray-400">¿No tienes cuenta? </span>
          <a href="/register" className="text-blue-400 transition-all hover:underline">Regístrate</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;