// Conjunto de datos ficticios pero consistentes para el campeonato VTC Valorant.
const tournamentData = {
  teams: [
    { name: "Vortex", played: 8, wins: 7, losses: 1, kd: 1.31, kills: [82, 177, 279, 373, 476, 580, 678, 783] },
    { name: "Phantom", played: 8, wins: 6, losses: 2, kd: 1.24, kills: [76, 171, 263, 365, 457, 553, 656, 748] },
    { name: "Nexus", played: 8, wins: 5, losses: 3, kd: 1.12, kills: [79, 163, 258, 347, 444, 534, 622, 719] },
    { name: "Sentinel", played: 8, wins: 5, losses: 3, kd: 1.08, kills: [73, 165, 249, 341, 426, 519, 611, 701] },
    { name: "Radiant", played: 8, wins: 4, losses: 4, kd: 1.02, kills: [75, 158, 249, 334, 423, 508, 598, 686] },
    { name: "Eclipse", played: 8, wins: 4, losses: 4, kd: .98, kills: [71, 161, 244, 327, 413, 501, 588, 674] },
    { name: "Striker", played: 8, wins: 3, losses: 5, kd: .91, kills: [68, 151, 232, 311, 399, 483, 568, 652] },
    { name: "Nova", played: 8, wins: 2, losses: 6, kd: .84, kills: [64, 143, 223, 303, 381, 462, 543, 621] }
  ],
  maps: [
    { name: "Ascent", count: 14 },
    { name: "Haven", count: 12 },
    { name: "Bind", count: 10 },
    { name: "Split", count: 7 },
    { name: "Lotus", count: 5 }
  ],
  players: [
    { name: "NØVA", team: "Vortex", kd: "1.42", acs: 284, role: "Duelista" },
    { name: "Kairo", team: "Phantom", kd: "1.36", acs: 271, role: "Iniciador" },
    { name: "Astra", team: "Vortex", kd: "1.29", acs: 263, role: "Controlador" },
    { name: "Reven", team: "Nexus", kd: "1.22", acs: 251, role: "Duelista" }
  ],
  finalists: [
    { name: "Vortex", stats: [78, 84, 73, 62, 81] },
    { name: "Phantom", stats: [72, 77, 86, 74, 73] }
  ],
  stages: {
    all: { matches: 48, mapMultiplier: 1, mvp: "NØVA", mvpDetail: "K/D 1.42 · Vortex", mvpKD: "1.42" },
    group: { matches: 32, mapMultiplier: .67, mvp: "NØVA", mvpDetail: "K/D 1.39 · Vortex", mvpKD: "1.39" },
    playoffs: { matches: 16, mapMultiplier: .34, mvp: "Kairo", mvpDetail: "K/D 1.48 · Phantom", mvpKD: "1.48" }
  }
};

let chartColors = ["#ff4655", "#495057", "#7a838a", "#aeb4b9", "#d2d6d9"];
let gridColor = "rgba(222, 226, 230, .75)";
const chartFont = { family: "Inter, Segoe UI, Arial, sans-serif", size: 9 };
const chartInstances = {};

function getChartTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();
}

function updateChartTheme() {
  const isDark = document.documentElement.dataset.theme === "dark";
  chartColors = isDark
    ? ["#ff4655", "#e0e3e6", "#b0b7be", "#818990", "#596168"]
    : ["#ff4655", "#495057", "#7a838a", "#aeb4b9", "#d2d6d9"];
  gridColor = isDark ? "rgba(255, 255, 255, .12)" : "rgba(222, 226, 230, .75)";
}

function getStageTeams(stage) {
  if (stage === "group") {
    return tournamentData.teams.map((team) => ({ ...team, wins: Math.round(team.wins * .67), played: 5, losses: 5 - Math.round(team.wins * .67), kd: Number((team.kd * .98).toFixed(2)) }));
  }
  if (stage === "playoffs") {
    return tournamentData.teams.slice(0, 4).map((team, index) => ({ ...team, wins: [3, 2, 1, 0][index], played: [4, 4, 3, 3][index], losses: [1, 2, 2, 3][index], kd: Number((team.kd * (index < 2 ? 1.03 : .97)).toFixed(2)) }));
  }
  return tournamentData.teams.map((team) => ({ ...team }));
}

