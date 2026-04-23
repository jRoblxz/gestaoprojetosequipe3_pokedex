import React from 'react';

// 1. Trazemos TODAS as imagens para cá, limpando o App.jsx
import imgAgua from '../../assets/Insignias/agua.png';
import imgDragao from '../../assets/Insignias/dragao.png';
import imgEletrico from '../../assets/Insignias/eletrico.png';
import imgFada from '../../assets/Insignias/fada.png';
import imgFantasma from '../../assets/Insignias/fantasma.png';
import imgFogo from '../../assets/Insignias/fogo.png';
import imgGelo from '../../assets/Insignias/gelo.png';
import imgInseto from '../../assets/Insignias/inseto.png';
import imgLutador from '../../assets/Insignias/lutador.png';
import imgMetal from '../../assets/Insignias/metal.png';
import imgNormal from '../../assets/Insignias/normal.png';
import imgPedra from '../../assets/Insignias/pedra.png';
import imgPlanta from '../../assets/Insignias/planta.png';
import imgPsiquico from '../../assets/Insignias/psiquico.png';
import imgSombrio from '../../assets/Insignias/sombrio.png';
import imgTerra from '../../assets/Insignias/terra.png';
import imgTodos from '../../assets/Insignias/todos.png';
import imgVeneno from '../../assets/Insignias/veneno.png';
import imgVoador from '../../assets/Insignias/voador.png';

const TIPOS_INSIGNIAS = [
  { id: 'all', label: 'Todos', img: imgTodos },
  { id: 'bug', label: 'Inseto', img: imgInseto },
  { id: 'dark', label: 'Sombrio', img: imgSombrio },
  { id: 'dragon', label: 'Dragão', img: imgDragao },
  { id: 'electric', label: 'Elétrico', img: imgEletrico },
  { id: 'fairy', label: 'Fada', img: imgFada },
  { id: 'fighting', label: 'Lutador', img: imgLutador },
  { id: 'fire', label: 'Fogo', img: imgFogo },
  { id: 'flying', label: 'Voador', img: imgVoador },
  { id: 'ghost', label: 'Fantasma', img: imgFantasma },
  { id: 'grass', label: 'Planta', img: imgPlanta },
  { id: 'ground', label: 'Terra', img: imgTerra },
  { id: 'ice', label: 'Gelo', img: imgGelo },
  { id: 'normal', label: 'Normal', img: imgNormal },
  { id: 'poison', label: 'Veneno', img: imgVeneno },
  { id: 'psychic', label: 'Psíquico', img: imgPsiquico },
  { id: 'rock', label: 'Pedra', img: imgPedra },
  { id: 'steel', label: 'Metal', img: imgMetal },
  { id: 'water', label: 'Água', img: imgAgua },
];

// 2. Recebemos os estados e funções via "props" lá do App.jsx
export function FilterBar({ busca, setBusca, tipoSelecionado, onTrocarTipo }) {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12 bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl">
        
        {/* GRUPO DE INSÍGNIAS */}
        <div className="flex flex-wrap gap-3 w-full xl:w-3/4 justify-center xl:justify-start">
            {TIPOS_INSIGNIAS.map((tipo) => (
                <div key={tipo.id} className="flex flex-col items-center gap-1.5 ">
                    <button
                        onClick={() => onTrocarTipo(tipo.id)}
                        title={`Filtrar por ${tipo.label}`}
                        className={` cursor-pointer
                            relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-[3px] p-0 overflow-hidden
                            ${tipoSelecionado === tipo.id 
                                ? `border-white scale-125 z-10 shadow-[0_0_20px_rgba(255,255,255,0.6)] opacity-100` 
                                : `border-transparent opacity-40 hover:opacity-100 hover:scale-110 hover:border-white/30`
                            }
                        `}
                    >
                        <img src={tipo.img} alt={tipo.label} className="w-full h-full object-cover" />
                    </button>
                    <span className={`text-[9px] uppercase font-black tracking-widest transition-colors ${tipoSelecionado === tipo.id ? 'text-white drop-shadow-md' : 'text-slate-500'}`}>
                        {tipo.label}
                    </span>
                </div>
            ))}
        </div>

        {/* BARRA DE BUSCA */}
        <div className="relative w-full xl:w-1/4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Buscar Pokémon..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 text-slate-200 placeholder-slate-500 rounded-full py-4 pl-12 pr-6 shadow-inner focus:outline-none focus:border-red-500 transition-all font-medium"
            />
        </div>
    </div>
  );
}