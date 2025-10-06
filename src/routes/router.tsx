import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import TurmasPage from "../pages/TurmasPage";
import TurmaPage from "../pages/TurmaPage";
import AlunosPage from "../pages/AlunosPage";
import Layout from "./Layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {path: "", element: <HomePage />},
            {path: "listar-turmas", element: <TurmasPage />},
            {path: "turmas/:id", element: <TurmaPage />},
            {path: "listar-alunos", element: <AlunosPage />},
            {path: "produtos/:id", element: <HomePage />},
        ]
    }
])
export default router;