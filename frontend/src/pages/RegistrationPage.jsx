// frontend/src/pages/RegistrationPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService.jsx';
import { apiPost } from '../services/apiService';
import TextInput from '../components/common/TextInput';
import Button from '../components/common/Button';

function RegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('alumno');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // [IMPLEMENTACION] Registro real de usuario con backend Flask
      await apiPost('/auth/register', {
        nombre_completo: name,
        correo_electronico: email,
        password: password,
        confirmar_password: password, // Si quieres agregar confirmación real, añade otro campo
        rol: role
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4">
      <h2 className="mb-6 text-2xl font-bold text-blue-700">Registro</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow">
        <TextInput
          label="Nombre"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <TextInput
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <TextInput
          label="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">Rol</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="alumno">Alumno</option>
            <option value="docente">Docente</option>
          </select>
        </div>
        {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
        <Button type="submit" className="w-full mt-4">Registrarse</Button>
      </form>
    </div>
  );
}

export default RegistrationPage;