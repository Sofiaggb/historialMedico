import { useEffect, useState } from "react";
import { getTipos, deleteTipo, updateTipo, createTipo } from "../api/ApiTipos";
import FormTipo from "./FormTipo";

const TiposView = () => {
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
      }
    };

    fetchTipos();
  }, []);

  // Manejar eliminación de un tipo
  const handleEliminar = async (id_tipo) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este tipo?")) {
      try {
        await deleteTipo(id_tipo);
        setTipos(tipos.filter((tipo) => tipo.id_tipo !== id_tipo));
      } catch (err) {
        setError("Error al eliminar el tipo.");
        console.error(err);
      }
    }
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Tipos de Fármacos</h1>
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
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(tipo.id_tipo)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

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



// import { useEffect, useState } from "react";
// import { getTipos, deleteTipo, updateTipo, createTipo } from "../api/ApiTipos";

// const TiposView = () => {
//   const [tipos, setTipos] = useState([]);
//   const [error, setError] = useState(null);
//   const [tipoParaEditar, setTipoParaEditar] = useState(null); // Tipo en edición
//   const [descripcionEditada, setDescripcionEditada] = useState("");
//   const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
//   const [nuevaDescripcion, setNuevaDescripcion] = useState("");

//   // Obtener todos los tipos al cargar el componente
//   useEffect(() => {
//     const fetchTipos = async () => {
//       try {
//         const data = await getTipos();
//         setTipos(data);
//       } catch (err) {
//         setError("Error al cargar los tipos.");
//         console.error(err);
//       }
//     };

//     fetchTipos();
//   }, []);

//   // Manejar eliminación de un tipo
//   const handleEliminar = async (id_tipo) => {
//     if (window.confirm("¿Estás seguro de que deseas eliminar este tipo?")) {
//       try {
//         await deleteTipo(id_tipo);
//         setTipos(tipos.filter((tipo) => tipo.id_tipo !== id_tipo));
//       } catch (err) {
//         setError("Error al eliminar el tipo.");
//         console.error(err);
//       }
//     }
//   };

//   // Manejar edición de un tipo
//   const handleEditar = (tipo) => {
//     setTipoParaEditar(tipo); // Configurar el tipo a editar
//     setDescripcionEditada(tipo.descripcion); // Inicializar el valor del formulario
//   };

//   // Enviar la actualización del tipo
//   const handleActualizar = async (e) => {
//     e.preventDefault();
//     try {
//       const tipoActualizado = await updateTipo(tipoParaEditar.id_tipo, {
//         descripcion: descripcionEditada,
//       });
//       setTipos(
//         tipos.map((tipo) =>
//           tipo.id_tipo === tipoActualizado.id_tipo
//             ? tipoActualizado
//             : tipo
//         )
//       );
//       setTipoParaEditar(null); // Limpiar el formulario de edición
//     } catch (err) {
//       setError("Error al actualizar el tipo.");
//       console.error(err);
//     }
//   };

//   // Manejar la creación de un nuevo tipo
//   const handleAgregarTipo = async (e) => {
//     e.preventDefault();
//     try {
//       const nuevoTipo = await createTipo({ descripcion: nuevaDescripcion });
//       setTipos([...tipos, nuevoTipo]);
//       setNuevaDescripcion("");
//       setMostrarModalAgregar(false);
//     } catch (err) {
//       setError("Error al agregar el tipo.");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Tipos de Fármacos</h1>
//       {error && <p className="text-red-500 text-center">{error}</p>}

//       {/* Botón para agregar tipo */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => setMostrarModalAgregar(true)}
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           Agregar Tipo
//         </button>
//       </div>

//       {/* Lista de tipos */}
//       <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
//         {tipos.map((tipo) => (
//           <li
//             key={tipo.id_tipo}
//             className="p-4 flex justify-between items-center"
//           >
//             <span className="text-gray-800 font-medium">{tipo.descripcion}</span>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handleEditar(tipo)}
//                 className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//               >
//                 Editar
//               </button>
//               <button
//                 onClick={() => handleEliminar(tipo.id_tipo)}
//                 className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 Eliminar
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Modal para agregar tipo */}
//       {mostrarModalAgregar && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
//             <h2 className="text-2xl font-bold mb-4">Agregar Tipo</h2>
//             <form onSubmit={handleAgregarTipo}>
//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Descripción:
//                 </label>
//                 <input
//                   type="text"
//                   value={nuevaDescripcion}
//                   onChange={(e) => setNuevaDescripcion(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
//                   required
//                 />
//               </div>
//               <div className="flex space-x-4">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                 >
//                   Guardar
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setMostrarModalAgregar(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//                 >
//                   Cancelar
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Formulario para editar un tipo */}
//       {tipoParaEditar && (
//         <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold mb-4">Editar Tipo</h2>
//           <form onSubmit={handleActualizar}>
//             <div className="mb-4">
//               <label className="block text-gray-700 font-medium mb-2">
//                 Descripción:
//               </label>
//               <input
//                 type="text"
//                 value={descripcionEditada}
//                 onChange={(e) => setDescripcionEditada(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
//                 required
//               />
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Guardar Cambios
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setTipoParaEditar(null)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Cancelar
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TiposView;
