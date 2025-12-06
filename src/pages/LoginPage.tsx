import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useLogin();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("registered") === "1") {
      setSuccess("Cadastro realizado com sucesso. Faça login.");
      window.history.replaceState({}, document.title, location.pathname);
    }
    if (params.get("authRequired") === "1") {
      setError("Necessário estar autenticado para acessar este recurso.");
      window.history.replaceState({}, document.title, location.pathname);
    }
    if (params.get("noPermission") === "1") {
      setError("Você não tem permissão para acessar este recurso.");
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ email, password });
      // espera-se que o hook salve token/roles no localStorage
      if (res) navigate("/");
    } catch (err: any) {
      setError(err?.message || "Erro no login");
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 420 }}>
      <div className="card-body">
        <h5 className="card-title">Login</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <Link to="/register">Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
