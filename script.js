const apiURL = "https://crud-professor-backend.onrender.com/api/professores";

const profForm = document.getElementById("profForm");
const btnCadastrar = document.getElementById("btnCadastrar");
const btnAtualizar = document.getElementById("btnAtualizar");
const inputNome = document.getElementById("nome");
const inputDisciplina = document.getElementById("disciplina");
const inputId = document.getElementById("profId");

let editandoId = null;

profForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (editandoId) return; // Evita submit durante edição
  const nome = inputNome.value;
  const disciplina = inputDisciplina.value;

  await fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, disciplina })
  });

  profForm.reset();
  carregarProfessores();
});

btnAtualizar.addEventListener("click", async () => {
  const id = inputId.value;
  const nome = inputNome.value;
  const disciplina = inputDisciplina.value;
  await updateProfessor(id, nome, disciplina);
  profForm.reset();
  btnAtualizar.classList.add("d-none");
  btnCadastrar.classList.remove("d-none");
  editandoId = null;
});

async function carregarProfessores() {
  const res = await fetch(apiURL);
  const dados = await res.json();

  const lista = document.getElementById("listaProfessores");
  lista.innerHTML = "";
  if (dados.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-center text-muted">Nenhum professor cadastrado.</li>`;
    return;
  }
  dados.forEach(p => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${p.nome}</strong> <span class="text-secondary">(${p.disciplina})</span>
      </div>
      <div>
        <button class="btn btn-sm btn-warning me-2" onclick="editarProfessor(${p.id}, '${p.nome.replace(/'/g, "\\'")}', '${p.disciplina.replace(/'/g, "\\'")}')">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-sm btn-danger" onclick="deletarProfessor(${p.id})">
          <i class="bi bi-trash"></i> Excluir
        </button>
      </div>
    `;
    lista.appendChild(li);
  });
}

// Função global para ser chamada no onclick
window.editarProfessor = function(id, nome, disciplina) {
  inputId.value = id;
  inputNome.value = nome;
  inputDisciplina.value = disciplina;
  btnCadastrar.classList.add("d-none");
  btnAtualizar.classList.remove("d-none");
  editandoId = id;
  inputNome.focus();
};

async function updateProfessor(id, nome, disciplina) {
  await fetch(`${apiURL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, disciplina })
  });
  carregarProfessores();
}

async function deletarProfessor(id) {
  await fetch(`${apiURL}/${id}`, {
    method: "DELETE"
  });
  carregarProfessores();
}

carregarProfessores();
