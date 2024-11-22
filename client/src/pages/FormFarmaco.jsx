import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFarmacoById, createFarmaco, updateFarmaco } from "../api/ApiFarmacos";
import { getTipos } from "../api/ApiTipos";
import Swal from 'sweetalert2';

const FormFarmaco = () => {
  const [tipos, setTipos] = useState([]);
  const [formData, setFormData] = useState({
    nombre_comercial: "",
    fecha_elaboracion: "",
    principio_activo: "",
    miligramos: "",
    id_tipo: "",
  });
  const { id } = useParams(); // Para saber si es edición
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const tiposData = await getTipos();
        setTipos(tiposData);
      } catch (error) {
        console.error("Error al obtener tipos:", error);
      }
    };

    const fetchFarmaco = async () => {
      if (id) {
        try {
          const farmacoData = await getFarmacoById(id);
          setFormData({
            nombre_comercial: farmacoData.nombre_comercial,
            fecha_elaboracion: farmacoData.fecha_elaboracion,
            principio_activo: farmacoData.principio_activo,
            miligramos: farmacoData.miligramos,
            id_tipo: farmacoData.id_tipo,
          });
        } catch (error) {
          console.error("Error al obtener fármaco:", error);
        }
      }
    };

    fetchTipos();
    fetchFarmaco();
  }, [id]);


  const validateForm = () => {
    const errors = [];
  
    if (!formData.nombre_comercial.trim()) {
      errors.push("El nombre comercial es obligatorio.");
    }
  
    if (!formData.fecha_elaboracion) {
      errors.push("La fecha de elaboración es obligatoria.");
    } else if (new Date(formData.fecha_elaboracion) > new Date()) {
      errors.push("La fecha de elaboración no puede ser futura.");
    }
  
    if (!formData.principio_activo.trim()) {
      errors.push("El principio activo es obligatorio.");
    }
  
    if (!formData.miligramos || formData.miligramos <= 0) {
      errors.push("Los miligramos deben ser un número mayor a 0.");
    }
  
    if (!formData.id_tipo) {
      errors.push("Debes seleccionar un tipo de fármaco.");
    }
  
    if (errors.length > 0) {
      Swal.fire({
        title: "Error de validación",
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
    if (name === "miligramos" && value < 0) {
      Swal.fire({
        title: "Valor no permitido",
        text: "Los miligramos no pueden ser negativos.",
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
        await updateFarmaco(id, formData);
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "El fármaco ha sido actualizado con éxito.",
          icon: "success",
        });
      } else {
        await createFarmaco(formData);
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "El fármaco ha sido creado con éxito.",
          icon: "success",
        });
      }
      navigate("/farmacos");
    } catch (error) {
      console.error("Error al guardar el fármaco:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el fármaco.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Editar Fármaco" : "Crear Fármaco"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Nombre Comercial</label>
          <input
            type="text"
            name="nombre_comercial"
            value={formData.nombre_comercial}
            onChange={handleChange}
            className="w-full border border-teal-700 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block  font-medium mb-1">Fecha de Elaboración</label>
          <input
            type="date"
            name="fecha_elaboracion"
            value={formData.fecha_elaboracion}
            onChange={handleChange}
            className="w-full border border-teal-700 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Principio Activo</label>
          <input
            type="text"
            name="principio_activo"
            value={formData.principio_activo}
            onChange={handleChange}
            className="w-full border border-teal-700 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block  font-medium mb-1">Miligramos</label>
          <input
            type="number"
            name="miligramos"
            value={formData.miligramos}
            onChange={handleChange}
            className="w-full border border-teal-700 rounded px-3 py-2"
             min="0"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Tipo de Fármaco</label>
          <select
            name="id_tipo"
            value={formData.id_tipo}
            onChange={handleChange}
            className="w-full border border-teal-700 rounded px-3 py-2"
            required
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo.id_tipo} value={tipo.id_tipo}>
                {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            // disabled={!isFormValid()}
          >
            {id ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => navigate("/farmacos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormFarmaco;
