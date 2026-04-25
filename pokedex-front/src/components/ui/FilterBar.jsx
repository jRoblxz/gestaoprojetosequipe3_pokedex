import React from "react";

// Imports das imagens mantidos
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
import imgTodos from "../../assets/Insignias/todos.png";
import imgVeneno from "../../assets/Insignias/veneno.png";
import imgVoador from "../../assets/Insignias/voador.png";

const TIPOS_INSIGNIAS = [
  { id: "all", label: "Todos", img: imgTodos },
  { id: "bug", label: "Inseto", img: imgInseto },
  { id: "dark", label: "Sombrio", img: imgSombrio },
  { id: "dragon", label: "Dragão", img: imgDragao },
  { id: "electric", label: "Elétrico", img: imgEletrico },
  { id: "fairy", label: "Fada", img: imgFada },
  { id: "fighting", label: "Lutador", img: imgLutador },
  { id: "fire", label: "Fogo", img: imgFogo },
  { id: "flying", label: "Voador", img: imgVoador },
  { id: "ghost", label: "Fantasma", img: imgFantasma },
  { id: "grass", label: "Planta", img: imgPlanta },
  { id: "ground", label: "Terra", img: imgTerra },
  { id: "ice", label: "Gelo", img: imgGelo },
  { id: "normal", label: "Normal", img: imgNormal },
  { id: "poison", label: "Veneno", img: imgVeneno },
  { id: "psychic", label: "Psíquico", img: imgPsiquico },
  { id: "rock", label: "Pedra", img: imgPedra },
  { id: "steel", label: "Metal", img: imgMetal },
  { id: "water", label: "Água", img: imgAgua },
];

export const FilterBar = ({ busca, setBusca, tipo1, setTipo1, tipo2, setTipo2, resetPagination }) => {

  const handleToggleTipo = (id) => {
    resetPagination();
    
    if (id === 'all') {
      setTipo1('all');
      setTipo2('all');
      return;
    }
    if (tipo1 === id) {
      setTipo1(tipo2); 
      setTipo2('all');
      return;
    }
    if (tipo2 === id) {
      setTipo2('all');
      return;
    }
    if (tipo1 === 'all') {
      setTipo1(id);
      return;
    }
    if (tipo2 === 'all') {
      setTipo2(id);
      return;
    }
    setTipo2(id);
  };

  return (
    // Transformado em lg:flex-row para ficar lado a lado e reduzido paddings e margins
    <div className="flex flex-col lg:flex-row gap-6 bg-slate-800/40 p-4 rounded-3xl mb-8 border border-slate-700/50 backdrop-blur-md shadow-xl w-full items-center justify-between">
      
      {/* ÁREA DAS INSÍGNIAS (ESQUERDA) */}
      <div className="w-full lg:flex-1 order-2 lg:order-1">
        <div className="flex justify-between items-end mb-2 px-1">
          <label className="text-slate-400 text-xs font-semibold">
            Filtrar por Tipos <span className="font-normal text-[10px]">(Até 2 tipos)</span>
          </label>
          
          <div className="flex gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-cyan-400">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]"></div> Primário
            </span>
            <span className="flex items-center gap-1 text-pink-400">
              <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_5px_hotpink]"></div> Secundário
            </span>
          </div>
        </div>

        {/* Paddings e gaps reduzidos para compactar */}
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start bg-slate-900/60 p-2 md:p-3 rounded-2xl border border-slate-700/50 shadow-inner">
          {TIPOS_INSIGNIAS.map((t) => {
            const isTipo1 = tipo1 === t.id;
            const isTipo2 = tipo2 === t.id;
            const isAll = t.id === 'all';
            const hasSelection = tipo1 !== 'all'; 

            let btnClass = "relative p-1.5 rounded-full transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ";
            
            if (isTipo1 && !isAll) {
              btnClass += "ring-2 ring-cyan-400 bg-cyan-900/60 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] z-10";
            } else if (isTipo2 && !isAll) {
              btnClass += "ring-2 ring-pink-500 bg-pink-900/60 scale-110 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] z-10";
            } else if (tipo1 === 'all' && isAll) {
              btnClass += "ring-2 ring-slate-300 bg-slate-700/80 scale-110 shadow-lg z-10";
            } else {
              if (hasSelection) {
                btnClass += "opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 hover:bg-slate-700/50";
              } else {
                btnClass += "opacity-100 hover:bg-slate-700/50 hover:scale-105";
              }
            }

            return (
              <button
                key={t.id}
                onClick={() => handleToggleTipo(t.id)}
                className={btnClass}
                title={t.label}
              >
                {/* Tamanho da imagem reduzido levemente */}
                <img src={t.img} alt={t.label} className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain drop-shadow-md" />
                
                {isTipo1 && !isAll && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-cyan-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border border-slate-900 shadow-md">
                    1
                  </div>
                )}
                {isTipo2 && !isAll && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border border-slate-900 shadow-md">
                    2
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* BARRA DE PESQUISA (DIREITA) */}
      <div className="w-full lg:w-72 xl:w-80 order-1 lg:order-2 shrink-0">
        <label className="text-slate-400 text-xs font-semibold mb-1 block pl-2">
          Buscar pelo Nome
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Ex: bulbasaur..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            // Altura do input ajustada para ficar mais discreta
            className="w-full bg-slate-900 text-white placeholder-slate-500 font-medium py-2.5 px-4 rounded-xl outline-none border border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner text-sm"
          />
        </div>
      </div>

    </div>
  );
};