import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useRegister from "../hooks/useRegister";

const RegisterPage = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, loading } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({ nome, email, password });
      // navegar para a tela de login com sinalizador de sucesso
      navigate("/login?registered=1");
    } catch (err: any) {
      setError(err?.message || "Erro no cadastro");
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 520 }}>
      <div className="card-body">
        <h5 className="card-title">Criar Conta</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              className="form-control"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
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
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Criar Conta"}
            </button>
            <Link to="/login">Já tenho conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
