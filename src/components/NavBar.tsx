import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/facul.png";
import { useEffect, useState } from "react";
import { useAuth } from "../store/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const token = auth?.token;
  const roles = auth?.roles ?? [];
  const nome = auth?.nome ?? auth?.email ?? null;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" style={{ height: 32 }} className="me-2" />
          <span>Faculdade</span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Seção da esquerda */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/">
                Home
              </NavLink>
            </li>
          </ul>

          {/* Seção da direita */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/listar-turmas">
                <i className="bi bi-people me-1"></i>
                Listar Turmas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/listar-alunos">
                <i className="bi bi-journal-text me-1"></i>
                Listar Alunos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cadastro-alunos">
                <i className="bi bi-person-plus me-1"></i>
                Cadastro de Alunos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/pesquisar-turmas">
                <i className="bi bi-search me-1"></i>
                Pesquisar Turmas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/gerenciar-alunos">
                <i className="bi bi-person-gear me-1"></i>
                Gerenciar Alunos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/inscricao">
                <i className="bi bi-card-checklist me-1"></i>
                Inscrição
              </NavLink>
            </li>
            {(roles.includes("ADMIN") || roles.includes("ROLE_ADMIN")) && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/cadastro-usuarios">
                  <i className="bi bi-person-badge me-1"></i>
                  Cadastro de Usuários
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-3">
            {!token ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Criar Conta</NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center me-2">
                  <span className="me-2">{nome}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Sair</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;