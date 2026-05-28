
/*
INSTRUÇÕES PARA A EQUIPE:

-> Backend:
Os campos "height" e "weight" agora devem ser enviados já convertidos (divididos por 10) para metros e kg.
O "stats" agora é um array de objetos contendo "name" e "value".
Precisa consultar os endpoints /pokemon-species, /type e /evolution-chain da PokeAPI para preencher "description", "gender", "weaknesses" e "evolutions".

-> Frontend:
A propriedade da imagem mudou de "image_url" para apenas "image".
A "description" pode vir com caracteres de quebra de linha (\n). Você precisará tratar isso no CSS/HTML (ex: white-space: pre-wrap) para o texto não ficar todo em uma linha só.
O array de "evolutions" já traz o ID, Nome e a URL da Imagem prontos para você renderizar os cards menores na tela de detalhes.
*/