import type { ReactNode } from "react";

interface Props {
  pagina: number;
  totalDePaginas: number;
  tratarPaginacao: (pagina: number) => void;
}
const Paginacao = ({ pagina, totalDePaginas, tratarPaginacao }: Props) => {
  const arrayDePaginas: ReactNode[] = [];

  // Sempre exibe o passador, mesmo com uma página

  for (let i = 0; i < totalDePaginas; i++) {
    arrayDePaginas.push(
      <li key={i} className={pagina === i ? "page-item active" : "page-item"}>
        <a onClick={() => tratarPaginacao(i)} className="page-link" aria-current="page">
          {i+1}
        </a>
      </li>
    );
  }
  return (
    <nav aria-label="paginação">
      <ul className="pagination">
        <li onClick={() => tratarPaginacao(pagina-1)} className={pagina === 0 ? "page-item disabled" : "page-item"}>
          <a className="page-link">Anterior</a>
        </li>
        {arrayDePaginas}
        <li className={pagina === (totalDePaginas-1) ? "page-item disabled" : "page-item"}>
          <a onClick={() => tratarPaginacao(pagina+1)} className="page-link">
            Próxima
          </a>
        </li>
      </ul>
    </nav>
  );
};
export default Paginacao;
