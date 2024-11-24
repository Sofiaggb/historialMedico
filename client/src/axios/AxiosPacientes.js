import axios from "axios";

// Configuración base para Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // Cambia esto a la URL de tu API
});

// Obtener todos los pacientes
export const getPacientes = async () => {
  const response = await api.get("/pacientes");
  return response.data.pacientes;
};

// Obtener un paciente por ID
export const getPacienteById = async (id) => {
  const response = await api.get(`/pacientes/${id}`);
  return response.data.paciente;
};

// Crear un nuevo paciente
export const createPaciente = async (pacienteData) => {
  const response = await api.post("/save-pacientes", pacienteData);
  return response.data.paciente;
};

// Actualizar un paciente existente
export const updatePaciente = async (id, pacienteData) => {
  const response = await api.put(`/update-pacientes/${id}`, pacienteData);
  return response.data.paciente;
};

// Eliminar un paciente
export const deletePaciente = async (id) => {
  const response =  await api.delete(`/pacientes/${id}`);
  return response.status === 204; // Devuelve true si se eliminó correctamente
};
