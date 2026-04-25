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

  const [tipo1, setTipo1] = useState("all");
  const [tipo2, setTipo2] = useState("all");

  // 1º CORREÇÃO: O timer da busca voltou!
  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscaDebounce(busca);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [busca]);

  // 2º CORREÇÃO: useEffect da API
  useEffect(() => {
    setCarregando(true);

    api
      .get(
        `pokemon?page=${page}&search=${buscaDebounce}&type1=${tipo1}&type2=${tipo2}&limit=${limit}`
      )
      .then((resposta) => {
        if (resposta.data.success) {
          setPokemons(resposta.data.data);
          setMeta({
            current_page: resposta.data.current_page || page,
            last_page: resposta.data.last_page || 1,
          });
          if (resposta.data.last_page) {
            setLastPage(resposta.data.last_page);
          }
        }
      })
      .catch((erro) => console.error("Erro ao buscar a API:", erro))
      .finally(() => setCarregando(false));

    // 3º CORREÇÃO AQUI NO FINAL: Adicionado tipo1 e tipo2, e removido tipoSelecionado
  }, [page, buscaDebounce, tipo1, tipo2, limit]);

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
          tipo1={tipo1}
          setTipo1={setTipo1}
          tipo2={tipo2}
          setTipo2={setTipo2}
          resetPagination={() => {
            setPage(1);
            setInputPage("1");
          }}
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

            {/* CONTAINER DA PAGINAÇÃO */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 my-16 bg-slate-800/40 p-4 rounded-3xl border border-slate-700/50 backdrop-blur-md w-fit mx-auto shadow-2xl">
              {/* SELETOR DE QUANTIDADE */}
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium text-sm hidden sm:block">
                  Mostrar:
                </span>
                <div className="relative">
                  <select
                    id="limitSelect"
                    className="appearance-none bg-slate-900 text-white font-bold py-2 pl-4 pr-10 rounded-xl outline-none border border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all cursor-pointer shadow-inner"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                      setInputPage("1");
                    }}
                  >
                    <option value={18}>18 por página</option>
                    <option value={36}>36 por página</option>
                    <option value={100}>100 por página</option>
                  </select>
                  {/* Ícone de Seta customizado do select */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* DIVISOR (Some em telas pequenas) */}
              <div className="hidden md:block w-px h-8 bg-slate-700"></div>

              {/* CONTROLES DE PÁGINA */}
              <div className="flex items-center gap-2">
                {/* Primeira Página (Ícone duplo) */}
                <button
                  onClick={() => {
                    setPage(1);
                    setInputPage("1");
                  }}
                  disabled={page === 1}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  title="Primeira Página"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
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

                {/* Input Central e Contador */}
                <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-700 overflow-hidden shadow-inner mx-1">
                  <input
                    type="number"
                    value={inputPage}
                    onChange={handlePageInput}
                    onBlur={irParaPaginaDigitada}
                    onKeyDown={(e) =>
                      e.key === "Enter" && irParaPaginaDigitada()
                    }
                    className="w-14 text-center py-1 bg-transparent text-white font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:text-red-400 transition-colors"
                    title="Digite a página e dê Enter"
                  />
                  <span className="text-slate-500 font-medium select-none pr-4">
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

                {/* Última Página (Ícone duplo) */}
                <button
                  onClick={() => {
                    setPage(lastPage);
                    setInputPage(lastPage.toString());
                  }}
                  disabled={page === lastPage}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  title="Última Página"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
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
