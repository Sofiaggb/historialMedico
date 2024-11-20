import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FarmacosPage from "./pages/FarmacosPage";
// import TiposPage from "../pages/TiposPage";
// import EditFarmacoPage from "../pages/EditFarmacoPage";
// import EditTipoPage from "../pages/EditTipoPage";
// import CreateFarmacoPage from "../pages/CreateFarmacoPage";
// import CreateTipoPage from "../pages/CreateTipoPage";
// import NotFoundPage from "../pages/NotFoundPage";

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
//   {
//     path: "/farmacos/create",
//     element: <CreateFarmacoPage />,
//   },
//   {
//     path: "/farmacos/edit/:id",
//     element: <EditFarmacoPage />,
//   },
//   {
//     path: "/tipos",
//     element: <TiposPage />,
//   },
//   {
//     path: "/tipos/create",
//     element: <CreateTipoPage />,
//   },
//   {
//     path: "/tipos/edit/:id",
//     element: <EditTipoPage />,
//   },
//   {
//     path: "*", // Página para rutas no encontradas
//     element: <NotFoundPage />,
//   },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
