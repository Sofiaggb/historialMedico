import axios from "axios";

// Configuración base para Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // Cambia esto a la URL de tu API
});

// Obtener todos los fármacos
export const getFarmacos = async () => {
  const response = await api.get("/farmacos");
  return response.data.farmacos;
};

// Obtener un fármaco por ID
export const getFarmacoById = async (id) => {
  const response = await api.get(`/farmacos/${id}`);
  return response.data.farmaco;
};

// Crear un nuevo fármaco
export const createFarmaco = async (farmacoData) => {
  const response = await api.post("/save-farmacos", farmacoData);
  return response.data.farmaco;
};

// Actualizar un fármaco existente
export const updateFarmaco = async (id, farmacoData) => {
  const response = await api.put(`/update-farmacos/${id}`, farmacoData);
  return response.data.farmaco;
};

// Eliminar un fármaco
export const deleteFarmaco = async (id) => {
  await api.delete(`/farmacos/${id}`);
};
