import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FarmacosPage from "./pages/FarmacosPage";
import FormFarmaco from "./pages/FormFarmaco";
import NotFoundPage from "./pages/NotFoundPage";

// Definir rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: <FarmacosPage />, // Página por defecto
  },
  {
    path: "/farmacos",
    element: <FarmacosPage />,
  },
  {
    path: "/farmacos/create",
    element: <FormFarmaco />,
  },
  {
    path: "/farmacos/edit/:id",
    element: <FormFarmaco />,
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
