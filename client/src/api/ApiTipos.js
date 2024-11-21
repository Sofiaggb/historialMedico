import axios from "axios";

// Configuración base para Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // Cambia esto a la URL de tu API
});

// Obtener todos los tipos
export const getTipos = async () => {
  const response = await api.get("/tipos");
  return response.data.tipos; // Regresa la lista de tipos
};

// Obtener un tipo por ID
export const getTipoById = async (id) => {
  const response = await api.get(`/tipos/${id}`);
  return response.data.tipo; // Regresa el tipo especificado
};

// Crear un nuevo tipo
export const createTipo = async (tipoData) => {
  const response = await api.post("/tipos", tipoData);
  return response.data.tipo; // Regresa el tipo creado
};

// Actualizar un tipo existente
export const updateTipo = async (id, tipoData) => {
  const response = await api.put(`/tipos/${id}`, tipoData);
  return response.data.tipo; // Regresa el tipo actualizado
};

// Eliminar un tipo
export const deleteTipo = async (id) => {
  const response = await api.delete(`/tipos/${id}`);
  return response.status === 204; // Devuelve true si se eliminó correctamente
};