function getStageMapCounts(stage) {
  const multiplier = tournamentData.stages[stage].mapMultiplier;
  return tournamentData.maps.map((map) => ({ ...map, count: Math.max(1, Math.round(map.count * multiplier)) }));
}

function updateKpis(stage, maps) {
  const config = tournamentData.stages[stage];
  const mostPlayedMap = [...maps].sort((a, b) => b.count - a.count)[0];
  document.querySelector("#kpi-matches").textContent = String(config.matches);
  document.querySelector("#kpi-teams").textContent = stage === "playoffs" ? "4" : "8";
  document.querySelector("#kpi-mvp").textContent = config.mvp;
  document.querySelector("#kpi-mvp-detail").textContent = config.mvpDetail;
  document.querySelector("#kpi-map").textContent = mostPlayedMap.name;
  document.querySelector("#kpi-map-detail").textContent = `${mostPlayedMap.count} partidas`;
}

function renderLeaderboard(teams) {
  const sortedTeams = [...teams].sort((a, b) => b.wins - a.wins || b.kd - a.kd);
  const medals = ["🥇", "🥈", "🥉"];
  document.querySelector("#leaderboard-body").innerHTML = sortedTeams.map((team, index) => {
    const winRate = team.played ? `${Math.round((team.wins / team.played) * 100)}%` : "—";
    return `<tr><td class="position-cell">${medals[index] ?? String(index + 1).padStart(2, "0")}</td><td class="team-cell">${team.name}</td><td>${team.played}</td><td>${team.wins}</td><td>${team.losses}</td><td>${winRate}</td><td>${team.kd.toFixed(2)}</td></tr>`;
  }).join("");
}

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function createWinsChart(teams) {
  destroyChart("wins");
  const topTeams = [...teams].sort((a, b) => b.wins - a.wins).slice(0, 5);
  chartInstances.wins = new Chart(document.querySelector("#wins-chart"), {
    type: "bar",
    data: {
      labels: topTeams.map((team) => team.name),
      datasets: [{ label: "Victorias", data: topTeams.map((team) => team.wins), backgroundColor: topTeams.map((_, index) => index === 0 ? "#ff4655" : chartColors[index + 1]), borderRadius: 5, maxBarThickness: 36 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "#212529", padding: 10, titleFont: chartFont, bodyFont: chartFont, callbacks: { label: (context) => ` ${context.parsed.y} victorias` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: getChartTextColor(), font: chartFont } },
        y: { beginAtZero: true, suggestedMax: 8, ticks: { stepSize: 1, color: getChartTextColor(), font: chartFont }, grid: { color: gridColor }, title: { display: true, text: "Victorias", color: getChartTextColor(), font: chartFont } }
      }
    }
  });
}

function renderMapLegend(maps) {
  document.querySelector("#map-legend").innerHTML = maps.map((map, index) => `<span><i style="background:${chartColors[index]}"></i>${map.name}</span>`).join("");
}

function createMapsChart(maps) {
  destroyChart("maps");
  chartInstances.maps = new Chart(document.querySelector("#maps-chart"), {
    type: "doughnut",
    data: { labels: maps.map((map) => map.name), datasets: [{ data: maps.map((map) => map.count), backgroundColor: chartColors, borderColor: getComputedStyle(document.documentElement).getPropertyValue("--white").trim(), borderWidth: 3, hoverOffset: 5 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "#212529", padding: 10, titleFont: chartFont, bodyFont: chartFont, callbacks: { label: (context) => ` ${context.label}: ${context.parsed} partidas` } }
      }
    }
  });
  renderMapLegend(maps);
}

