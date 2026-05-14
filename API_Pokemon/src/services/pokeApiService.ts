export interface PokemonContract {
    id: number;
    name: string;
    types: string[];
    image_url: string;
}

export const buscarPokemonsIniciais = async (page: number = 1, search: string = '', type: string = '') => {
    const limitPorPagina = 18;
    let lista = [];

    if (type && type !== 'all') {
        const resType = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
        if (!resType.ok) throw new Error('Tipo não encontrado na PokeAPI');
        
        const data = await resType.json();
        // Extrai os pokemons e filtra apenas os da Geração 1 (ID <= 151)
        lista = data.pokemon
            .map((p: any) => p.pokemon)
            .filter((p: any) => {
                const urlParts = p.url.split('/');
                const id = parseInt(urlParts[urlParts.length - 2]);
                return id <= 151;
            });
    } 
    else {
        const respostaLista = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
        if (!respostaLista.ok) throw new Error('Falha ao buscar a PokeAPI');
        const dadosLista = await respostaLista.json();
        lista = dadosLista.results;
    }

    // Aplica o filtro de texto (Busca)
    if (search) {
        lista = lista.filter((pokemon: any) => pokemon.name.includes(search.toLowerCase()));
    }

    // Paginação
    const totalItems = lista.length;
    const lastPage = Math.ceil(totalItems / limitPorPagina) || 1;
    const offset = (page - 1) * limitPorPagina;
    const listaPaginada = lista.slice(offset, offset + limitPorPagina);

    // Busca os detalhes finais (Fotos e Tipos)
    const promessasDetalhes = listaPaginada.map(async (pokemon: { name: string, url: string }) => {
        const urlParts = pokemon.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 2]);
        const resDetalhe = await fetch(pokemon.url);
        const detalhe = await resDetalhe.json();
        
        return {
            id: id,
            name: pokemon.name,
            types: detalhe.types.map((t: any) => t.type.name),
            image_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        };
    });

    const dadosTratados = await Promise.all(promessasDetalhes);

    return { dados: dadosTratados, lastPage: lastPage };
};


export const buscarPokemonPorId = async (id: string) => {
    // 1. Dados Básicos (Stats, Peso, Altura, Tipos)
    const resBase = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!resBase.ok) throw new Error('Pokémon não encontrado');
    const base = await resBase.json();

    // 2. Descrição e Gênero (Species)
    const resSpecies = await fetch(base.species.url);
    const species = await resSpecies.json();
    const descricao = species.flavor_text_entries.find((e: any) => e.language.name === 'pt' || e.language.name === 'en')?.flavor_text.replace(/\f/g, ' ');

    // Lógica de Gênero (baseada no gender_rate da API)
    const genderRate = species.gender_rate;
    const gender = genderRate === -1 ? 'Sem Gênero' : genderRate === 0 ? 'Masc' : genderRate === 8 ? 'Fem' : 'Masc / Fem';

    // 3. Fraquezas (Damage Relations)
    const fraquezas = new Set<string>();
    for (const t of base.types) {
        const resType = await fetch(t.type.url);
        const typeData = await resType.json();
        typeData.damage_relations.double_damage_from.forEach((f: any) => fraquezas.add(f.name));
    }

    // 4. Evoluções
    const resEvo = await fetch(species.evolution_chain.url);
    const evoData = await resEvo.json();
    const evolucoes: any[] = [];
    
    let atual = evoData.chain;
    while (atual) {
        const idEv = atual.species.url.split('/').filter(Boolean).pop();
        evolucoes.push({
            id: idEv,
            name: atual.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idEv}.png`
        });
        atual = atual.evolves_to[0]; // Pega a próxima evolução na linha
    }

    return {
        id: base.id,
        name: base.name,
        description: descricao,
        height: base.height / 10, // Converte para metros
        weight: base.weight / 10, // Converte para kg
        gender: gender,
        types: base.types.map((t: any) => t.type.name),
        weaknesses: Array.from(fraquezas),
        stats: base.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat
        })),
        evolutions: evolucoes,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${base.id}.png`
    };
};