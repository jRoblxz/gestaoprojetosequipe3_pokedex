import { useEffect, useState } from "react";
import { PokemonCard } from "./components/ui/PokemonCard";
import AnimatedButton from "./components/ui/AnimatedButton";
import { FilterBar } from "./components/ui/FilterBar";
import { api } from "./config/api";

const PokeballIcon = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="50"
      cy="50"
      r="46"
      className="fill-white stroke-red-500 stroke-[8px]"
    />
    <path d="M4 50H96" className="stroke-red-500 stroke-[8px]" />
    <path
      d="M50 4C24.595 4 4 24.595 4 50H96C96 24.595 75.405 4 50 4Z"
      className="fill-red-500"
    />
    <circle
      cx="50"
      cy="50"
      r="16"
      className="fill-white stroke-slate-800 stroke-[8px]"
    />
    <circle cx="50" cy="50" r="6" className="fill-slate-800" />
  </svg>
);

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [limit, setLimit] = useState(18); // Novo estado para itens por página
  const [inputPage, setInputPage] = useState("1"); // Novo estado para o input digitável
  const [meta, setMeta] = useState({ current_page: 1, last_page: 9 });

  const [busca, setBusca] = useState("");
  const [buscaDebounce, setBuscaDebounce] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("all");

  useEffect(() => {
    setCarregando(true);

    api
      .get(
        // Adicionamos o &limit=${limit} na URL
        `pokemon?page=${page}&search=${buscaDebounce}&type=${tipoSelecionado}&limit=${limit}`,
      )
      .then((resposta) => {
        if (resposta.data.success) {
          setPokemons(resposta.data.data);
          setMeta({
            current_page: resposta.data.current_page || page,
            last_page: resposta.data.last_page || 1,
          });
          // Se o backend retornar o total de páginas diretamente no data, atualize o lastPage:
          if (resposta.data.last_page) {
             setLastPage(resposta.data.last_page);
          }
        }
      })
      .catch((erro) => console.error("Erro ao buscar a API:", erro))
      .finally(() => setCarregando(false));
      
  // Adicionamos o 'limit' no array de dependências para a tela recarregar quando ele mudar
  }, [page, buscaDebounce, tipoSelecionado, limit]);

  const handleTrocarTipo = (idTipo) => {
    setTipoSelecionado(idTipo);
    setPage(1);
  };

  const handlePageInput = (e) => {
  const valor = e.target.value;
  setInputPage(valor); // Atualiza o que o usuário está digitando na tela
};

const irParaPaginaDigitada = () => {
  let novaPagina = parseInt(inputPage);
  
  // Validações de segurança para não ir para a página 0 ou página infinita
  if (isNaN(novaPagina) || novaPagina < 1) novaPagina = 1;
  if (novaPagina > lastPage) novaPagina = lastPage;

  setPage(novaPagina);
  setInputPage(novaPagina.toString()); // Corrige o valor visualmente se ele digitou errado
};

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden font-sans selection:bg-red-500 selection:text-white pb-20">
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-12 md:pt-16">
        <header className="text-center mb-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <PokeballIcon />
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-red-500 via-red-400 to-yellow-400 drop-shadow-sm">
              Pokédex
            </h1>
          </div>
        </header>

        <FilterBar
          busca={busca}
          setBusca={setBusca}
          tipoSelecionado={tipoSelecionado}
          onTrocarTipo={handleTrocarTipo}
        />

        {carregando ? (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4 min-h-100">
            <div className="animate-spin">
              <PokeballIcon />
            </div>
            <p className="text-xl text-slate-400 font-bold animate-pulse">
              Consultando Oak...
            </p>
          </div>
        ) : pokemons.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4 min-h-100 text-center">
            <p className="text-2xl text-slate-400 font-bold">
              Nenhum Pokémon encontrado 😢
            </p>
            <p className="text-slate-500">
              Tente ajustar seus filtros ou busca.
            </p>
          </div>
        ) : (
          <>
            <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12 mb-16 min-h-100">
              {pokemons.map((poke) => (
                <PokemonCard
                  key={poke.id}
                  id={poke.id}
                  name={poke.name}
                  types={poke.types}
                  image_url={poke.image_url}
                />
              ))}
            </main>

            <div className="flex flex-col items-center gap-4 my-8">
              {/* SELETOR DE QUANTIDADE */}
              <div className="flex items-center gap-2 text-white">
                <label
                  htmlFor="limitSelect"
                  className="font-semibold text-slate-300"
                >
                  Mostrar por página:
                </label>
                <select
                  id="limitSelect"
                  className="bg-slate-700 text-white p-2 rounded outline-none border border-slate-500"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1); // Sempre que mudar a quantidade, volta pra página 1
                    setInputPage("1");
                  }}
                >
                  <option value={18}>18</option>
                  <option value={36}>36</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* CONTROLES DE PAGINAÇÃO */}
              <div className="flex items-center gap-4">
                {/* Botão Primeira Página */}
                <button
                  onClick={() => {
                    setPage(1);
                    setInputPage("1");
                  }}
                  disabled={page === 1}
                  className={`px-4 py-2 font-bold rounded ${page === 1 ? "bg-slate-600 text-slate-400 cursor-not-allowed" : "bg-slate-700 text-white hover:bg-slate-500 transition"}`}
                >
                  &lt;&lt; Início
                </button>

                {/* Voltar (Seu AnimatedButton) */}
                <AnimatedButton
                  isLeft={true}
                  onClick={() => {
                    setPage((p) => p - 1);
                    setInputPage((page - 1).toString());
                  }}
                  disabled={page === 1}
                />

                {/* Input de Digitar a Página */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={inputPage}
                    onChange={handlePageInput}
                    onBlur={irParaPaginaDigitada} // Executa quando clica fora do input
                    onKeyDown={(e) =>
                      e.key === "Enter" && irParaPaginaDigitada()
                    } // Executa ao dar Enter
                    className="w-16 text-center p-2 rounded bg-slate-700 text-white border border-slate-500 outline-none focus:border-cyan-400"
                  />
                  <span className="text-slate-300 font-semibold">
                    de {lastPage}
                  </span>
                </div>

                {/* Avançar (Seu AnimatedButton) */}
                <AnimatedButton
                  isLeft={false}
                  onClick={() => {
                    setPage((p) => p + 1);
                    setInputPage((page + 1).toString());
                  }}
                  disabled={page === lastPage}
                />

                {/* Botão Última Página */}
                <button
                  onClick={() => {
                    setPage(lastPage);
                    setInputPage(lastPage.toString());
                  }}
                  disabled={page === lastPage}
                  className={`px-4 py-2 font-bold rounded ${page === lastPage ? "bg-slate-600 text-slate-400 cursor-not-allowed" : "bg-slate-700 text-white hover:bg-slate-500 transition"}`}
                >
                  Fim &gt;&gt;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
