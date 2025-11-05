import _ from "lodash";
import type { ChangeEvent } from "react";

const Pesquisa = ({ tratarPesquisa }: { tratarPesquisa: (nome: string) => void; }) => {
  const debouncedFunction = _.debounce((novoNome: string) => tratarPesquisa(novoNome), 1000);  

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedFunction(event.target.value);
  };

  return (
    <input
      placeholder="Pesquisa: informe o nome do produto"
      onChange={handleChange}
      type="text"
      className="form-control form-control-sm mb-3"
    />
  );
};
export default Pesquisa;
