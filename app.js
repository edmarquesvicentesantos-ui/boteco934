// --- CONFIGURAÇÃO OFICIAL FIREBASE BOTECO 934 ---
const firebaseConfig = {
    apiKey: "AIzaSyAxjhzLPeqBqJ18S8m7lagxuvF9LX7OJks",
    authDomain: "boteco934-afc3f.firebaseapp.com",
    databaseURL: "https://boteco934-afc3f-default-rtdb.firebaseio.com",
    projectId: "boteco934-afc3f",
    storageBucket: "boteco934-afc3f.firebasestorage.app",
    messagingSenderId: "182023728304",
    appId: "1:182023728304:web:040a13bb6f61c9fff35f75",
    measurementId: "G-HWT2RYRMRQ"
};

// Inicialização
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- LÓGICA DE PRECIFICAÇÃO ---
const inputIds = ['custoEntrada', 'qtdUnidades', 'markupAlvo'];
inputIds.forEach(id => document.getElementById(id).addEventListener('input', calcular));

function calcular() {
    const custo = parseFloat(document.getElementById('custoEntrada').value) || 0;
    const qtd = parseInt(document.getElementById('qtdUnidades').value) || 1;
    const margem = parseFloat(document.getElementById('markupAlvo').value) / 100;

    if (custo <= 0) return;

    const custoUn = custo / qtd;
    const precoBase = custoUn / (1 - margem);

    const tipos = [
        { nome: "Natural", preco: precoBase, custo: custoUn, cor: "" },
        { nome: "Gelada (+15%)", preco: precoBase * 1.15, custo: custoUn, cor: "bg-blue-50" },
        { nome: "Dose (50ml + 5% perda)", preco: (custoUn / 20 * 1.05) / (1 - (margem + 0.15)), custo: (custoUn / 20 * 1.05), cor: "bg-yellow-50" }
    ];

    document.getElementById('tabelaPrecos').innerHTML = tipos.map(t => `
        <tr class="${t.cor}">
            <td class="p-3 font-bold text-gray-700">${t.nome}</td>
            <td class="p-3 text-gray-500">R$ ${t.custo.toFixed(2)}</td>
            <td class="p-3 text-blue-700 font-black text-lg">R$ ${t.preco.toFixed(2)}</td>
            <td class="p-3 text-green-600 font-bold">R$ ${(t.preco - t.custo).toFixed(2)}</td>
        </tr>
    `).join('');
}

// --- LÓGICA DE MESAS ---
let mesaAtiva = null;

function carregarMesas() {
    const container = document.getElementById('containerMesas');
    container.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        container.innerHTML += `
            <div onclick="abrirModal(${i})" id="card-mesa-${i}" class="bg-white border-2 border-gray-100 p-4 rounded-xl cursor-pointer hover:shadow-lg transition">
                <span class="block text-gray-400 text-xs font-bold uppercase">Mesa</span>
                <span class="text-2xl font-black text-gray-800">${i < 10 ? '0' + i : i}</span>
                <span id="status-mesa-${i}" class="block text-[10px] mt-2 text-green-500 font-bold uppercase italic">Livre</span>
            </div>
        `;
    }
}

function abrirModal(num) {
    mesaAtiva = num;
    document.getElementById('modalTitulo').innerText = `Abrir Mesa ${num}`;
    document.getElementById('modalMesa').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modalMesa').classList.add('hidden');
    document.getElementById('nomeCliente').value = '';
}

async function salvarMesa() {
    const cliente = document.getElementById('nomeCliente').value;
    if (!cliente) return alert("Por favor, informe o nome do cliente.");

    try {
        await db.collection("mesas").doc(`mesa-${mesaAtiva}`).set({
            cliente: cliente,
            status: 'Ocupada',
            aberta_em: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        const card = document.getElementById(`card-mesa-${mesaAtiva}`);
        card.classList.replace('border-gray-100', 'border-red-500');
        card.classList.add('bg-red-50');
        document.getElementById(`status-mesa-${mesaAtiva}`).innerText = cliente;
        document.getElementById(`status-mesa-${mesaAtiva}`).classList.replace('text-green-500', 'text-red-600');
        
        fecharModal();
    } catch (e) { 
        console.error(e);
        alert("Erro ao conectar! Verifique se ativou o Modo de Teste no Firestore.");
    }
}

// Inicialização ao carregar página
carregarMesas();
