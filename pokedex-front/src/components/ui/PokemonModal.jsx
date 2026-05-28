import React, { useEffect, useState } from "react";
import { api } from "../../config/api";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import imgAgua from "../../assets/Insignias/agua.png";
import imgDragao from "../../assets/Insignias/dragao.png";
import imgEletrico from "../../assets/Insignias/eletrico.png";
import imgFada from "../../assets/Insignias/fada.png";
import imgFantasma from "../../assets/Insignias/fantasma.png";
import imgFogo from "../../assets/Insignias/fogo.png";
import imgGelo from "../../assets/Insignias/gelo.png";
import imgInseto from "../../assets/Insignias/inseto.png";
import imgLutador from "../../assets/Insignias/lutador.png";
import imgMetal from "../../assets/Insignias/metal.png";
import imgNormal from "../../assets/Insignias/normal.png";
import imgPedra from "../../assets/Insignias/pedra.png";
import imgPlanta from "../../assets/Insignias/planta.png";
import imgPsiquico from "../../assets/Insignias/psiquico.png";
import imgSombrio from "../../assets/Insignias/sombrio.png";
import imgTerra from "../../assets/Insignias/terra.png";
import imgVeneno from "../../assets/Insignias/veneno.png";
import imgVoador from "../../assets/Insignias/voador.png";
import Loader from "./Loader";

const typeImages = {
  bug: imgInseto,
  dark: imgSombrio,
  dragon: imgDragao,
  electric: imgEletrico,
  fairy: imgFada,
  fighting: imgLutador,
  fire: imgFogo,
  flying: imgVoador,
  ghost: imgFantasma,
  grass: imgPlanta,
  ground: imgTerra,
  ice: imgGelo,
  normal: imgNormal,
  poison: imgVeneno,
  psychic: imgPsiquico,
  rock: imgPedra,
  steel: imgMetal,
  water: imgAgua,
};

export const PokemonModal = ({ pokemonId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pokemonId) {
      setLoading(true);
      api
        .get(`pokemon/${pokemonId}`)
        .then((res) => {
          setData(res.data.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [pokemonId]);

  if (!pokemonId) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl">
          <p className="font-bold">{`${payload[0].payload.name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border-radius:2rem w-full max-w-5xl max-h-[95vh] overflow-y-auto border border-slate-700 shadow-2xl relative custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 cursor-pointer right-6 bg-slate-900/50 hover:bg-red-500 text-white rounded-full p-2.5 transition-all z-10 backdrop-blur-md"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {loading ? (
          <div className="p-32 text-center text-slate-400 font-bold animate-pulse text-xl">
            <Loader />
          </div>
        ) : data ? (
          <div className="p-6 md:p-10">
            {/* BLOCO SUPERIOR: FOTO E INFORMAÇÕES (GRID) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
              {/* ESQUERDA: FOTO GRANDE */}
              <div className="md:col-span-5 bg-slate-700/30 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden group border border-slate-700/50">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-full max-width: 280px h-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* DIREITA: DESCRIÇÃO E DETALHES GERAIS */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="mb-6">
                  <p className="text-slate-400 font-black text-xl mb-1 tracking-widest">
                    #{String(data.id).padStart(3, "0")}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-black text-white capitalize mb-4 drop-shadow-md">
                    {data.name}
                  </h2>
                  <div className="flex gap-2">
                    {data.types.map((t) => (
                      <span
                        key={t}
                        className="px-4 py-1.5 bg-slate-900 text-slate-200 rounded-full text-sm font-bold uppercase border border-slate-600 shadow-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50 shadow-inner italic">
                  "{data.description}"
                </p>

                {/* Grid de Altura, Peso e Sexo */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700/30 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Altura
                    </span>
                    <span className="text-white font-black text-lg">
                      {data.height} m
                    </span>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Peso
                    </span>
                    <span className="text-white font-black text-lg">
                      {data.weight} kg
                    </span>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Sexo
                    </span>
                    <span className="text-white font-black text-lg">
                      {data.gender}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCO DO MEIO: GRÁFICO E FRAQUEZAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* GRÁFICO RECHARTS */}
              <div className="lg:col-span-2 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-inner">
                <h3 className="text-white font-black text-xl mb-6">
                  Estatísticas Base
                </h3>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.stats}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        animationDuration={1500}
                      >
                        {/* Define as cores dinamicamente dependendo do valor da stat */}
                        {data.stats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.value > 80
                                ? "#00a811"
                                : entry.value > 50
                                  ? "#eab308"
                                  : "#ef4444"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* FRAQUEZAS */}
              <div className="lg:col-span-1 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-inner flex flex-col">
                <h3 className="text-white font-black text-xl mb-6 text-center lg:text-left">
                  Fraquezas
                </h3>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center flex-1">
                  {data.weaknesses.length > 0 ? (
                    data.weaknesses.map((w) => (
                      <div
                        key={w}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <img
                          src={typeImages[w]}
                          alt={w}
                          className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-lg group-hover:scale-110 transition-transform"
                          title={`Fraqueza contra ${w}`}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">
                      Nenhuma fraqueza extrema.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* BLOCO INFERIOR: LINHA DE EVOLUÇÃO */}
            {data.evolutions.length > 1 && (
              <div className="bg-slate-700/20 p-6 md:p-8 rounded-3xl border border-slate-700/50">
                <h3 className="text-white font-black text-xl mb-8 text-center uppercase tracking-widest opacity-80">
                  Linha Evolutiva
                </h3>
                <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
                  {data.evolutions.map((evo, index) => (
                    <React.Fragment key={evo.id}>
                      <div className="flex flex-col items-center group transition-transform hover:-translate-y-2">
                        <div
                          className={`w-20 h-20 md:w-28 md:h-28 bg-slate-800 rounded-full p-3 border-4 shadow-xl relative
                            ${evo.name === data.name ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "border-slate-600"}`}
                        >
                          <img
                            src={evo.image}
                            alt={evo.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span
                          className={`mt-3 capitalize font-bold text-sm md:text-base ${evo.name === data.name ? "text-cyan-400" : "text-slate-400"}`}
                        >
                          {evo.name}
                        </span>
                      </div>

                      {index < data.evolutions.length - 1 && (
                        <div className="text-slate-500 mb-8 opacity-50">
                          <svg
                            className="w-8 h-8 md:w-10 md:h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-20 text-center text-red-400 font-bold text-xl">
            Falha ao carregar os dados. Tente novamente!
          </div>
        )}
      </div>
    </div>
  );
};
