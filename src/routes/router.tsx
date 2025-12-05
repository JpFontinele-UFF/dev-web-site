import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import TurmasPage from "../pages/TurmasPage.tsx";
import TurmaPage from "../pages/TurmaPage.tsx";
import AlunosPage from "../pages/AlunosPage.tsx";
import TurmasPesquisaPage from "../pages/TurmasPesquisaPage.tsx";
import GerenciarAlunosPage from "../pages/GerenciarAlunosPage.tsx";
import CadastroDeAlunosPage from "../pages/CadastroDeAlunosPage.tsx";
import AlunoPage from "../pages/AlunoPage.tsx";
import InscricaoPage from "../pages/InscricaoPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterUserPage from "../pages/RegisterUserPage.tsx";
import Layout from "./Layout.tsx"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "listar-turmas", element: <TurmasPage /> },
      { path: "turmas/:id", element: <TurmaPage /> },
      { path: "listar-alunos", element: <AlunosPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "cadastrar-usuario", element: <RegisterUserPage /> },
      { path: "cadastro-alunos", element: <CadastroDeAlunosPage /> },
      { path: "alunos/:id", element: <AlunoPage /> },
      { path: "inscricao", element: <InscricaoPage /> },
      { path: "pesquisar-turmas", element: <TurmasPesquisaPage /> },
      { path: "gerenciar-alunos", element: <GerenciarAlunosPage /> },
    ],
  },
]);

export default router;