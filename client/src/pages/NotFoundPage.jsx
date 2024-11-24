const NotFoundPage = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-teal-600"
        >
          Volver al Inicio
        </a>
      </div>
    );
  };
  
  export default NotFoundPage;
  
