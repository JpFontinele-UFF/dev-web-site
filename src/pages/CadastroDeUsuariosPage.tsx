import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import useCadastrarUsuario from "../hooks/useCadastrarUsuario";

const CadastroDeUsuariosPage = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { cadastrarUsuario, loading } = useCadastrarUsuario();

  // Verificar se o usuário é admin
  if (!auth?.roles?.includes("ADMIN") && !auth?.roles?.includes("ROLE_ADMIN")) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setValidationErrors({});

    try {
      await cadastrarUsuario({ nome, email, password, role });
      setSuccess(`Usuário ${nome} cadastrado com sucesso como ${role}!`);
      
      // Limpar formulário
      setNome("");
      setEmail("");
      setPassword("");
      setRole("USER");

      // Redirecionar após 2 segundos
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      if (err?.validation) {
        setValidationErrors(err.validation);
      }
      setError(err?.message || "Erro ao cadastrar usuário");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card mx-auto" style={{ maxWidth: 520 }}>
        <div className="card-body">
          <h5 className="card-title">Cadastro de Usuários</h5>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                className={`form-control ${validationErrors.nome ? "is-invalid" : ""}`}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              {validationErrors.nome && (
                <div className="invalid-feedback d-block">{validationErrors.nome}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className={`form-control ${validationErrors.email ? "is-invalid" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              {validationErrors.email && (
                <div className="invalid-feedback d-block">{validationErrors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                className={`form-control ${validationErrors.password ? "is-invalid" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
              {validationErrors.password && (
                <div className="invalid-feedback d-block">{validationErrors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Perfil</label>
              <select
                className={`form-select ${validationErrors.role ? "is-invalid" : ""}`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
              {validationErrors.role && (
                <div className="invalid-feedback d-block">{validationErrors.role}</div>
              )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate("/")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroDeUsuariosPage;
