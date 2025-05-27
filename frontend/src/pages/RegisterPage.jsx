import React, { useState, useContext } from 'react';
import TextInput from '../components/common/TextInput';
import Button from '../components/common/Button';
import { AuthContext } from '../contexts/AuthContext';
import { apiPost } from '../services/apiService';

function RegisterPage() {
  // Preparado para integración futura con AuthContext
  const { register } = useContext(AuthContext) || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      // [IMPLEMENTACION] Registro real de usuario con backend
      const data = await apiPost('/auth/register', {
        correo_electronico: email,
        password,
        confirmar_password: confirmPassword,
        nombre_completo: email.split('@')[0], // Puedes pedir el nombre real en el formulario si lo prefieres
        rol: 'alumno'
      });
      setLoading(false);
      // Redirigir o mostrar éxito
      window.location.href = '/login';
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-950 to-black">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl backdrop-blur-md">
        <h2 className="mb-6 text-3xl font-bold tracking-wide text-center text-white">Crear Cuenta</h2>
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
        <TextInput
          label="Confirmar contraseña"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && <div className="mb-2 text-sm text-center text-red-500">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
        <div className="mt-4 text-center">
          <span className="text-gray-400">¿Ya tienes cuenta? </span>
          <a href="/login" className="text-blue-400 transition-all hover:underline">Inicia sesión</a>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;