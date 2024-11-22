import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFarmacos, deleteFarmaco } from "../api/ApiFarmacos"; // Importar funciones de la API
import { getTipoById } from "../api/ApiTipos";
import Swal from 'sweetalert2';
import TiposView from "./TiposView";

const FarmacosPage = () => {
  const [farmacos, setFarmacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarTipos, setMostrarTipos] = useState(false); // Estado para mostrar el panel de Tipos


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
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFarmaco(id); // Llamada a la API
          setFarmacos(farmacos.filter((farmaco) => farmaco.id !== id)); // Actualizar la lista
          Swal.fire(
            '¡Eliminado!',
            'El fármaco ha sido eliminado con éxito.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar el fármaco:", error);
          Swal.fire(
            'Error',
            'No se pudo eliminar el fármaco.',
            'error'
          );
        }
      }
    });
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
      <div className="flex space-x-4 m-6">
        <Link
          to="/farmacos/create"
          className="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        >
          <span
            className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-indigo-600 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
          ></span>

          <span className="relative block border border-current bg-white px-8 py-3"> Crear Fármaco </span>
        </Link>
        

        <button
          onClick={() => setMostrarTipos(true)} // Mostrar el panel de Tipos
          className="group relative inline-block text-sm font-medium text-emerald-600 focus:outline-none 
          focus:ring active:text-indigo-500"
        >
          <span
            className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-emerald-600 transition-transform 
            group-hover:translate-x-0 group-hover:translate-y-0"
          ></span>

          <span className="relative block border border-current bg-white px-8 py-3">Ver Tipos </span>
        </button>
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
                <td className="border border-gray-200 px-4 py-2"> 
                  {/* Renderizar el tipo de fármaco usando la función async */}
                  <TipoAsync tipoId={farmaco.id_tipo} />
                  {/* {obtenerTipo(farmaco.id_tipo)} */}
                </td>
                <td className="border border-gray-200 px-4 py-2 space-x-2">
                  <Link
                    to={`/farmacos/edit/${farmaco.id}`}
                    className="rounded-full py-2 px-4 border-2 border-yellow-500 text-yellow-500
                     hover:bg-yellow-500 hover:text-gray-100 focus:outline-none"
                  >
                    Editar
                  </Link>
                  <button
                    className="rounded-full py-2 px-4 border-2 border-red-500 text-red-500
                     hover:bg-red-500 hover:text-gray-100 focus:outline-none"
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

      {mostrarTipos && (
        <TiposView onClose={() => setMostrarTipos(false)} />
      )}
    </div>
  );
};

// Componente para mostrar el tipo de fármaco de manera asíncrona
const TipoAsync = ({ tipoId }) => {
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    const fetchTipo = async () => {
      const tipoData = await getTipoById(tipoId);
      setTipo(tipoData.descripcion); // Asumiendo que getTipoById devuelve un objeto con la propiedad 'descripcion'
    };

    fetchTipo();
  }, [tipoId]);

  return tipo ? <span>{tipo}</span> : <span>Cargando tipo...</span>;
};

export default FarmacosPage;


