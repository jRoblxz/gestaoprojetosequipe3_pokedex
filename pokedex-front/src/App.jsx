import { useEffect, useState } from 'react';
import { PokemonCard } from './components/ui/PokemonCard';
import { api } from './config/api';

const PokeballIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" className="fill-white stroke-red-500 stroke-[8px]" />
    <path d="M4 50H96" className="stroke-red-500 stroke-[8px]" />
    <path d="M50 4C24.595 4 4 24.595 4 50H96C96 24.595 75.405 4 50 4Z" className="fill-red-500" />
    <circle cx="50" cy="50" r="16" className="fill-white stroke-slate-800 stroke-[8px]" />
    <circle cx="50" cy="50" r="6" className="fill-slate-800" />
  </svg>
);

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // Ajustado para os nomes do seu novo layout
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 9 });

  useEffect(() => {
    setCarregando(true);
    
    api.get(`pokemon?page=${page}`)
      .then(resposta => {
        if (resposta.data.success) {
          setPokemons(resposta.data.data);
          // Atualiza o meta com os dados vindos do seu back-end em TS
          setMeta({
            current_page: resposta.data.current_page || page,
            last_page: resposta.data.last_page || 9
          });
        }
      })
      .catch(erro => console.error("Erro ao buscar a API:", erro))
      .finally(() => setCarregando(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden font-sans selection:bg-red-500 selection:text-white pb-20">
      
      {/* Efeitos de Luz */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-12 md:pt-16">
        
        <header className="text-center mb-16 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <PokeballIcon />
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-yellow-400 drop-shadow-sm">
              Pokédex
            </h1>
          </div>
          
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md shadow-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-slate-300 text-sm md:text-base font-medium tracking-wide">
              Equipe 3 <span className="text-slate-500 mx-2">|</span> 151 Pokémons Iniciais
            </p>
          </div>
        </header>

        {carregando ? (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4">
             <div className="animate-spin">
                <PokeballIcon />
             </div>
             <p className="text-xl text-slate-400 font-bold animate-pulse">Carregando...</p>
          </div>
        ) : (
          <>
            <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12 mb-16">
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

            {/* SEU NOVO LAYOUT DE PAGINAÇÃO (ESTILIZADO) */}
            <div className="flex justify-center items-center gap-6 mt-8 py-6 border-t border-slate-800/50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || carregando}
                className="p-3 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white hover:border-red-500/50 transition-all shadow-lg active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className="text-sm font-medium text-slate-400 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 shadow-inner">
                Página <strong className="text-white mx-1">{meta.current_page}</strong> de <strong className="text-slate-200 ml-1">{meta.last_page}</strong>
              </span>

              <button
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page || carregando}
                className="p-3 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white hover:border-red-500/50 transition-all shadow-lg active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;