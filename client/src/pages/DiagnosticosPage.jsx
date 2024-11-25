import { useEffect, useState } from "react";
import { getDiagnosticos, deleteDiagnostico, updateDiagnostico, createDiagnostico } from "../axios/AxiosDiagnostico";
import Swal from 'sweetalert2';
import FormDiagnostico from "./formDiagnosticos";
import {  useNavigate } from "react-router-dom";

const DiagnosticosPage  = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState(null); // diagnostico en edición
  const [descripcion, setDescripcion] = useState("");

  // Obtener todos los diagnosticos al cargar el componente
  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const data = await getDiagnosticos();
        setDiagnosticos(data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          Swal.fire({ 
            title: err.response.data.detail, 
            icon: 'warning' 
          }); 
        } else { 
          console.error("Error al obtener diagnósticos:", err); 
        }
      }finally { 
        setLoading(false);
      }
    };

    fetchDiagnosticos();
  }, []);

  // Manejar eliminación de un diagnostico
  const handleEliminar = async (id) => {
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
          await deleteDiagnostico(id);
          setDiagnosticos(diagnosticos.filter((diagnostico) => diagnostico.id !== id));
          Swal.fire(
            '¡Eliminado!',
            'El diagnostico ha sido eliminado.',
            'success'
          );
        } catch (err) {
          console.error(err);
          Swal.fire(
            'Error',
            'Uno o varios pacientes estan registrados con este diagnóstico, no puedes eliminarlo.',
            'error'
          );
        }
      }
    });
  };
  

  // Abrir formulario para agregar diagnostico
  const handleAgregar = () => {
    setDiagnosticoSeleccionado(null);
    setDescripcion("");
    setMostrarModal(true);
  };

  // Abrir formulario para editar diagnostico
  const handleEditar = (diagnostico) => {
    setDiagnosticoSeleccionado(diagnostico);
    setDescripcion(diagnostico.descripcion);
    setMostrarModal(true);
  };

  // Manejar la creación/edición del diagnostico
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (diagnosticoSeleccionado) {
        // Editar diagnostico
        const diagnosticoActualizado = await updateDiagnostico(diagnosticoSeleccionado.id, {
          descripcion,
        });
        setDiagnosticos(
          diagnosticos.map((diagnostico) =>
            diagnostico.id === diagnosticoActualizado.id ? diagnosticoActualizado : diagnostico
          )
        );
        Swal.fire({ 
          title: '¡Actualizado!', 
          text: 'El diagnóstico ha sido actualizado con éxito.', 
          icon: 'success' 
        });
      } else {
        // Crear diagnostico
        const nuevoDiagnostico = await createDiagnostico({ descripcion });
        setDiagnosticos([...diagnosticos, nuevoDiagnostico]);
        Swal.fire({ 
          title: '¡Creado!', 
          text: 'El diagnóstico ha sido creado con éxito.', 
          icon: 'success' 
        });
      }
      setMostrarModal(false);
    } catch (err) {
      console.error(err); 
      Swal.fire({
         title: 'Error', 
         text: 'Hubo un problema al guardar el diagnóstico.', 
         icon: 'error' 
      });
    }
  };



  return (
    <div className=" m-12 w-4/5 flex justify-center bg-white">
       <div>
        <h2 className="text-4xl font-bold mb-6 text-center">Listado de Diagnósticos</h2>

      {/* Botón para agregar diagnostico */}
      <div className=" flex justify-center m-4">
        <button
          onClick={handleAgregar}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Agregar
        </button>
        
      </div>

      <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Descripción</th>
              <th className="border border-gray-200 px-4 py-2">Operacione</th>
            </tr>
          </thead>

          <tbody>
      { loading ? 
          <p className="text-center mt-10">Cargando Diagnósticos...</p>
          :(
              diagnosticos.map((diagnostico) => (
                <tr key={diagnostico.id} className="text-center">
                <td className="border border-gray-200 px-4 py-2">{diagnostico.descripcion}</td>
                <td className="border border-gray-200 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditar(diagnostico)}
                      className="rounded-md py-2 px-4 text-blue-900 bg-blue-300 hover:bg-blue-400 
                       focus:outline-none"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(diagnostico.id)}
                      className="rounded-md py-2 px-4 text-gray-100 bg-red-500 hover:bg-red-600
                       focus:outline-none"
                    >
                      Eliminar
                    </button>
                  </td>
              </tr>

              ))
             
          )}
            </tbody>
            </table>
              
              <div className=" items-center flex justify-center">
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded m-6 "
                onClick={() => navigate("/paciente")}
              >
                Volver
              </button>
              </div>
     

      {/* Formulario de agregar/editar */}
      {mostrarModal && (
        <FormDiagnostico
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          onSubmit={handleGuardar}
          onCancel={() => setMostrarModal(false)}
          titulo={diagnosticoSeleccionado ? "Editar Diagnóstico" : "Agregar Diagnóstico"}
        />
      )}
      </div>
    </div>
  );
};

export default DiagnosticosPage