function createKillsChart() {
  destroyChart("kills");
  const topTeams = tournamentData.teams.slice(0, 3);
  chartInstances.kills = new Chart(document.querySelector("#kills-chart"), {
    type: "line",
    data: {
      labels: ["Jornada 1", "Jornada 2", "Jornada 3", "Jornada 4", "Jornada 5", "Jornada 6", "Jornada 7", "Jornada 8"],
      datasets: topTeams.map((team, index) => ({
        label: team.name,
        data: team.kills,
        borderColor: chartColors[index],
        backgroundColor: chartColors[index],
        borderWidth: index === 0 ? 2.5 : 2,
        pointRadius: 2.5,
        pointHoverRadius: 5,
        tension: .32
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", boxWidth: 7, padding: 20, color: getChartTextColor(), font: chartFont } }, tooltip: { backgroundColor: "#212529", padding: 10, titleFont: chartFont, bodyFont: chartFont, callbacks: { label: (context) => ` ${context.dataset.label}: ${context.parsed.y} kills` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: getChartTextColor(), font: chartFont, maxRotation: 0, callback: (_, index) => `J${index + 1}` } },
        y: { beginAtZero: true, ticks: { color: getChartTextColor(), font: chartFont }, grid: { color: gridColor }, title: { display: true, text: "Kills acumuladas", color: getChartTextColor(), font: chartFont } }
      }
    }
  });
}

function createFinalistsChart() {
  destroyChart("finalists");
  const [first, second] = tournamentData.finalists;
  chartInstances.finalists = new Chart(document.querySelector("#finalists-chart"), {
    type: "radar",
    data: {
      labels: ["ACS", "K/D", "First Bloods", "Clutches", "Plant rate"],
      datasets: [
        { label: first.name, data: first.stats, borderColor: "#ff4655", backgroundColor: "rgba(255, 70, 85, .10)", pointBackgroundColor: "#ff4655", pointRadius: 2, borderWidth: 2 },
        { label: second.name, data: second.stats, borderColor: chartColors[1], backgroundColor: document.documentElement.dataset.theme === "dark" ? "rgba(224, 227, 230, .10)" : "rgba(73, 80, 87, .10)", pointBackgroundColor: chartColors[1], pointRadius: 2, borderWidth: 2 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "#212529", padding: 9, titleFont: chartFont, bodyFont: chartFont } },
      scales: { r: { min: 0, max: 100, ticks: { display: false, stepSize: 25 }, grid: { color: gridColor }, angleLines: { color: gridColor }, pointLabels: { color: getChartTextColor(), font: chartFont } } }
    }
  });
  const labels = document.querySelector("#finalists-labels");
  labels.innerHTML = tournamentData.finalists.map((team, index) => `<span><i style="background:${index === 0 ? "#ff4655" : chartColors[1]}"></i>${team.name}</span>`).join("");
}

function renderPlayers() {
  document.querySelector("#players-grid").innerHTML = tournamentData.players.map((player) => {
    const initials = player.name.slice(0, 2);
    return `<article class="player-card"><div class="player-avatar" role="img" aria-label="Avatar placeholder de ${player.name}">${initials}</div><div class="player-info"><h3>${player.name}</h3><span class="player-team">${player.team} · ${player.role}</span><div class="player-stats"><span>K/D <strong>${player.kd}</strong></span><span>ACS <strong>${player.acs}</strong></span></div></div></article>`;
  }).join("");
}

function renderDashboard(stage = "all") {
  updateChartTheme();
  const teams = getStageTeams(stage);
  const maps = getStageMapCounts(stage);
  updateKpis(stage, maps);
  renderLeaderboard(teams);
  createWinsChart(teams);
  createMapsChart(maps);
  createKillsChart();
  createFinalistsChart();
}

function addPdfTable(doc, options) {
  if (typeof doc.autoTable !== "function") {
    throw new Error("No está disponible el complemento de tablas para generar el PDF.");
  }
  doc.autoTable({
    theme: "grid",
    styles: { font: "helvetica", fontSize: 8, cellPadding: 2.5, textColor: [33, 37, 41], lineColor: [222, 226, 230] },
    headStyles: { fillColor: [33, 37, 41], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
    ...options
  });
}

function addPdfChartPages(doc) {
  const charts = [
    { id: "wins", title: "Top equipos por victorias" },
    { id: "maps", title: "Distribución de mapas" },
    { id: "kills", title: "Evolución de kills por jornada" },
    { id: "finalists", title: "Comparativa de equipos finalistas" }
  ].filter(({ id }) => chartInstances[id]);

  for (let index = 0; index < charts.length; index += 2) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(33, 37, 41);
    doc.text("Gráficas del torneo", 14, 18);

    charts.slice(index, index + 2).forEach((chart, chartIndex) => {
      const image = chartInstances[chart.id].toBase64Image("image/png", 1);
      const x = chartIndex === 0 ? 14 : 108;
      doc.setFontSize(9);
      doc.text(chart.title, x, 31);
      doc.addImage(image, "PNG", x, 36, 88, 66, undefined, "FAST");
    });
  }
}

function downloadDashboardPdf() {
  const JsPDF = window.jspdf?.jsPDF;
  if (!JsPDF) {
    window.alert("No se pudo cargar el generador de PDF. Comprueba tu conexión a Internet e inténtalo de nuevo.");
    return;
  }

  try {
    const doc = new JsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const stageSelect = document.querySelector("#stage-select");
    const stageName = stageSelect.options[stageSelect.selectedIndex].text;
    const date = new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(new Date());
    const kpis = [
      ["Partidas jugadas", document.querySelector("#kpi-matches").textContent],
      ["Equipos participantes", document.querySelector("#kpi-teams").textContent],
      ["Jugador MVP", `${document.querySelector("#kpi-mvp").textContent} (${document.querySelector("#kpi-mvp-detail").textContent})`],
      ["Mapa más jugado", `${document.querySelector("#kpi-map").textContent} (${document.querySelector("#kpi-map-detail").textContent})`]
    ];
    const leaderboard = [...document.querySelectorAll("#leaderboard-body tr")].map((row) =>
      [...row.cells].map((cell) => cell.textContent.trim())
    );
    const players = tournamentData.players.map((player) => [player.name, player.team, player.role, player.kd, String(player.acs)]);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(33, 37, 41);
    doc.text("Campeonato VTC Valorant", 14, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(108, 117, 125);
    doc.text(`Etapa: ${stageName}  ·  Informe generado el ${date}`, 14, 24);

    addPdfTable(doc, {
      startY: 30,
      head: [["INDICADORES", "VALOR", "INDICADORES", "VALOR"]],
      body: [[kpis[0][0], kpis[0][1], kpis[1][0], kpis[1][1]], [kpis[2][0], kpis[2][1], kpis[3][0], kpis[3][1]]],
      columnStyles: { 0: { fontStyle: "bold" }, 2: { fontStyle: "bold" } }
    });

    let nextY = doc.lastAutoTable.finalY + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text("Tabla de posiciones", 14, nextY);
    addPdfTable(doc, {
      startY: nextY + 3,
      head: [["POS", "EQUIPO", "PJ", "PG", "PP", "WIN RATE", "K/D"]],
      body: leaderboard
    });

    nextY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(12);
    doc.text("Mejores jugadores", 14, nextY);
    addPdfTable(doc, {
      startY: nextY + 3,
      head: [["JUGADOR", "EQUIPO", "ROL", "K/D", "ACS"]],
      body: players
    });

    addPdfChartPages(doc);
    doc.save(`campeonato-vtc-${stageSelect.value}-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error("No se pudo generar el informe PDF.", error);
    window.alert("Ocurrió un error al generar el PDF. Revisa la consola e inténtalo de nuevo.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#download-pdf").addEventListener("click", downloadDashboardPdf);

  if (typeof Chart === "undefined") {
    document.querySelectorAll(".chart-card, .finalists-card").forEach((card) => {
      const message = document.createElement("p");
      message.className = "chart-subtitle";
      message.setAttribute("role", "alert");
      message.textContent = "No se pudieron cargar las gráficas. Comprueba tu conexión e inténtalo de nuevo.";
      card.append(message);
    });
    return;
  }

  const stageSelect = document.querySelector("#stage-select");
  renderDashboard(stageSelect.value);
  stageSelect.addEventListener("change", (event) => renderDashboard(event.target.value));
  window.addEventListener("dataclara:themechange", () => renderDashboard(stageSelect.value));
  renderPlayers();
});
