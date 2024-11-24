import Swal from 'sweetalert2';

const FormDiagnostico = ({
  descripcion,
  setDescripcion,
  onSubmit,
  onCancel,
  titulo = "Formulario",
}) => {

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (!descripcion.trim()) {
      Swal.fire({
        title: "Error de Envío",
        text: "La descripción es obligatoria.",
        icon: "error",
      });
      return;
    }

    // Si pasa la validación, llama a `onSubmit`
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 className="text-2xl font-bold mb-4">{titulo}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Descripción:
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring
               focus:ring-blue-300"
            />
             
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormDiagnostico;
