import React, { useState, useEffect } from "react";

// Configuração dos 4 tipos de Pokébolas construídas puramente com Tailwind
const BOLAS = [
  {
    nome: "Pokébola",
    corTopo: "bg-red-500",
    detalhes: () => null,
  },
  {
    nome: "Great Ball",
    corTopo: "bg-blue-600",
    detalhes: () => (
      <>
        {/* Linhas vermelhas superiores */}
        <div className="absolute top-2 left-2 w-4 h-1.5 bg-red-500 rounded-full rotate-45"></div>
        <div className="absolute top-2 right-2 w-4 h-1.5 bg-red-500 rounded-full -rotate-45"></div>
      </>
    ),
  },
  {
    nome: "Ultra Ball",
    corTopo: "bg-slate-900",
    detalhes: () => (
      <>
        {/* Faixa amarela em formato de U */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-6 border-b-[5px] border-l-[5px] border-r-[5px] border-yellow-400 rounded-b-xl"></div>
      </>
    ),
  },
  {
    nome: "Master Ball",
    corTopo: "bg-purple-600",
    detalhes: () => (
      <>
        {/* Bolinhas rosas e o M central */}
        <div className="absolute top-3 left-1.5 w-3 h-3 bg-pink-400 rounded-full"></div>
        <div className="absolute top-3 right-1.5 w-3 h-3 bg-pink-400 rounded-full"></div>
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white font-black text-[10px] leading-none drop-shadow-md">
          M
        </div>
      </>
    ),
  },
];

const Loader = () => {
  const [indiceBola, setIndiceBola] = useState(0);

  useEffect(() => {
    // O animate-bounce do Tailwind dura exatamente 1 segundo.
    // Trocamos a bola a cada 1000ms para sincronizar com o momento do quique.
    const intervalo = setInterval(() => {
      setIndiceBola((prev) => (prev + 1) % BOLAS.length);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const bolaAtual = BOLAS[indiceBola];

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* POKÉBOLA ANIMADA */}
      <div className="relative w-24 h-24 bg-white border-[8px] border-slate-800 rounded-full overflow-hidden animate-bounce shadow-2xl transition-colors duration-200">
        {/* Metade Superior Dinâmica (Muda de cor e detalhes dependendo da bola) */}
        <div
          className={`absolute top-0 left-0 w-full h-1/2 ${bolaAtual.corTopo} border-b-[8px] border-slate-800 transition-colors duration-300`}
        >
          {bolaAtual.detalhes()}
        </div>

        {/* Botão Central (Borda Externa Negra e Miolo Branco) - O z-10 mantém ele na frente */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-[8px] border-slate-800 rounded-full z-10"></div>

        {/* Luz do Botão Central (Pulsando) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-80 z-20"></div>
      </div>

      {/* TEXTO DE CARREGAMENTO */}
      <p className="mt-6 text-slate-400 font-bold text-lg animate-pulse tracking-widest uppercase">
        Carregando dados...
      </p>
    </div>
  );
};

export default Loader;
