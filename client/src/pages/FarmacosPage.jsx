import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFarmacos, deleteFarmaco } from "../api/ApiFarmacos"; // Importar funciones de la API

const FarmacosPage = () => {
  const [farmacos, setFarmacos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar los fármacos
  const fetchFarmacos = async () => {
    try {
      const farmacosData = await getFarmacos();
      setFarmacos(farmacosData);
      console.log(farmacos)
    } catch (error) {
      console.error("Error al obtener los fármacos:", error);
    } finally { 
      setLoading(false);
    }
  };

  // Función para eliminar un fármaco
  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este fármaco?");
    if (!confirm) return;

    try {
      await deleteFarmaco(id); // Llamada a la API
      setFarmacos(farmacos.filter((farmaco) => farmaco.id !== id)); // Actualizar la lista
      alert("Fármaco eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el fármaco:", error);
      alert("No se pudo eliminar el fármaco.");
    }
  };

  useEffect(() => {
    fetchFarmacos();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando fármacos...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Gestión de Fármacos</h1>
      <div className="flex justify-between mb-6">
        <Link
          to="/farmacos/create"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Crear Fármaco
        </Link>
        <Link
          to="/tipos"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Ver Tipos
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">ID</th>
              <th className="border border-gray-200 px-4 py-2">Nombre Comercial</th>
              <th className="border border-gray-200 px-4 py-2">Fecha Elaboración</th>
              <th className="border border-gray-200 px-4 py-2">Principio Activo</th>
              <th className="border border-gray-200 px-4 py-2">Miligramos</th>
              <th className="border border-gray-200 px-4 py-2">Tipo</th>
              <th className="border border-gray-200 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {farmacos.map((farmaco) => (
              <tr key={farmaco.id} className="text-center">
                <td className="border border-gray-200 px-4 py-2">{farmaco.id}</td>
                <td className="border border-gray-200 px-4 py-2">{farmaco.nombre_comercial}</td>
                <td className="border border-gray-200 px-4 py-2">{farmaco.fecha_elaboracion}</td>
                <td className="border border-gray-200 px-4 py-2">{farmaco.principio_activo}</td>
                <td className="border border-gray-200 px-4 py-2">{farmaco.miligramos} mg</td>
                <td className="border border-gray-200 px-4 py-2">{farmaco.id_tipo}</td>
                <td className="border border-gray-200 px-4 py-2 space-x-2">
                  <Link
                    to={`/farmacos/edit/${farmaco.id}`}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Editar
                  </Link>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(farmaco.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmacosPage;
