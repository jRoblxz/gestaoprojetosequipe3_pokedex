// 1. Verificamos se o navegador está rodando no localhost ou na web
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// 2. Definimos a URL base dinamicamente
// Se for local, usa a porta 8000. Se for produção, usa o Render.
export const BASE_URL = isLocalhost 
  ? "http://localhost:8000/api/" 
  : "https://gestaoprojetosequipe3-testes.onrender.com/api/";

// 3. Objeto 'api' para as requisições
export const api = {
  get: async (endpoint) => {
    const resposta = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.statusText}`);
    }

    const json = await resposta.json();
    
    return { data: json };
  }
};