import axios from "axios";

// Configuración base para Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // Cambia esto a la URL de tu API
});

// Obtener todos los diagnosticos
export const getDiagnosticos = async () => {
  const response = await api.get("/diagnosticos");
  return response.data.diagnosticos; // Regresa la lista de diagnosticos
};

// Obtener un diagnostico por ID
export const getDiagnosticoById = async (id) => {
  const response = await api.get(`/diagnosticos/${id}`);
  return response.data.diagnostico; // Regresa el diagnostico especificado
};

// Crear un nuevo diagnostico
export const createDiagnostico = async (diagnosticoData) => {
  const response = await api.post("/diagnosticos", diagnosticoData);
  return response.data.diagnostico; // Regresa el diagnostico creado
};

// Actualizar un diagnostico existente
export const updateDiagnostico = async (id, diagnosticoData) => {
  const response = await api.put(`/diagnosticos/${id}`, diagnosticoData);
  return response.data.diagnostico; // Regresa el diagnostico actualizado
};

// Eliminar un diagnostico
export const deleteDiagnostico = async (id) => {
  const response = await api.delete(`/diagnosticos/${id}`);
  return response.status === 204; // Devuelve true si se eliminó correctamente
};
