import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PacientePage from "./pages/PacientePage";
import FormPaciente from "./pages/FormPaciente";
import DiagnosticosPage from "./pages/DiagnosticosPage";
import NotFoundPage from "./pages/NotFoundPage";

// Definir rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: <PacientePage />, // Página por defecto
  },
  {
    path: "/paciente",
    element: <PacientePage />,
  },
  {
    path: "/diagnosticos",
    element: <DiagnosticosPage />,
  },
  {
    path: "/paciente/create",
    element: <FormPaciente />,
  },
  {
    path: "/paciente/edit/:id",
    element: <FormPaciente />,
  },
  {
    path: "*", // Página para rutas no encontradas
    element: <NotFoundPage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
