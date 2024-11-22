import { useEffect, useState } from "react";
import { getTipos, deleteTipo, updateTipo, createTipo } from "../api/ApiTipos";
import Swal from 'sweetalert2';
import FormTipo from "./FormTipo";

const TiposView = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null); // Tipo en edición
  const [descripcion, setDescripcion] = useState("");

  // Obtener todos los tipos al cargar el componente
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const data = await getTipos();
        setTipos(data);
      } catch (err) {
        setError("Error al cargar los tipos.");
        console.error(err);
      }finally { 
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  // Manejar eliminación de un tipo
  const handleEliminar = async (id_tipo) => {
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
          await deleteTipo(id_tipo);
          setTipos(tipos.filter((tipo) => tipo.id_tipo !== id_tipo));
          Swal.fire(
            '¡Eliminado!',
            'El tipo ha sido eliminado.',
            'success'
          );
        } catch (err) {
          setError("Error al eliminar el tipo.");
          console.error(err);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el tipo.',
            'error'
          );
        }
      }
    });
  };
  

  // Abrir formulario para agregar tipo
  const handleAgregar = () => {
    setTipoSeleccionado(null);
    setDescripcion("");
    setMostrarModal(true);
  };

  // Abrir formulario para editar tipo
  const handleEditar = (tipo) => {
    setTipoSeleccionado(tipo);
    setDescripcion(tipo.descripcion);
    setMostrarModal(true);
  };

  // Manejar la creación/edición del tipo
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (tipoSeleccionado) {
        // Editar tipo
        const tipoActualizado = await updateTipo(tipoSeleccionado.id_tipo, {
          descripcion,
        });
        setTipos(
          tipos.map((tipo) =>
            tipo.id_tipo === tipoActualizado.id_tipo ? tipoActualizado : tipo
          )
        );
      } else {
        // Crear tipo
        const nuevoTipo = await createTipo({ descripcion });
        setTipos([...tipos, nuevoTipo]);
      }
      setMostrarModal(false);
    } catch (err) {
      setError("Error al guardar el tipo.");
      console.error(err);
    }
  };



  return (
    <div className="fixed inset-y-0  left-0 w-1/3 bg-white shadow-lg p-6 z-50">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 absolute top-4 right-4"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-6">Tipos de Fármacos</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Botón para agregar tipo */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAgregar}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Agregar Tipo
        </button>
      </div>

      { loading ? 
          <p className="text-center mt-10">Cargando Tipos...</p>
          :(
            <div>
              {/* Lista de tipos */}
              <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {tipos.map((tipo) => (
                <li
                  key={tipo.id_tipo}
                  className="p-4 flex justify-between items-center"
                >
                  <span className="text-gray-800 font-medium">{tipo.descripcion}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditar(tipo)}
                      className="rounded-full py-2 px-4 border-2 border-yellow-500 text-yellow-500
                     hover:bg-yellow-500 hover:text-gray-100 focus:outline-none"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(tipo.id_tipo)}
                      className="rounded-full py-2 px-4 border-2 border-red-500 text-red-500
                     hover:bg-red-500 hover:text-gray-100 focus:outline-none"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
              </ul>
            </div>
          )}

     

      {/* Formulario de agregar/editar */}
      {mostrarModal && (
        <FormTipo
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          onSubmit={handleGuardar}
          onCancel={() => setMostrarModal(false)}
          titulo={tipoSeleccionado ? "Editar Tipo" : "Agregar Tipo"}
        />
      )}
    </div>
  );
};

export default TiposView;

