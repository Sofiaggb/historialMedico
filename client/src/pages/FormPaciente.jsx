import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPacienteById, createPaciente, updatePaciente } from "../axios/AxiosPacientes";
import { getDiagnosticos } from "../axios/AxiosDiagnostico";
import Swal from 'sweetalert2';

const FormPaciente = () => {
  const [diagnosticos, setDiagnosticos] = useState([]); // Estado para almacenar los diagnósticos
  const [formData, setFormData] = useState({
    nombre: "",
    sexo: "",
    fecha_ingreso: "",
    peso: "",
    id_diagnostico: "",
  }); // Estado para almacenar los datos del formulario
  const { id } = useParams(); // Para saber si es edición, obteniendo el parámetro 'id' de la URL
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    // Función para obtener los diagnósticos
    const fetchDiagnosticos = async () => {
      try {
        const diagnosticosData = await getDiagnosticos(); // Llamada a la API para obtener los diagnósticos
        setDiagnosticos(diagnosticosData); // Actualizar el estado con los diagnósticos obtenidos
      } catch (error) {
        console.error("Error al obtener diagnosticos:", error); // Manejo de errores
      }
    };

    // Función para obtener los datos del paciente si es edición
    const fetchPacientes = async () => {
      if (id) { // Verificar si hay un 'id' en los parámetros de la URL
        try {
          const PacientesData = await getPacienteById(id); // Llamada a la API para obtener los datos del paciente por 'id'
          setFormData({
            nombre: PacientesData.nombre,
            sexo: PacientesData.sexo,
            fecha_ingreso: PacientesData.fecha_ingreso,
            peso: PacientesData.peso,
            id_diagnostico: PacientesData.id_diagnostico,
          }); // Actualizar el estado del formulario con los datos del paciente
        } catch (error) {
          console.error("Error al obtener paciente:", error); // Manejo de errores
        }
      }
    };

    fetchDiagnosticos(); // Llamar a la función para obtener los diagnósticos al cargar el componente
    fetchPacientes(); // Llamar a la función para obtener los datos del paciente si es edición
  }, [id]); // Dependencia del efecto, se ejecuta cuando cambia 'id'

  const validateForm = () => {
    const errors = [];
  
    if (!formData.nombre.trim()) {
      errors.push("El nombre es obligatorio.");
    }

    if (!formData.sexo) { 
      errors.push("El sexo del paciente es obligatorio."); 
    }

    if (!formData.fecha_ingreso) {
      errors.push("La fecha de ingreso es obligatoria.");
    } else if (new Date(formData.fecha_ingreso) > new Date()) {
      errors.push("La fecha de ingreso no puede ser futura.");
    }
  
    if (!formData.peso || formData.peso <= 0) {
      errors.push("El peso debe ser un número mayor a 0.");
    }
  
    if (!formData.id_diagnostico) {
      errors.push("Debes seleccionar un diagnóstico.");
    }
  
    if (errors.length > 0) {
      Swal.fire({
        title: "Error de Envio",
        text: errors.join("\n"),
        icon: "error",
      });
      return false;
    }
  
    return true;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validaciones específicas
    if (name === "peso" && value < 0) {
      Swal.fire({
        title: "Valor no permitido",
        text: "El peso no puede ser negativo.",
        icon: "warning",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return
    }
  
    try {
      if (id) {
        await updatePaciente(id, formData);
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "El Paciente ha sido actualizado con éxito.",
          icon: "success",
        });
      } else {
        await createPaciente(formData);
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "El paciente ha sido creado con éxito.",
          icon: "success",
        });
      }
      navigate("/paciente");
    } catch (error) {
      console.error("Error al guardar el Paciente:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el paciente.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-200 p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Editar Historia del Paciente" : "Crear Historia del Paciente"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border border-lime-600 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Sexo</label>
          <select name="sexo" value={formData.sexo} onChange={handleChange} 
          className="w-full border border-lime-600 rounded px-3 py-2"
          required > 
            <option value="">Selecciona un sexo</option> 
            <option value="Femenino">Femenino</option> 
            <option value="Masculino">Masculino</option> 
          </select>
        </div>
        <div className="mb-4">
          <label className="block  font-medium mb-1">Fecha de Ingreso</label>
          <input
            type="date"
            name="fecha_ingreso"
            value={formData.fecha_ingreso}
            onChange={handleChange}
            className="w-full border  border-lime-600rounded px-3 py-2"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block  font-medium mb-1">Peso</label>
          <input
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            className="w-full border  border-lime-600 rounded px-3 py-2"
             min="0"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Diagnóstico</label>
          <select
            name="id_diagnostico"
            value={formData.id_diagnostico}
            onChange={handleChange}
            className="w-full border  border-lime-600 rounded px-3 py-2"
            required
          >
            <option value="">Selecciona...</option>
            {diagnosticos.length === 0 ? ( 
              <option value="" disabled>No hay diagnosticos en existencia en existencia</option> 
              ) : ( 
              diagnosticos.map((diagnostico) => (
                <option key={diagnostico.id} value={diagnostico.id}>
                  {diagnostico.descripcion}
                </option>
              ))
          )}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            // disabled={!isFormValid()}
          >
            {id ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded sky"
            onClick={() => navigate("/paciente")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPaciente;
