async function salvarMesa() {
    const cliente = document.getElementById('nomeCliente').value.trim();
    
    // Trava de segurança: Não aceita nome vazio ou muito curto
    if (cliente.length < 3) {
        alert("Erro: Digite um nome válido (mínimo 3 letras) para identificar a comanda.");
        return;
    }

    try {
        await db.collection("mesas").doc(`mesa-${mesaAtiva}`).set({
            cliente: cliente,
            status: 'Ocupada',
            aberta_em: firebase.firestore.FieldValue.serverTimestamp(),
            unidade: "Boteco 934 - Petrolina" // Registro da unidade para segurança
        });
        
        atualizarVisualMesa(mesaAtiva, cliente);
        fecharModal();
    } catch (e) { 
        console.error("Falha na Segurança:", e);
        alert("Erro de permissão: O banco de dados recusou a gravação.");
    }
}
