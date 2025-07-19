document.addEventListener("DOMContentLoaded", () => {
  // Frase motivacional
  const frases = [
    "¡Hoy será un gran día! 💫",
    "No te rindas, lo mejor está por venir 🌈",
    "Cree en ti misma ✨",
    "Paso a paso se logra todo 🐾",
    "¡Puedes con esto y más! 💪"
  ];
  document.getElementById("fraseMotivacional").textContent =
    frases[Math.floor(Math.random() * frases.length)];

  // ------------------ CALENDARIO ------------------
  const calendar = document.getElementById("calendar");
  const eventoModal = document.getElementById("eventoModal");
  const eventoTexto = document.getElementById("eventoTexto");
  const guardarEvento = document.getElementById("guardarEvento");
  const cerrarModal = document.getElementById("cerrarModal");

  let eventos = JSON.parse(localStorage.getItem("eventos")) || {};
  let diaSeleccionado = null;

  function obtenerFechaActual(year, month, day) {
    const y = String(year);
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function crearCalendario() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const offset = firstDay.getDay();

    calendar.innerHTML = "";

    for (let i = 0; i < offset; i++) {
      const empty = document.createElement("div");
      calendar.appendChild(empty);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const fecha = obtenerFechaActual(year, month, day);

      const div = document.createElement("div");
      div.classList.add("dia");
      if (day === hoy.getDate()) div.classList.add("hoy");

      const num = document.createElement("div");
      num.classList.add("numero");
      num.textContent = day;
      div.appendChild(num);

      if (eventos[fecha]) {
        const ev = document.createElement("div");
        ev.classList.add("evento");
        ev.textContent = eventos[fecha];
        div.appendChild(ev);
      }

      div.addEventListener("click", () => {
        diaSeleccionado = fecha;
        eventoTexto.value = eventos[fecha] || "";
        eventoModal.style.display = "block";
      });

      calendar.appendChild(div);
    }
  }

  guardarEvento.addEventListener("click", () => {
    if (eventoTexto.value.trim()) {
      eventos[diaSeleccionado] = eventoTexto.value;
    } else {
      delete eventos[diaSeleccionado];
    }
    localStorage.setItem("eventos", JSON.stringify(eventos));
    crearCalendario();
    eventoModal.style.display = "none";
  });

  cerrarModal.addEventListener("click", () => {
    eventoModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === eventoModal) {
      eventoModal.style.display = "none";
    }
  });

  // ------------------ HORARIO ------------------
  const tablaHorario = document.getElementById("tablaHorario");
  const btnAgregar = document.getElementById("agregarFila");
  const btnEliminar = document.getElementById("eliminarFila");

  let horarioData = JSON.parse(localStorage.getItem("horarioData")) || [
    ["08:00", "", "", "", "", ""],
    ["09:00", "", "", "", "", ""],
    ["10:00", "", "", "", "", ""]
  ];

  function guardarHorario() {
    localStorage.setItem("horarioData", JSON.stringify(horarioData));
  }

  function renderHorario() {
    tablaHorario.innerHTML = "";
    horarioData.forEach((fila, filaIndex) => {
      const tr = document.createElement("tr");
      fila.forEach((celda, celdaIndex) => {
        const td = document.createElement("td");
        td.contentEditable = true;
        td.textContent = celda;
        td.addEventListener("input", () => {
          horarioData[filaIndex][celdaIndex] = td.textContent;
          guardarHorario();
        });
        tr.appendChild(td);
      });
      tablaHorario.appendChild(tr);
    });
  }

  btnAgregar.addEventListener("click", () => {
    horarioData.push(["Nueva hora", "", "", "", "", ""]);
    guardarHorario();
    renderHorario();
  });

  btnEliminar.addEventListener("click", () => {
    if (horarioData.length > 1) {
      horarioData.pop();
      guardarHorario();
      renderHorario();
    }
  });

  crearCalendario();
  renderHorario();
});
