import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Faculdade
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
              <NavLink className="nav-link" to="/pesquisar-turmas">
                <i className="bi bi-search me-1"></i>
                Pesquisar Turmas
              </NavLink>
            </li>

            {/*Novo item do menu */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/gerenciar-alunos">
                <i className="bi bi-person-gear me-1"></i>
                Gerenciar Alunos
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;