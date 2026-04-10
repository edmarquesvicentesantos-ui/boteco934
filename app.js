// CONFIGURAÇÃO FIREBASE (Substitua pelos seus dados do console)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "000000000",
    appId: "1:00000000:web:000000"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- LOGICA DE PRECIFICAÇÃO ---
const inputs = ['custoEntrada', 'qtdUnidades', 'markupAlvo'];
inputs.forEach(id => document.getElementById(id).addEventListener('input', calcular));

function calcular() {
    const custo = parseFloat(document.getElementById('custoEntrada').value) || 0;
    const qtd = parseInt(document.getElementById('qtdUnidades').value) || 1;
    const margem = parseFloat(document.getElementById('markupAlvo').value) / 100;

    if (custo <= 0) return;

    const custoUn = custo / qtd;
    const precoBase = custoUn / (1 - margem);

    const tipos = [
        { nome: "Natural", preco: precoBase, custo: custoUn },
        { nome: "Gelada (+15%)", preco: precoBase * 1.15, custo: custoUn },
        { nome: "Dose (1L/20un)", preco: (custoUn / 20 * 1.05) / (1 - (margem + 0.15)), custo: (custoUn / 20 * 1.05) }
    ];

    document.getElementById('tabelaPrecos').innerHTML = tipos.map(t => `
        <tr class="border-b border-gray-50">
            <td class="py-3 font-semibold">${t.nome}</td>
            <td>R$ ${t.custo.toFixed(2)}</td>
            <td class="text-blue-600 font-bold">R$ ${t.preco.toFixed(2)}</td>
            <td class="text-green-500 font-medium">R$ ${(t.preco - t.custo).toFixed(2)}</td>
        </tr>
    `).join('');
}

// --- LOGICA DE MESAS ---
let mesaAtiva = null;

function renderizarMapaMesas() {
    const container = document.getElementById('containerMesas');
    container.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        container.innerHTML += `
            <div onclick="abrirModal(${i})" id="card-mesa-${i}" class="bg-white border-2 border-gray-100 p-4 rounded-xl cursor-pointer hover:border-blue-500 transition shadow-sm">
                <span class="block text-gray-400 text-xs font-bold uppercase">Mesa</span>
                <span class="text-2xl font-black text-gray-800">${i < 10 ? '0' + i : i}</span>
                <span id="status-mesa-${i}" class="block text-[10px] mt-2 text-green-500 font-bold uppercase">Livre</span>
            </div>
        `;
    }
}

function abrirModal(num) {
    mesaAtiva = num;
    document.getElementById('modalTitulo').innerText = `Mesa ${num}`;
    document.getElementById('modalMesa').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modalMesa').classList.add('hidden');
    document.getElementById('nomeCliente').value = '';
}

async function salvarMesa() {
    const cliente = document.getElementById('nomeCliente').value;
    if (!cliente) return alert("Nome do cliente obrigatório!");

    try {
        await db.collection("mesas").doc(`mesa-${mesaAtiva}`).set({
            cliente: cliente,
            status: 'Ocupada',
            inicio: new Date()
        });
        
        const card = document.getElementById(`card-mesa-${mesaAtiva}`);
        card.classList.replace('border-gray-100', 'border-red-500');
        card.classList.add('bg-red-50');
        document.getElementById(`status-mesa-${mesaAtiva}`).innerText = cliente;
        document.getElementById(`status-mesa-${mesaAtiva}`).classList.replace('text-green-500', 'text-red-500');
        
        fecharModal();
    } catch (e) { console.error(e); }
}

// Inicializar
renderizarMapaMesas();
