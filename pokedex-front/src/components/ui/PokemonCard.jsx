import React from 'react';

// Dicionário de cores para cada tipo de Pokémon. 
const typeThemes = {
    fire: { main: "from-red-500 to-orange-500", b1: "from-orange-400 to-yellow-400", b2: "from-red-600 to-rose-500", text: "text-orange-400" },
    water: { main: "from-blue-500 to-cyan-500", b1: "from-cyan-400 to-teal-400", b2: "from-blue-600 to-indigo-500", text: "text-cyan-400" },
    grass: { main: "from-green-500 to-emerald-500", b1: "from-emerald-400 to-lime-400", b2: "from-green-600 to-teal-500", text: "text-emerald-400" },
    electric: { main: "from-yellow-400 to-amber-500", b1: "from-amber-300 to-orange-400", b2: "from-yellow-500 to-lime-400", text: "text-yellow-400" },
    poison: { main: "from-purple-500 to-fuchsia-500", b1: "from-fuchsia-400 to-pink-400", b2: "from-purple-600 to-violet-500", text: "text-fuchsia-400" },
    bug: { main: "from-lime-500 to-green-500", b1: "from-green-400 to-emerald-400", b2: "from-lime-600 to-yellow-500", text: "text-lime-400" },
    flying: { main: "from-sky-400 to-blue-400", b1: "from-blue-300 to-indigo-300", b2: "from-sky-500 to-cyan-400", text: "text-sky-400" },
    normal: { main: "from-gray-400 to-slate-400", b1: "from-slate-300 to-gray-300", b2: "from-gray-500 to-zinc-400", text: "text-slate-300" },
    ground: { main: "from-amber-600 to-yellow-600", b1: "from-yellow-500 to-orange-400", b2: "from-amber-700 to-orange-600", text: "text-amber-500" },
    rock: { main: "from-stone-500 to-stone-600", b1: "from-stone-400 to-neutral-400", b2: "from-stone-600 to-zinc-600", text: "text-stone-400" },
    ghost: { main: "from-violet-600 to-purple-700", b1: "from-purple-500 to-fuchsia-500", b2: "from-violet-800 to-indigo-800", text: "text-violet-400" },
    psychic: { main: "from-pink-500 to-rose-500", b1: "from-rose-400 to-fuchsia-400", b2: "from-pink-600 to-purple-500", text: "text-pink-400" },
    dragon: { main: "from-indigo-600 to-blue-700", b1: "from-blue-500 to-cyan-500", b2: "from-indigo-800 to-purple-700", text: "text-indigo-400" },
    ice: { main: "from-cyan-300 to-sky-300", b1: "from-sky-200 to-blue-200", b2: "from-cyan-400 to-teal-300", text: "text-cyan-300" },
    fairy: { main: "from-pink-300 to-rose-300", b1: "from-rose-200 to-pink-200", b2: "from-pink-400 to-fuchsia-300", text: "text-pink-300" },
};

// Removemos a tipagem daqui!
export function PokemonCard({ id, name, types, image_url }) {
    const mainType = types[0] || 'normal';
    const theme = typeThemes[mainType] || typeThemes.normal;

    return (
        <div className="w-full flex justify-center">
            <div className={`group relative w-full max-w-[200px] aspect-[3/4] p-[5px] rounded-2xl z-10 cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 bg-gradient-to-r ${theme.main}`}>
                <div className={`absolute inset-0 w-full h-full rounded-2xl -z-10 transition-opacity duration-300 group-hover:opacity-0 bg-gradient-to-br ${theme.b1} rotate-3`}></div>
                <div className={`absolute inset-0 w-full h-full rounded-2xl -z-10 transition-opacity duration-300 group-hover:opacity-0 bg-gradient-to-tr ${theme.b2} -rotate-3`}></div>

                <div className="bg-[#292b2c] text-white flex justify-center items-center w-full h-full rounded-[0.7rem] relative z-20 overflow-hidden">
                    <div className="absolute inset-0 flex flex-col justify-center items-center transition-all duration-500 ease-in-out opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-75">
                        <span className="absolute top-3 right-4 text-white/30 font-black text-2xl">
                            #{id.toString().padStart(3, '0')}
                        </span>
                        <img 
                            src={image_url} 
                            alt={name} 
                            className="w-[70%] h-[70%] object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" 
                        />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-center items-center transition-all duration-500 ease-in-out opacity-0 scale-125 bg-[#292b2c]/95 group-hover:opacity-100 group-hover:scale-100">
                        <h2 className={`font-bold tracking-widest text-2xl capitalize mb-4 ${theme.text}`}>
                            {name}
                        </h2>
                        <div className="flex gap-2">
                            {types.map((tipo) => (
                                <span 
                                    key={tipo} 
                                    className={`bg-transparent border-2 border-current px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.text}`}
                                >
                                    {tipo}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}