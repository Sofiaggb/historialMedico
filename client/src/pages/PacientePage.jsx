import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPacientes, deletePaciente } from "../axios/AxiosPacientes"; // Importar funciones de la API
import { getDiagnosticoById } from "../axios/AxiosDiagnostico";
import Swal from 'sweetalert2';

const PacientePage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar los fármacos
  const fetchPacientes = async () => {
    try {
      const pacientesData = await getPacientes();
      setPacientes(pacientesData);
      console.log(pacientesData)
    } catch (err) {
       if (err.response && err.response.status === 404) {
        Swal.fire({ 
          title: err.response.data.detail, 
          icon: 'warning' 
        }); 
        } else { 
          console.error("Error al obtener diagnósticos:", err); 
        }
    } finally { 
      setLoading(false);
    }
  };


  // Función para eliminar un paciente
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
          await deletePaciente(id); // Llamada a la API
          setPacientes(pacientes.filter((paciente) => paciente.id !== id)); // Actualizar la lista
          Swal.fire(
            '¡Eliminado!',
            'El paciente ha sido eliminado con éxito.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar el paciente:", error);
          Swal.fire(
            'Error',
            'No se pudo eliminar el paciente.',
            'error'
          );
        }
      }
    });
  };
  

  useEffect(() => {
    fetchPacientes();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando Pacientes...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Gestión de Pacientes</h1>
      <div className="flex space-x-4 m-6">
        <Link
          to="/paciente/create"
          className="rounded-md py-2 px-4 text-gray-100 bg-blue-500 hover:bg-blue-600 focus:outline-none"
        >Agregar Paciente
        </Link>
        
        <Link
          to="/diagnosticos"
          className="rounded-md py-2 px-4 text-gray-100 bg-green-500 hover:bg-green-600 focus:outline-none"
        >Ver Diagnósticos 
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">ID</th>
              <th className="border border-gray-200 px-4 py-2">Nombre</th>
              <th className="border border-gray-200 px-4 py-2">Sexo</th>
              <th className="border border-gray-200 px-4 py-2">Fecha de Ingreso</th>
              <th className="border border-gray-200 px-4 py-2">Peso</th>
              <th className="border border-gray-200 px-4 py-2">Diagnóstico</th>
              <th className="border border-gray-200 px-4 py-2">Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente) => (
              <tr key={paciente.id} className="text-center">
                <td className="border border-gray-200 px-4 py-2">{paciente.id}</td>
                <td className="border border-gray-200 px-4 py-2">{paciente.nombre}</td>
                <td className="border border-gray-200 px-4 py-2">{paciente.sexo}</td>
                <td className="border border-gray-200 px-4 py-2">{paciente.fecha_ingreso}</td>
                <td className="border border-gray-200 px-4 py-2">{paciente.peso} kg</td>
                <td className="border border-gray-200 px-4 py-2"> 
                  {/* Renderizar el tipo de fármaco usando la función async */}
                  <DiagnosticoAsync diagnosticoId={paciente.id_diagnostico} />
                </td>
                <td className="border border-gray-200 px-4 py-2 space-x-2">
                  <Link
                    to={`/paciente/edit/${paciente.id}`}
                    className="rounded-md py-2 px-4 text-blue-900 bg-blue-300 hover:bg-blue-400 focus:outline-none"
                  >
                    Editar
                  </Link>
                  <button
                    className="rounded-md py-2 px-4 text-gray-100 bg-red-500 hover:bg-red-600 focus:outline-none"
                    onClick={() => handleDelete(paciente.id)}
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

// Componente para mostrar el diagnostico de manera asíncrona
const DiagnosticoAsync = ({ diagnosticoId }) => {
  const [diagnostico, setDiagnostico] = useState(null);

  useEffect(() => {
    const fetchDiagnostico = async () => {
      const diagnosticoData = await getDiagnosticoById(diagnosticoId);
      setDiagnostico(diagnosticoData.descripcion); // Asumiendo que getTipoById devuelve un objeto con la propiedad 'descripcion'
    };

    fetchDiagnostico();
  }, [diagnosticoId]);

  return diagnostico ? <span>{diagnostico}</span> : <span>Cargando diagnóstico...</span>;
};

export default PacientePage;


