class Grafo {
    constructor() {
        this.adjacencias = {};
    }

    adicionarVertice(vertice) {
        if (!this.adjacencias[vertice]) {
            this.adjacencias[vertice] = [];
        }
    }

    adicionarAresta(v1, v2) {
        this.adicionarVertice(v1);
        this.adicionarVertice(v2);
        this.adjacencias[v1].push(v2);
        this.adjacencias[v2].push(v1);
    }

    mostrarGrafo() {
        for (const vertice in this.adjacencias) {
            console.log(`${vertice}: ${this.adjacencias[vertice].join(", ")}`);
        }
    }

    buscarCaminho(atorOrigem, atorDestino) {
        let fila = [[atorOrigem]];
        let visitados = new Set();
        visitados.add(atorOrigem);

        while (fila.length > 0) {
            let caminho = fila.shift();
            let verticeAtual = caminho[caminho.length - 1];

            if (verticeAtual === atorDestino) {
                return caminho;
            }

            for (const vizinho of this.adjacencias[verticeAtual]) {
                if (!visitados.has(vizinho)) {
                    visitados.add(vizinho);
                    fila.push([...caminho, vizinho]);
                }
            }
        }
        return null;
    }

    buscarCaminhoComLimite(atorOrigem, atorDestino, limite) {
        let fila = [[atorOrigem]];
        let visitados = new Set();
        visitados.add(atorOrigem);

        while (fila.length > 0) {
            let caminho = fila.shift();
            let verticeAtual = caminho[caminho.length - 1];

            if (verticeAtual === atorDestino) {
                return caminho;
            }

            if (caminho.length - 1 >= limite) {
                continue;
            }

            for (const vizinho of this.adjacencias[verticeAtual]) {
                if (!visitados.has(vizinho)) {
                    visitados.add(vizinho);
                    fila.push([...caminho, vizinho]);
                }
            }
        }
        return null;
    }
}

async function seedGrafo(grafo) {
    const response = await fetch('/movies');
    const filmes = await response.json();

    filmes.forEach(filme => {
        const titulo = filme.title;
        filme.cast.forEach(ator => {
            grafo.adicionarAresta(titulo, ator);
        });
    });
}

async function executarBusca() {
    const atorOrigemInput = document.getElementById('atorOrigem');
    const atorDestinoInput = document.getElementById('atorDestino');

    const atorOrigem = atorOrigemInput.value.trim();
    const atorDestino = atorDestinoInput.value.trim();
    const grafo = new Grafo();

    atorOrigemInput.classList.remove('input-error');
    atorDestinoInput.classList.remove('input-error');
    document.getElementById('atorOrigemError').textContent = '';
    document.getElementById('atorDestinoError').textContent = '';

    let hasError = false;
    if (!atorOrigem) {
        atorOrigemInput.classList.add('input-error');
        document.getElementById('atorOrigemError').textContent = 'Este campo é obrigatório.';
        document.getElementById('atorOrigemError').style.display = 'block';
        hasError = true;
    }
    if (!atorDestino) {
        atorDestinoInput.classList.add('input-error');
        document.getElementById('atorDestinoError').textContent = 'Este campo é obrigatório.';
        document.getElementById('atorDestinoError').style.display = 'block';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    await seedGrafo(grafo);

    const caminho = grafo.buscarCaminho(atorOrigem, atorDestino);
    const caminhoComLimite = grafo.buscarCaminhoComLimite(atorOrigem, atorDestino, 8);

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    if (caminho) {
        resultadoDiv.innerHTML += `<p><span>Caminho mais curto:</span> ${caminho.join(' -> ')}</p>`;
    } else {
        resultadoDiv.innerHTML += '<p>Caminho não encontrado.</p>';
    }

    if (caminhoComLimite) {
        resultadoDiv.innerHTML += `<p><span>Caminho com no máximo 8 arestas:</span> ${caminhoComLimite.join(' -> ')}</p>`;
    } else {
        resultadoDiv.innerHTML += '<p>Caminho não encontrado com limite de 8 arestas.</p>';
    }
}

async function popularAtores() {
    const response = await fetch('/movies');
    const filmes = await response.json();
    const atoresSet = new Set();

    filmes.forEach(filme => {
        filme.cast.forEach(ator => {
            atoresSet.add(ator);
        });
    });

    const atoresArray = Array.from(atoresSet);
    const atoresList = document.getElementById('atoresList');

    atoresArray.forEach(ator => {
        const option = document.createElement('option');
        option.value = ator;
        atoresList.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    popularAtores();
    document.getElementById('buscarBtn').addEventListener('click', executarBusca);
});
