export interface PokemonContract {
  id: number;
  name: string;
  types: string[];
  image_url: string;
}

export const buscarPokemonsIniciais = async (
  page: number = 1,
  search: string = "",
  type1: string = "all",
  type2: string = "all",
  limit: number = 18,
) => {
  // Agora o limit obedece ao que o usuário escolher no front-end
  const limitPorPagina = limit;
  let lista: any[] = [];

  // 1. LÓGICA DE DOIS TIPOS (Interseção)
  if (type1 !== "all" && type2 !== "all") {
    const res1 = await fetch(
      `https://pokeapi.co/api/v2/type/${type1.toLowerCase()}`,
    );
    const data1 = await res1.json();
    const nomesType1 = data1.pokemon.map((p: any) => p.pokemon.name);

    const res2 = await fetch(
      `https://pokeapi.co/api/v2/type/${type2.toLowerCase()}`,
    );
    const data2 = await res2.json();

    // Pega os pokemons do tipo 2 que TAMBÉM estão no tipo 1 (O cruzamento perfeito)
    lista = data2.pokemon
      .map((p: any) => p.pokemon)
      .filter((p: any) => nomesType1.includes(p.name));
  } else if (type1 !== "all") {
    const res1 = await fetch(
      `https://pokeapi.co/api/v2/type/${type1.toLowerCase()}`,
    );
    const data1 = await res1.json();
    lista = data1.pokemon.map((p: any) => p.pokemon);
  } else if (type2 !== "all") {
    const res2 = await fetch(
      `https://pokeapi.co/api/v2/type/${type2.toLowerCase()}`,
    );
    const data2 = await res2.json();
    lista = data2.pokemon.map((p: any) => p.pokemon);
  } else {
    // Busca todos
    const respostaLista = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`,
    );
    if (!respostaLista.ok) throw new Error("Falha ao buscar a PokeAPI");
    const dadosLista = await respostaLista.json();
    lista = dadosLista.results;
  }

  // 2. CORREÇÃO DO LIMITE DE GERAÇÕES (Agora vai até 1000)
  // Tira os 151 e limita em 1000 só para não pegar as formas mega/gigantamax bizarras da PokeAPI
  lista = lista.filter((p: any) => {
    const urlParts = p.url.split("/");
    const id = parseInt(urlParts[urlParts.length - 2]);
    return id <= 1000;
  });

  // 3. BUSCA PELO NOME
  if (search) {
    lista = lista.filter((pokemon: any) =>
      pokemon.name.toLowerCase().startsWith(search.toLowerCase()),
    );
  }

  // 4. PAGINAÇÃO
  const totalItems = lista.length;
  const lastPage = Math.ceil(totalItems / limitPorPagina) || 1;
  const offset = (page - 1) * limitPorPagina;
  const listaPaginada = lista.slice(offset, offset + limitPorPagina);

  // 5. DETALHAMENTO DOS CARDS DA PÁGINA
  const promessasDetalhes = listaPaginada.map(
    async (pokemon: { name: string; url: string }) => {
      const urlParts = pokemon.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 2]);
      const resDetalhe = await fetch(pokemon.url);
      const detalhe = await resDetalhe.json();

      return {
        id: id,
        name: pokemon.name,
        types: detalhe.types.map((t: any) => t.type.name),
        image_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    },
  );

  const dadosTratados = await Promise.all(promessasDetalhes);

  return { dados: dadosTratados, lastPage: lastPage };
};

export const buscarPokemonPorId = async (id: string) => {
  // 1. Dados Básicos (Stats, Peso, Altura, Tipos)
  const resBase = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!resBase.ok) throw new Error("Pokémon não encontrado");
  const base = await resBase.json();

  // 2. Descrição e Gênero (Species)
  const resSpecies = await fetch(base.species.url);
  const species = await resSpecies.json();
  const descricao = species.flavor_text_entries
    .find((e: any) => e.language.name === "pt" || e.language.name === "en")
    ?.flavor_text.replace(/\f/g, " ");

  // Lógica de Gênero (baseada no gender_rate da API)
  const genderRate = species.gender_rate;
  const gender =
    genderRate === -1
      ? "Sem Gênero"
      : genderRate === 0
        ? "Masc"
        : genderRate === 8
          ? "Fem"
          : "Masc / Fem";

  // 3. Fraquezas (Damage Relations)
  const fraquezas = new Set<string>();
  for (const t of base.types) {
    const resType = await fetch(t.type.url);
    const typeData = await resType.json();
    typeData.damage_relations.double_damage_from.forEach((f: any) =>
      fraquezas.add(f.name),
    );
  }

  // 4. Evoluções
  const resEvo = await fetch(species.evolution_chain.url);
  const evoData = await resEvo.json();
  const evolucoes: any[] = [];

  let atual = evoData.chain;
  while (atual) {
    const idEv = atual.species.url.split("/").filter(Boolean).pop();
    evolucoes.push({
      id: idEv,
      name: atual.species.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idEv}.png`,
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
      value: s.base_stat,
    })),
    evolutions: evolucoes,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${base.id}.png`,
  };
};
