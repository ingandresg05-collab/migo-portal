document.addEventListener("DOMContentLoaded", () => {
const STORAGE_KEY = "migo_mobile_mvp_v1";

const state = {
  route: "home",
  flow: null,
  step: 0,
  stage: "questions",
  answers: { client: {}, property: {} },
  uploads: { client: {}, property: {} },
  banks: { client: [], property: [] },
  phone: { client: "", property: "" },
  processes: [],
  marketFilter: "Todas",
  selectedProperty: null,
  methodStep: 0,
  valuationMode: null,
  valuationStage: "mode",
  valuationStep: 0,
  valuationAnswers: {},
  valuationResult: null,
  selectedService: null
};

const methodPages = [
  {
    kicker: "Confianza primero",
    icon: "shield-check",
    title: "Compra con mayor confianza una propiedad depurada",
    copy: "Con Migo, comprar una propiedad pasa de ser un proceso largo, inseguro y tedioso a una experiencia ágil, organizada y con mayor seguridad, concentrando la información y los pasos esenciales en un mismo lugar.",
    points: [
      ["file-check-2", "Documentación revisada", "Organizamos y verificamos la información disponible sobre identidad, título, IPI y gravámenes."],
      ["house-check", "Propiedad depurada", "Presentamos con claridad cuáles validaciones legales, técnicas y comerciales han sido completadas."],
      ["badge-check", "Información transparente", "Cada propiedad muestra su estado para que el cliente pueda decidir con mayor seguridad." ]
    ],
    note: "La depuración reduce riesgos, pero no sustituye la debida diligencia legal ni constituye una garantía absoluta contra fraudes."
  },
  {
    kicker: "El problema",
    icon: "waypoints",
    title: "Comprar o vender una propiedad suele ser un proceso fragmentado",
    copy: "El cliente, la propiedad y el financiamiento normalmente se revisan por separado. Esto produce retrasos, documentos incompletos y decisiones con poca claridad.",
    points: [
      ["clock-3", "Tiempo perdido", "Visitas y gestiones antes de saber si la operación es viable."],
      ["files", "Información dispersa", "Documentos, tasación y bancos en canales diferentes."],
      ["triangle-alert", "Mayor incertidumbre", "Riesgos legales o financieros descubiertos demasiado tarde."]
    ]
  },
  {
    kicker: "La solución",
    icon: "combine",
    title: "Migo reúne las tres piezas en un mismo lugar",
    copy: "Preparamos al cliente, organizamos la información de la propiedad y conectamos el expediente con los bancos elegidos.",
    points: [
      ["user-round-check", "Cliente preparado", "Perfil financiero y documentos listos para evaluación."],
      ["house-check", "Propiedad depurada", "Información legal, técnica y comercial organizada."],
      ["landmark", "Financiamiento conectado", "Solicitud enviada a las entidades seleccionadas por el cliente."]
    ]
  },
  {
    kicker: "La metodología",
    icon: "shield-check",
    title: "Organizamos las verificaciones habituales de una operación hipotecaria",
    copy: "Migo prepara la información financiera, legal y técnica que normalmente se necesita para evaluar una compraventa y su posible financiamiento.",
    points: [
      ["badge-check", "Capacidad financiera", "Ingresos, compromisos, inicial y capacidad estimada de pago."],
      ["file-search", "Seguridad jurídica", "Título, identidad, IPI, gravámenes y documentación disponible."],
      ["ruler", "Validación técnica", "Levantamiento de la propiedad y certificación por un tasador autorizado al ejecutar el préstamo."]
    ],
    note: "Migo no garantiza la aprobación bancaria. La decisión, la tasa y las condiciones corresponden exclusivamente a cada entidad financiera."
  },
  {
    kicker: "El resultado",
    icon: "sparkles",
    title: "Comprar o vender puede ser más fácil, rápido y organizado",
    copy: "Migo reúne al cliente, la propiedad, los documentos y la solicitud de financiamiento en un mismo lugar para simplificar cada etapa de la operación.",
    points: [
      ["timer", "Ahorro de tiempo", "Menos pasos repetidos y mayor claridad desde el inicio."],
      ["layout-dashboard", "Todo en un mismo lugar", "Perfil, propiedad, documentos, bancos y seguimiento."],
      ["shield-check", "Mayor confianza", "Información de la propiedad revisada y expedientes mejor organizados para tomar decisiones."]
    ]
  }
];

const adviceItems = [
  ["file-check-2", "Confirma la titularidad", "Verifica que la persona que vende figure como propietaria y que el título corresponda al inmueble."],
  ["shield-check", "Revisa cargas y gravámenes", "Solicita certificaciones actualizadas antes de entregar dinero o firmar compromisos."],
  ["map-pin-check", "Valida la ubicación", "Visita la propiedad, confirma sus linderos y compara la ubicación real con la documentación."],
  ["badge-dollar-sign", "Calcula todos los costos", "Incluye inicial, gastos legales, impuestos, seguros y cuotas estimadas del financiamiento."],
  ["landmark", "Compara alternativas bancarias", "La tasa no es el único factor: revisa plazo, seguros, penalidades y requisitos."],
  ["hand-coins", "Evita pagos sin respaldo", "No transfieras fondos sin documentos verificables, recibos y acompañamiento profesional."]
];

const services = [
  {
    id: "migo-360",
    number: "01",
    icon: "orbit",
    shortTitle: "Migo 360",
    title: "Acompañamiento integral en la compra de inmuebles",
    description: "Te acompañamos durante todo el proceso de compra, desde la definición de lo que necesitas hasta la formalización de la adquisición.",
    highlight: "Un solo acompañamiento para coordinar cada etapa de tu compra.",
    action: "client",
    actionLabel: "Comenzar mi proceso de compra",
    items: [
      "Asesoría inicial al comprador.",
      "Identificación de necesidades y presupuesto.",
      "Búsqueda de propiedades según el perfil del comprador.",
      "Coordinación de visitas a inmuebles.",
      "Comparación de propiedades y precios de mercado.",
      "Evaluación preliminar de la propiedad seleccionada.",
      "Coordinación de tasación inmobiliaria.",
      "Verificación de títulos y documentación legal.",
      "Coordinación de inspección técnica del inmueble.",
      "Gestión de precalificación hipotecaria.",
      "Asesoría en negociación del precio de compra.",
      "Coordinación de contratos y promesa de venta.",
      "Seguimiento del expediente de financiamiento.",
      "Coordinación de documentación para la transferencia.",
      "Acompañamiento hasta la formalización de la compra."
    ]
  },
  {
    id: "tasacion",
    number: "02",
    icon: "chart-no-axes-combined",
    shortTitle: "Tasación y valorización",
    title: "Tasación y valorización inmobiliaria",
    description: "Determinamos el valor comercial orientativo o técnico de propiedades y terrenos mediante evaluación profesional y análisis de mercado.",
    highlight: "Conoce el valor de una propiedad con criterios técnicos y referencias comparables.",
    route: "tasimetro",
    actionLabel: "Usar el Tasímetro",
    items: [
      "Tasación de casas.",
      "Tasación de apartamentos.",
      "Tasación de villas.",
      "Tasación de solares y terrenos.",
      "Tasación de fincas y terrenos rurales.",
      "Tasación de locales comerciales.",
      "Tasación de edificios y naves industriales.",
      "Tasación de propiedades para fines hipotecarios.",
      "Valoración de inmuebles para compra y venta.",
      "Valoración de propiedades para inversión.",
      "Valoración de inmuebles para herencias y particiones.",
      "Estimación del valor de alquiler.",
      "Análisis del precio por metro cuadrado.",
      "Estudio comparativo de propiedades similares.",
      "Evaluación del potencial de valorización de un inmueble.",
      "Valoración de terrenos para desarrollo inmobiliario."
    ]
  },
  {
    id: "legal",
    number: "03",
    icon: "scale",
    shortTitle: "Servicios legales",
    title: "Servicios legales inmobiliarios",
    description: "Asesoría y asistencia jurídica para aumentar la seguridad documental y legal de las operaciones inmobiliarias.",
    highlight: "Documentos revisados y decisiones respaldadas por profesionales del área legal.",
    items: [
      "Elaboración de contratos de compraventa.",
      "Elaboración de promesas de venta.",
      "Contratos de alquiler residencial y comercial.",
      "Contratos de opción a compra.",
      "Contratos de reserva de propiedades.",
      "Revisión legal de documentos inmobiliarios.",
      "Verificación de títulos de propiedad.",
      "Investigación de cargas, gravámenes y oposiciones.",
      "Debida diligencia legal de inmuebles.",
      "Asesoría para transferencias inmobiliarias.",
      "Elaboración y revisión de poderes relacionados con inmuebles.",
      "Asesoría legal para compra de propiedades.",
      "Asesoría en propiedades heredadas.",
      "Asesoría en conflictos de propiedad y copropiedad.",
      "Constitución y documentación legal de condominios.",
      "Asesoría para inversionistas inmobiliarios extranjeros.",
      "Constitución de sociedades para inversiones inmobiliarias."
    ]
  },
  {
    id: "agrimensura",
    number: "04",
    icon: "ruler",
    shortTitle: "Agrimensura",
    title: "Agrimensura",
    description: "Levantamiento, medición, delimitación y gestión técnica de terrenos y parcelas mediante profesionales especializados.",
    highlight: "Precisión técnica para conocer, delimitar y gestionar correctamente un terreno.",
    items: [
      "Mensura catastral.",
      "Deslinde de terrenos.",
      "Subdivisión de parcelas.",
      "Refundición de parcelas.",
      "Levantamientos topográficos.",
      "Replanteo de solares y terrenos.",
      "Georreferenciación de propiedades.",
      "Determinación de linderos y colindancias.",
      "Verificación de superficie de terrenos.",
      "Levantamientos planimétricos y altimétricos.",
      "Actualización de planos parcelarios.",
      "Ubicación de coordenadas y vértices.",
      "Asistencia técnica para saneamiento de terrenos.",
      "Verificación de diferencias entre superficie física y registrada.",
      "Estudios de cabida y aprovechamiento de terrenos.",
      "Preparación de documentación técnica para trámites catastrales."
    ]
  },
  {
    id: "hipotecario",
    number: "05",
    icon: "landmark",
    shortTitle: "Préstamo hipotecario",
    title: "Gestión de préstamo hipotecario",
    description: "Acompañamiento en la preparación, presentación y seguimiento de la solicitud de financiamiento ante las entidades financieras elegidas.",
    highlight: "Un expediente mejor organizado para avanzar con claridad ante las entidades financieras.",
    action: "client",
    actionLabel: "Iniciar precalificación hipotecaria",
    note: "La aprobación, tasa, monto y condiciones dependen exclusivamente de cada entidad financiera. Migo no garantiza la aprobación bancaria.",
    items: [
      "Evaluación inicial del perfil financiero del solicitante.",
      "Precalificación hipotecaria.",
      "Evaluación de capacidad de endeudamiento.",
      "Estimación del inicial requerido para la compra.",
      "Simulación de cuotas hipotecarias.",
      "Orientación sobre requisitos bancarios.",
      "Comparación de opciones de financiamiento.",
      "Identificación de entidades financieras adecuadas al perfil del cliente.",
      "Organización y revisión de documentos del solicitante.",
      "Preparación del expediente hipotecario.",
      "Coordinación de la documentación del inmueble.",
      "Seguimiento de la solicitud ante la entidad financiera.",
      "Coordinación de la tasación requerida por el banco.",
      "Seguimiento de observaciones y documentos pendientes.",
      "Acompañamiento durante el proceso de evaluación y aprobación.",
      "Orientación sobre condiciones de financiamiento.",
      "Seguimiento hasta el desembolso, sujeto a la aprobación de la entidad financiera."
    ]
  }
];

const clientQuestions = [
  { id: "goal", title: "¿Qué deseas lograr?", help: "Selecciona la opción que mejor describe tu momento actual.", options: [["Comprar mi primera vivienda","key-round"],["Cambiar de vivienda","refresh-cw"],["Comprar para invertir","chart-no-axes-combined"],["Conocer mi capacidad","badge-dollar-sign"]] },
  { id: "propertyType", title: "¿Qué tipo de propiedad buscas?", options: [["Apartamento","building-2"],["Casa","house"],["Villa","palmtree"],["Finca","trees"],["Solar","map"]], manual: true },
  { id: "zone", title: "¿En qué zona deseas comprar?", help: "Esto nos ayuda a estimar precios y encontrar propiedades compatibles.", options: [["Distrito Nacional","map-pin"],["Santo Domingo Este","map-pin"],["Santo Domingo Norte","map-pin"],["Santiago","map-pin"]], manual: true },
  { id: "price", title: "¿Cuál es el precio aproximado?", options: [["Hasta RD$4 millones","wallet"],["RD$4 a RD$7 millones","wallet"],["RD$7 a RD$12 millones","wallet"],["Más de RD$12 millones","wallet"]], manual: true, manualType: "number", manualPlaceholder: "Escribe el precio en RD$" },
  { id: "incomeSource", title: "¿Cómo generas tus ingresos?", help: "Puedes seleccionar más de una opción.", multi: true, options: [["Empleado privado","briefcase-business"],["Empleado público","landmark"],["Negocio propio","store"],["Profesional independiente","laptop"]], manual: true },
  { id: "income", title: "¿Cuál es tu ingreso mensual?", options: [["Hasta RD$50,000","circle-dollar-sign"],["RD$50,001 a RD$100,000","circle-dollar-sign"],["RD$100,001 a RD$200,000","circle-dollar-sign"],["Más de RD$200,000","circle-dollar-sign"]], manual: true, manualType: "number", manualPlaceholder: "Ingreso mensual en RD$" },
  { id: "debts", title: "¿Cuánto pagas mensualmente en deudas?", options: [["No tengo deudas","shield-check"],["Hasta RD$15,000","receipt-text"],["RD$15,001 a RD$35,000","receipt-text"],["Más de RD$35,000","receipt-text"]], manual: true, manualType: "number", manualPlaceholder: "Cuotas mensuales en RD$" },
  { id: "initial", title: "¿Cuánto tienes disponible para el inicial?", options: [["Menos de RD$500,000","piggy-bank"],["RD$500,000 a RD$1 millón","piggy-bank"],["RD$1 a RD$2 millones","piggy-bank"],["Más de RD$2 millones","piggy-bank"]], manual: true, manualType: "number", manualPlaceholder: "Monto disponible en RD$" },
  { id: "workTime", title: "¿Qué antigüedad tienen tus ingresos?", options: [["Menos de 6 meses","calendar"],["6 meses a 1 año","calendar-check"],["1 a 3 años","calendar-check"],["Más de 3 años","badge-check"]], manual: true }
];

const propertyQuestions = [
  { id: "relation", title: "¿Cuál es tu relación con la propiedad?", options: [["Soy propietario","user-round"],["Represento al propietario","users-round"],["Soy agente inmobiliario","badge-check"],["Soy desarrollador","building"]] },
  { id: "type", title: "¿Qué tipo de propiedad registrarás?", options: [["Apartamento","building-2"],["Casa","house"],["Villa","palmtree"],["Finca","trees"],["Solar","map"]], manual: true },
  { id: "location", title: "¿Dónde está ubicada?", options: [["Distrito Nacional","map-pin"],["Santo Domingo Este","map-pin"],["Santo Domingo Norte","map-pin"],["Santiago","map-pin"]], manual: true },
  { id: "price", title: "¿Cuál es el precio de venta?", options: [["Hasta RD$4 millones","badge-dollar-sign"],["RD$4 a RD$7 millones","badge-dollar-sign"],["RD$7 a RD$12 millones","badge-dollar-sign"],["Más de RD$12 millones","badge-dollar-sign"]], manual: true, manualType: "number", manualPlaceholder: "Precio de venta en RD$" },
  { id: "area", title: "¿Cuántos metros cuadrados tiene?", options: [["Menos de 80 m²","maximize"],["80 a 120 m²","maximize"],["121 a 200 m²","maximize"],["Más de 200 m²","maximize"]], manual: true, manualType: "number", manualPlaceholder: "Metros cuadrados" },
  { id: "rooms", title: "¿Cuántas habitaciones tiene?", options: [["1 habitación","bed-single"],["2 habitaciones","bed-double"],["3 habitaciones","bed-double"],["4 o más","bed-double"]], manual: true, manualType: "number", manualPlaceholder: "Cantidad de habitaciones" },
  { id: "features", title: "¿Qué incluye la propiedad?", help: "Selecciona todas las opciones que correspondan.", multi: true, options: [["Parqueo","car"],["Ascensor","arrow-up-down"],["Balcón","sun"],["Área social","waves"]], manual: true },
  { id: "condition", title: "¿Cuál es su condición actual?", options: [["Nueva / a estrenar","sparkles"],["Usada en buen estado","house-check"],["Requiere mejoras","hammer"],["En construcción","hard-hat"]] },
  { id: "legal", title: "¿Cuál es su situación legal?", options: [["Título disponible y deslindado","badge-check"],["Título disponible sin deslinde","file-warning"],["Deslinde en proceso","clock-3"],["Necesito orientación","circle-help"]] }
];

const documents = {
  client: [
    ["Cédula de identidad", "Frente y reverso", "scan-line"],
    ["Carta de trabajo", "O certificación de ingresos", "briefcase-business"],
    ["Estados de cuenta", "Últimos tres meses", "landmark"],
    ["Evidencia de ingresos", "Volantes, facturas o declaraciones", "receipt-text"]
  ],
  property: [
    ["Cédula del propietario", "Frente y reverso", "scan-line"],
    ["Copia del título", "Documento legible", "file-text"],
    ["Certificación de IPI", "Certificación vigente", "landmark"],
    ["Certificación de no gravamen", "Emitida por Registro de Títulos", "shield-check"],
    ["Fotos de la propiedad", "Fachada, interiores y áreas comunes", "images"]
  ]
};

const bankOptions = [
  ["popular", "Banco Popular", "BP"],
  ["reservas", "Banreservas", "BR"],
  ["bhd", "Banco BHD", "BHD"],
  ["scotia", "Scotiabank", "SB"]
];

const properties = [
  { id: 1, type: "Apartamento", title: "Apartamento contemporáneo", location: "Piantini, Distrito Nacional", price: 9800000, area: 142, rooms: 3, baths: 2.5, photo: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=82", tags: ["Depurada","Tasada","Título verificado"] },
  { id: 2, type: "Casa", title: "Casa familiar con patio", location: "Cuesta Hermosa II", price: 12500000, area: 260, rooms: 4, baths: 3, photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=82", tags: ["Depurada","Tasada","No gravamen"] },
  { id: 3, type: "Apartamento", title: "Apartamento listo para mudanza", location: "Santo Domingo Este", price: 4850000, area: 96, rooms: 3, baths: 2, photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=82", tags: ["Depurada","Título verificado"] },
  { id: 4, type: "Villa", title: "Villa moderna con terraza", location: "Santiago de los Caballeros", price: 16800000, area: 315, rooms: 4, baths: 4, photo: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=82", tags: ["Depurada","Tasada","Certificada"] },
  { id: 5, type: "Finca", title: "Finca productiva con acceso", location: "Jarabacoa, La Vega", price: 14500000, area: 32000, specs: [["32,000 m²","Terreno"],["Agrícola","Uso"],["Carretera","Acceso"]], photo: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=82", tags: ["Depurada","Tasada","Título verificado"] },
  { id: 6, type: "Solar", title: "Solar residencial deslindado", location: "Punta Cana, La Altagracia", price: 3900000, area: 780, specs: [["780 m²","Terreno"],["Residencial","Uso"],["Deslindado","Estatus"]], photo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=82", tags: ["Depurado","Tasado","Sin gravamen"] }
];

const valuationZones = {
  "Piantini": { built: 112000, land: 78000, confidence: "Alta" },
  "Naco": { built: 96000, land: 69000, confidence: "Alta" },
  "Bella Vista": { built: 84000, land: 61000, confidence: "Alta" },
  "Distrito Nacional (otras zonas)": { built: 72000, land: 50000, confidence: "Media" },
  "Santo Domingo Este": { built: 50000, land: 24000, confidence: "Media" },
  "Santo Domingo Norte": { built: 43000, land: 19000, confidence: "Media" },
  "Santo Domingo Oeste": { built: 45000, land: 21000, confidence: "Media" },
  "Santiago": { built: 57000, land: 26000, confidence: "Media" },
  "Punta Cana / Bávaro": { built: 76000, land: 35000, confidence: "Media" },
  "Jarabacoa": { built: 49000, land: 4200, confidence: "Media" }
};

const screen = document.getElementById("screen");
const topbar = document.getElementById("topbar");
const bottomNav = document.getElementById("bottomNav");
const siteHeader = document.getElementById("siteHeader");

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    state.answers = saved.answers || state.answers;
    state.uploads = saved.uploads || state.uploads;
    state.banks = saved.banks || state.banks;
    state.phone = saved.phone || state.phone;
    state.processes = saved.processes || [];
  } catch (_) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: state.answers, uploads: state.uploads, banks: state.banks, phone: state.phone, processes: state.processes }));
}

function icons() {
  if (window.lucide) window.lucide.createIcons();
}

function money(value) {
  return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(value).replace("DOP", "RD$");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function payment(price, downPercent = 20, annualRate = 12.5, years = 20) {
  const principal = price * (1 - downPercent / 100);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}

function setChrome(home = false) {
  topbar.hidden = home;
  bottomNav.hidden = home || ["flow", "property-detail", "method", "services", "advice", "login"].includes(state.route);
  bottomNav.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.route === state.route));
  siteHeader.querySelectorAll("[data-route]").forEach(button => button.classList.toggle("active", button.dataset.route === state.route));
}

function navigate(route, options = {}) {
  const previousRoute = state.route;
  state.route = route;
  if (route === "services" && previousRoute !== "services") state.selectedService = null;
  if (options.property) state.selectedProperty = options.property;
  setChrome(route === "home");
  if (route === "home") renderHome();
  if (route === "market") renderMarket();
  if (route === "saved") renderSaved();
  if (route === "property-detail") renderPropertyDetail();
  if (route === "method") renderMethod();
  if (route === "services") renderServices();
  if (route === "tasimetro") renderTasimetro();
  if (route === "advice") renderAdvice();
  if (route === "login") renderLogin();
  window.scrollTo(0, 0);
}

function renderHome() {
  screen.innerHTML = document.getElementById("homeTemplate").innerHTML;
  icons();
}

function renderMethod() {
  const page = methodPages[state.methodStep];
  const isLast = state.methodStep === methodPages.length - 1;
  screen.innerHTML = `<section class="method-screen">
    <div class="method-progress" style="--method-pages:${methodPages.length}" aria-label="Página ${state.methodStep + 1} de ${methodPages.length}">
      ${methodPages.map((_, index) => `<button class="method-dot ${index === state.methodStep ? "active" : ""}" data-method-page="${index}" aria-label="Ir a la página ${index + 1}"></button>`).join("")}
    </div>
    <div class="method-visual"><i data-lucide="${page.icon}"></i><span>${String(state.methodStep + 1).padStart(2, "0")}</span></div>
    <p class="method-kicker">${page.kicker}</p>
    <h1>${page.title}</h1>
    <p class="method-copy">${page.copy}</p>
    <div class="method-points">
      ${page.points.map(([icon, title, text]) => `<article><span><i data-lucide="${icon}"></i></span><div><h2>${title}</h2><p>${text}</p></div></article>`).join("")}
    </div>
    ${page.note ? `<p class="method-note"><i data-lucide="info"></i>${page.note}</p>` : ""}
    ${isLast ? `<div class="method-final">
      <h2>¿Qué deseas hacer ahora?</h2>
      <button class="primary-button" data-start="client"><i data-lucide="badge-check"></i>Iniciar precalificación hipotecaria</button>
      <button class="secondary-button" data-start="property"><i data-lucide="house-plus"></i>Registrar propiedad</button>
      <button class="method-back-link" data-method-prev><i data-lucide="arrow-left"></i>Volver al paso anterior</button>
    </div>` : `<div class="method-actions">
      ${state.methodStep > 0 ? `<button class="secondary-button" data-method-prev><i data-lucide="arrow-left"></i>Anterior</button>` : ""}
      <button class="primary-button" data-method-next>Siguiente <i data-lucide="arrow-right"></i></button>
    </div>`}
  </section>`;
  icons();
}

function renderAdvice() {
  screen.innerHTML = `<section class="advice-screen">
    <div class="page-heading"><p>Aprende con Migo</p><h1>Consejos para comprar con mayor confianza</h1><span>Decisiones informadas reducen riesgos y evitan problemas durante una operación inmobiliaria.</span></div>
    <div class="advice-grid">
      ${adviceItems.map(([icon, title, text], index) => `<article><span class="advice-number">${String(index + 1).padStart(2, "0")}</span><i data-lucide="${icon}"></i><h2>${title}</h2><p>${text}</p></article>`).join("")}
    </div>
    <div class="advice-cta"><div><strong>¿Quieres comenzar con información organizada?</strong><span>Migo te guía paso a paso según tu objetivo.</span></div><button class="primary-button" data-route="method">Conocer nuestro método <i data-lucide="arrow-right"></i></button></div>
  </section>`;
  icons();
}

function renderServices() {
  const service = services.find(item => item.id === state.selectedService);
  if (!service) {
    screen.innerHTML = `<section class="services-screen">
      <div class="page-heading services-heading"><p>Catálogo Migo</p><h1>Servicios inmobiliarios para avanzar con mayor confianza</h1><span>Encuentra apoyo especializado para comprar, valorar, revisar, medir o financiar una propiedad, todo conectado desde un mismo lugar.</span></div>
      <div class="services-intro"><i data-lucide="badge-check"></i><p><strong>Elige el servicio que necesitas.</strong><span>Te mostramos su alcance completo y el próximo paso recomendado.</span></p></div>
      <div class="services-grid">
        ${services.map(item => `<button class="service-card" data-service="${item.id}">
          <span class="service-number">${item.number}</span>
          <span class="service-icon"><i data-lucide="${item.icon}"></i></span>
          <span class="service-card-copy"><small>Servicio ${item.number}</small><strong>${item.shortTitle}</strong><em>${item.description}</em></span>
          <i data-lucide="chevron-right"></i>
        </button>`).join("")}
      </div>
      <div class="services-trust"><i data-lucide="shield-check"></i><div><strong>Profesionales según cada especialidad</strong><span>Migo coordina el proceso y conecta cada necesidad con el servicio correspondiente.</span></div></div>
    </section>`;
    icons();
    return;
  }

  screen.innerHTML = `<section class="service-detail-screen">
    <button class="service-back" data-services-back><i data-lucide="arrow-left"></i>Todos los servicios</button>
    <div class="service-detail-head">
      <div class="service-detail-icon"><i data-lucide="${service.icon}"></i><span>${service.number}</span></div>
      <p>Servicio ${service.number}</p>
      <h1>${service.title}</h1>
      <span>${service.description}</span>
    </div>
    <div class="service-highlight"><i data-lucide="sparkles"></i><strong>${service.highlight}</strong></div>
    <div class="service-scope">
      <div class="service-scope-title"><p>Alcance del servicio</p><span>${service.items.length} soluciones disponibles</span></div>
      <div class="service-items">
        ${service.items.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><p>${item}</p><i data-lucide="check"></i></div>`).join("")}
      </div>
    </div>
    ${service.note ? `<p class="service-note"><i data-lucide="info"></i>${service.note}</p>` : ""}
    <div class="service-actions">
      ${service.action ? `<button class="primary-button" data-start="${service.action}">${service.actionLabel}<i data-lucide="arrow-right"></i></button>` : ""}
      ${service.route ? `<button class="primary-button" data-route="${service.route}">${service.actionLabel}<i data-lucide="arrow-right"></i></button>` : ""}
      ${!service.action && !service.route ? `<button class="primary-button" data-service-interest="${service.id}">Me interesa este servicio<i data-lucide="arrow-right"></i></button>` : ""}
      <button class="secondary-button" data-services-back>Explorar otros servicios</button>
    </div>
  </section>`;
  icons();
}

function valuationQuestions() {
  const type = state.valuationAnswers.type;
  const isLand = ["Solar", "Finca"].includes(type);
  const isApartment = type === "Apartamento";
  const hasParking = Number(state.valuationAnswers.parking || 0) > 0;
  const questions = [
    { id: "fullName", title: "¿Cuál es tu nombre?", help: "Antes de comenzar, necesitamos tus datos para identificar tu proceso.", input: "text", placeholder: "Nombre y apellido", contact: true },
    { id: "phone", title: "¿Cuál es tu número de celular?", help: "Lo utilizaremos para dar seguimiento a tu solicitud.", input: "tel", inputMode: "tel", placeholder: "809 555 0000", contact: true },
    { id: "email", title: "¿Cuál es tu correo electrónico?", help: "Aquí podrás recibir el resumen y las opciones de seguimiento.", input: "email", inputMode: "email", placeholder: "nombre@correo.com", contact: true },
    { id: "type", title: "¿Qué tipo de propiedad deseas evaluar?", help: "Selecciona una opción para continuar.", options: [["Apartamento","building-2"],["Casa","house"],["Villa","palmtree"],["Solar","map"],["Finca","trees"]] },
    { id: "zone", title: "¿En qué zona está ubicada?", help: "Usaremos la zona para establecer una referencia por metro cuadrado.", options: Object.keys(valuationZones).map(zone => [zone,"map-pin"]) }
  ];
  if (isApartment) questions.push(
    { id: "apartmentArea", title: "¿Cuántos metros cuadrados tiene el apartamento?", help: "Escribe el área total del apartamento.", input: "number", inputMode: "decimal", placeholder: "Ej. 120", area: true }
  );
  if (type === "Casa" || type === "Villa") questions.push(
    { id: "lotArea", title: "¿Cuántos metros cuadrados tiene el solar?", help: "Escribe el área total del terreno.", input: "number", inputMode: "decimal", placeholder: "Ej. 300", area: true },
    { id: "constructionArea", title: "¿Cuántos metros cuadrados de construcción tiene?", help: "Incluye únicamente el área construida.", input: "number", inputMode: "decimal", placeholder: "Ej. 180", area: true }
  );
  if (isLand) questions.push(
    { id: "lotArea", title: `¿Cuántos metros cuadrados tiene ${type === "Finca" ? "la finca" : "el solar"}?`, help: "Escribe el área total del terreno.", input: "number", inputMode: "decimal", placeholder: "Ej. 500", area: true }
  );
  if (!isLand) questions.push(
    { id: "condition", title: "¿Cuál es la condición de la propiedad?", options: [["Nueva / a estrenar","sparkles","new"],["Usada en buen estado","house-check","good"],["Requiere mejoras","hammer","improve"],["En construcción","hard-hat","construction"]] },
    { id: "rooms", title: "¿Cuántas habitaciones tiene?", options: [["1 habitación","bed-single","1"],["2 habitaciones","bed-double","2"],["3 habitaciones","bed-double","3"],["4 o más","bed-double","4"]] },
    { id: "parking", title: "¿Cuántos parqueos incluye?", options: [["No tiene","circle-slash","0"],["1 parqueo","car","1"],["2 parqueos","car-front","2"],["3 o más","badge-plus","3"]] }
  );
  if (!isLand && hasParking) questions.push(
    { id: "parkingCover", title: "¿El parqueo es techado?", options: [["Sí, es techado","warehouse","covered"],["No, es destechado","sun","uncovered"],["Tiene ambos tipos","panels-top-left","mixed"]] },
    { id: "parkingArea", title: "¿Cuántos metros cuadrados tiene el parqueo?", help: "Indica el área total aproximada de todos los parqueos.", input: "number", inputMode: "decimal", placeholder: "Ej. 25", area: true }
  );
  if (!isLand) questions.push(
    { id: "age", title: "¿Qué edad tiene el inmueble?", help: "Selecciona la antigüedad aproximada.", options: [["Nueva","sparkles","0"],["1 a 5 años","calendar","3"],["6 a 10 años","calendar-days","8"],["11 a 20 años","history","15"],["Más de 20 años","clock-3","25"]] }
  );
  return questions;
}

function renderTasimetro() {
  if (state.valuationStage === "mode") return renderValuationMode();
  if (state.valuationStage === "result") return renderValuationResult();
  return renderValuationQuestion();
}

function renderValuationMode() {
  screen.innerHTML = `<section class="tasimetro-screen valuation-welcome">
    <div class="tasimetro-heading">
      <span class="tool-icon"><i data-lucide="scan-line"></i></span>
      <div><p>Tasímetro Migo</p><h1>¿Qué deseas hacer?</h1><span>Te haremos una pregunta a la vez para preparar una estimación orientativa.</span></div>
    </div>
    <div class="valuation-mode-start" role="group" aria-label="Objetivo de la estimación">
      <button data-valuation-mode="seller"><span><i data-lucide="house-plus"></i></span><div><strong>Quiero tasar</strong><small>Conocer el valor estimado de una propiedad</small></div><i data-lucide="chevron-right"></i></button>
      <button data-valuation-mode="buyer"><span><i data-lucide="badge-dollar-sign"></i></span><div><strong>Quiero saber cuánto pagar</strong><small>Consultar una referencia para comprar en una zona</small></div><i data-lucide="chevron-right"></i></button>
    </div>
    <div class="valuation-disclaimer"><i data-lucide="info"></i><p>La estimación es orientativa. El valor final requiere inspección, documentos y certificación de un tasador autorizado.</p></div>
  </section>`;
  icons();
}

function renderValuationQuestion() {
  const questions = valuationQuestions();
  state.valuationStep = Math.min(state.valuationStep, questions.length - 1);
  const question = questions[state.valuationStep];
  const progress = Math.round(((state.valuationStep + 1) / questions.length) * 100);
  const stored = state.valuationAnswers[question.id] || "";
  screen.innerHTML = `<section class="tasimetro-screen valuation-question-screen">
    <div class="flow-progress"><div class="progress-meta"><span>${state.valuationMode === "seller" ? "Tasar propiedad" : "Saber cuánto pagar"}</span><span>${state.valuationStep + 1} de ${questions.length}</span></div><div class="progress-track"><span style="width:${progress}%"></span></div></div>
    <p class="question-kicker">${question.contact ? "Datos de contacto" : "Tasímetro Migo"}</p>
    <h1 class="question-title">${question.title}</h1>
    <p class="question-help">${question.help || "Selecciona una opción para continuar."}</p>
    ${question.options ? `<div class="choices valuation-choices">${question.options.map(([label, icon, value]) => `<button class="choice" data-valuation-answer="${escapeHtml(value ?? label)}"><span class="choice-icon"><i data-lucide="${icon}"></i></span><strong>${label}</strong><i data-lucide="chevron-right"></i></button>`).join("")}</div>` : `<form id="valuationQuestionForm" class="single-answer-form"><input class="text-input" id="valuationInput" type="${question.input}" inputmode="${question.inputMode || "text"}" placeholder="${question.placeholder}" value="${escapeHtml(stored)}" autocomplete="${question.id === "fullName" ? "name" : question.id === "phone" ? "tel" : question.id === "email" ? "email" : "off"}" required><button class="primary-button" type="submit">${state.valuationStep === questions.length - 1 ? "Ver mi rango orientativo" : "Continuar"}<i data-lucide="arrow-right"></i></button></form>`}
  </section>`;
  icons();
  if (question.input) document.getElementById("valuationInput")?.focus();
}

function answerValuation(value) {
  const questions = valuationQuestions();
  const question = questions[state.valuationStep];
  state.valuationAnswers[question.id] = value;
  const updatedQuestions = valuationQuestions();
  if (state.valuationStep >= updatedQuestions.length - 1) return calculateValuation();
  state.valuationStep += 1;
  renderValuationQuestion();
  window.scrollTo(0, 0);
}

function submitValuationInput() {
  const questions = valuationQuestions();
  const question = questions[state.valuationStep];
  const input = document.getElementById("valuationInput");
  const value = input.value.trim();
  if (!value) return toast("Completa la información para continuar");
  if (question.area && (Number(value) < 5 || Number(value) > 10000000)) return toast("Ingresa un área válida");
  if (question.id === "phone" && value.replace(/\D/g, "").length < 10) return toast("Ingresa un número de celular válido");
  if (question.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return toast("Ingresa un correo válido");
  answerValuation(value);
}

function calculateValuation() {
  const answers = state.valuationAnswers;
  if (!answers.fullName || !answers.phone || !answers.email) {
    state.valuationStage = "questions";
    state.valuationStep = Math.max(0, valuationQuestions().findIndex(question => question.contact && !answers[question.id]));
    renderValuationQuestion();
    return toast("Completa tus datos de contacto para ver el rango orientativo");
  }
  const zoneName = answers.zone;
  const type = answers.type;
  const zone = valuationZones[zoneName];
  const isLand = type === "Solar" || type === "Finca";
  const typeFactors = { Apartamento: 1, Casa: .88, Villa: 1.12, Solar: 1, Finca: .68 };
  const conditionFactors = { new: 1.08, good: 1, improve: .84, construction: .92 };
  const condition = answers.condition || "good";
  const rooms = Number(answers.rooms || 0);
  const parking = Number(answers.parking || 0);
  const parkingArea = Number(answers.parkingArea || 0);
  const age = Number(answers.age || 0);
  let pricePerMeter = (isLand ? zone.land : zone.built) * typeFactors[type];
  if (!isLand) pricePerMeter *= conditionFactors[condition] * Math.max(.82, 1 - age * .006) * (1 + Math.min(parking, 3) * .018) * (1 + Math.max(0, rooms - 2) * .008);
  const primaryArea = isLand ? Number(answers.lotArea) : type === "Apartamento" ? Number(answers.apartmentArea) : Number(answers.constructionArea);
  let baseValue = pricePerMeter * primaryArea;
  if (type === "Casa" || type === "Villa") baseValue += zone.land * Number(answers.lotArea) * .35;
  if (!isLand && parkingArea) {
    const parkingFactor = answers.parkingCover === "covered" ? .38 : answers.parkingCover === "mixed" ? .32 : .26;
    baseValue += zone.built * parkingArea * parkingFactor;
  }
  const midpoint = Math.round(baseValue / 10000) * 10000;
  const spread = zone.confidence === "Alta" ? .09 : .13;
  const low = Math.round(midpoint * (1 - spread) / 10000) * 10000;
  const high = Math.round(midpoint * (1 + spread) / 10000) * 10000;
  const suggested = state.valuationMode === "seller" ? Math.round(midpoint * 1.025 / 10000) * 10000 : Math.round(midpoint * .97 / 10000) * 10000;
  const areaDescription = type === "Casa" || type === "Villa"
    ? `${Number(answers.lotArea).toLocaleString("es-DO")} m² de solar · ${Number(answers.constructionArea).toLocaleString("es-DO")} m² de construcción`
    : `${primaryArea.toLocaleString("es-DO")} m²`;
  state.valuationResult = { zoneName, type, primaryArea, areaDescription, midpoint, low, high, suggested, pricePerMeter: Math.round(midpoint / primaryArea), confidence: zone.confidence, mode: state.valuationMode, email: answers.email, phone: answers.phone, fullName: answers.fullName };
  state.valuationStage = "result";
  renderValuationResult();
  window.scrollTo(0, 0);
}

function renderValuationResult() {
  const result = state.valuationResult;
  const seller = result.mode === "seller";
  screen.innerHTML = `<section class="tasimetro-screen"><section class="valuation-result" id="valuationResult">
    <div class="result-status"><i data-lucide="circle-check-big"></i><span>Estimación lista</span><small>Referencia ${result.confidence.toLowerCase()}</small></div>
    <p class="result-label">Rango orientativo de mercado</p>
    <h2>${money(result.low)} <span>a</span> ${money(result.high)}</h2>
    <p class="result-context">${result.type} · ${result.areaDescription} · ${result.zoneName}</p>
    <div class="valuation-metrics">
      <div><span>Valor central</span><strong>${money(result.midpoint)}</strong></div>
      <div><span>Referencia por m²</span><strong>${money(result.pricePerMeter)}</strong></div>
    </div>
    <div class="suggested-price"><span>${seller ? "Precio sugerido para publicar" : "Punto sugerido para negociar"}</span><strong>${money(result.suggested)}</strong><small>${seller ? "Permite un margen razonable de negociación." : "Úsalo como referencia junto con el estado legal y físico."}</small></div>
    <div class="valuation-followup" id="valuationFollowup">
      <strong>¿Cómo deseas continuar?</strong>
      <span>Elige una opción para dar el próximo paso con tu propiedad.</span>
      <button data-valuation-followup="email"><i data-lucide="mail-check"></i><div><b>Recibir la certificación por correo</b><small>Usaremos ${escapeHtml(result.email)}</small></div><i data-lucide="chevron-right"></i></button>
      <button data-valuation-followup="professional"><i data-lucide="user-round-check"></i><div><b>Evaluación por un profesional certificado</b><small>Solicitar acompañamiento especializado</small></div><i data-lucide="chevron-right"></i></button>
    </div>
    <div class="result-actions">
      <button class="secondary-button" data-recalculate><i data-lucide="rotate-ccw"></i>Realizar otra estimación</button>
    </div>
  </section><div class="valuation-disclaimer"><i data-lucide="info"></i><p><strong>Importante:</strong> este resultado es una referencia orientativa de demostración, no una tasación certificada ni una oferta de compra.</p></div></section>`;
  icons();
}

function selectValuationFollowup(type) {
  const result = state.valuationResult;
  const container = document.getElementById("valuationFollowup");
  if (!container) return;
  const byEmail = type === "email";
  container.innerHTML = `<div class="followup-confirmation"><i data-lucide="${byEmail ? "mail-check" : "badge-check"}"></i><div><strong>${byEmail ? "Solicitud de certificación registrada" : "Solicitud de evaluación profesional registrada"}</strong><span>${byEmail ? `El seguimiento se realizará a través de ${escapeHtml(result.email)}.` : `Un profesional certificado podrá contactarte al ${escapeHtml(result.phone)}.`}</span></div></div>`;
  icons();
}

function renderLogin() {
  screen.innerHTML = `<section class="login-screen">
    <div class="login-panel">
      <span class="login-icon"><i data-lucide="user-round"></i></span>
      <p class="question-kicker">Tu cuenta Migo</p>
      <h1>Continúa tus procesos</h1>
      <p>Ingresa el número de teléfono utilizado para crear tu registro.</p>
      <label for="loginPhone">Número de teléfono</label>
      <div class="phone-row"><span class="phone-prefix">+1</span><input class="phone-input" id="loginPhone" type="tel" inputmode="numeric" placeholder="809 555 0000"></div>
      <button class="primary-button" id="loginContinue">Continuar <i data-lucide="arrow-right"></i></button>
      <small><i data-lucide="shield-check"></i> En esta demostración, tus procesos se guardan únicamente en este dispositivo.</small>
    </div>
  </section>`;
  icons();
}

function startFlow(type) {
  state.flow = type;
  state.step = 0;
  state.stage = "questions";
  state.route = "flow";
  setChrome(false);
  renderFlow();
}

function questions() {
  return state.flow === "client" ? clientQuestions : propertyQuestions;
}

function renderFlow() {
  if (state.stage === "questions") return renderQuestion();
  if (state.stage === "register") return renderRegistration();
  if (state.stage === "documents") return renderDocuments();
  if (state.stage === "banks") return renderBanks();
  if (state.stage === "success") return renderSuccess();
}

function progress() {
  const q = questions();
  const stageOffset = { questions: state.step, register: q.length, documents: q.length + 1, banks: q.length + 2, success: q.length + 3 }[state.stage];
  const total = q.length + 3;
  return { current: Math.min(stageOffset + 1, total), total, percent: Math.min(100, ((stageOffset + 1) / total) * 100) };
}

function progressMarkup() {
  const p = progress();
  return `<div class="flow-progress"><div class="progress-meta"><span>Paso ${p.current} de ${p.total}</span><span>${Math.round(p.percent)}%</span></div><div class="progress-track"><span style="width:${p.percent}%"></span></div></div>`;
}

function renderQuestion() {
  const q = questions()[state.step];
  const current = state.answers[state.flow][q.id];
  const selected = Array.isArray(current) ? current : current ? [current] : [];
  screen.innerHTML = `<section class="flow-screen">${progressMarkup()}
    <p class="question-kicker">${state.flow === "client" ? "Tu perfil" : "La propiedad"}</p>
    <h1 class="question-title">${q.title}</h1>
    <p class="question-help">${q.help || "Toca una opción para continuar automáticamente."}</p>
    <div class="choices">
      ${q.options.map(([label, icon]) => `<button class="choice ${selected.includes(label) ? "selected" : ""}" data-answer="${label.replaceAll('"','&quot;')}"><span class="choice-icon"><i data-lucide="${icon}"></i></span><span><strong>${label}</strong></span><i data-lucide="${q.multi ? (selected.includes(label) ? "square-check-big" : "square") : "chevron-right"}"></i></button>`).join("")}
      ${q.manual ? `<button class="choice" data-manual><span class="choice-icon"><i data-lucide="pen-line"></i></span><span><strong>Agregar manualmente</strong><small>Escribe una respuesta diferente</small></span><i data-lucide="plus"></i></button>` : ""}
    </div>
    <div class="manual-area" id="manualArea" hidden><input class="text-input" id="manualInput" type="${q.manualType || "text"}" inputmode="${q.manualType === "number" ? "numeric" : "text"}" placeholder="${q.manualPlaceholder || "Escribe tu respuesta"}"><button class="primary-button" id="manualContinue">Continuar <i data-lucide="arrow-right"></i></button></div>
    ${q.multi ? `<div class="flow-actions"><button class="primary-button" id="multiContinue" ${selected.length ? "" : "disabled"}>Continuar <i data-lucide="arrow-right"></i></button></div>` : ""}
  </section>`;
  icons();
}

function chooseAnswer(value) {
  const q = questions()[state.step];
  if (q.multi) {
    const values = Array.isArray(state.answers[state.flow][q.id]) ? [...state.answers[state.flow][q.id]] : [];
    const index = values.indexOf(value);
    index >= 0 ? values.splice(index, 1) : values.push(value);
    state.answers[state.flow][q.id] = values;
    save();
    renderQuestion();
  } else {
    state.answers[state.flow][q.id] = value;
    save();
    setTimeout(nextQuestion, 160);
  }
}

function nextQuestion() {
  if (state.step < questions().length - 1) {
    state.step += 1;
    renderQuestion();
  } else {
    state.stage = "register";
    renderRegistration();
  }
  window.scrollTo(0, 0);
}

function renderRegistration() {
  screen.innerHTML = `<section class="flow-screen">${progressMarkup()}
    <div class="registration-card">
      <div class="registration-icon"><i data-lucide="smartphone"></i></div>
      <h2>Guarda tu progreso</h2>
      <p>Crea tu registro con tu número de teléfono para continuar con los documentos y bancos.</p>
      <div class="phone-row"><span class="phone-prefix">+1 809</span><input class="phone-input" id="phoneInput" type="tel" inputmode="numeric" maxlength="7" placeholder="000 0000" value="${state.phone[state.flow] || ""}"></div>
      <button class="primary-button coral" id="registerButton" style="width:100%;margin-top:12px">Crear mi registro <i data-lucide="arrow-right"></i></button>
      <p class="privacy-note"><i data-lucide="shield-check"></i> Esta demostración no envía SMS ni comparte el número con terceros.</p>
    </div>
  </section>`;
  icons();
}

function registerPhone() {
  const value = document.getElementById("phoneInput").value.replace(/\D/g, "");
  if (value.length < 7) return toast("Escribe un número de teléfono válido");
  state.phone[state.flow] = value;
  state.stage = "documents";
  save();
  renderDocuments();
}

function renderDocuments() {
  const uploaded = state.uploads[state.flow];
  screen.innerHTML = `<section class="flow-screen">${progressMarkup()}
    <p class="question-kicker">Documentos</p><h1 class="question-title">Completa tu expediente</h1>
    <p class="question-help">Carga fotos o PDF legibles. En esta demostración solo guardamos el nombre del archivo.</p>
    <div class="section-note"><i data-lucide="info"></i><span>No cargues documentos personales reales en este prototipo público.</span></div>
    <div class="upload-section">
      ${documents[state.flow].map(([title, help, icon], index) => `<label class="upload-item ${uploaded[index] ? "ready" : ""}"><input type="file" data-upload="${index}" accept=".pdf,.jpg,.jpeg,.png"><span class="upload-icon"><i data-lucide="${icon}"></i></span><span><strong>${title}</strong><small>${uploaded[index] || help}</small></span><span class="upload-status">${uploaded[index] ? "Agregado" : "Cargar"}</span></label>`).join("")}
      ${state.flow === "property" ? `<div class="manual-area" style="margin-top:0"><label for="exactLocation"><strong>Ubicación exacta</strong></label><input class="text-input" id="exactLocation" placeholder="Dirección, residencial y referencia" value="${state.answers.property.exactLocation || ""}"></div>` : ""}
    </div>
    <div class="flow-actions"><button class="primary-button" id="documentsContinue">Elegir bancos <i data-lucide="arrow-right"></i></button></div>
  </section>`;
  icons();
}

function handleUpload(input) {
  const file = input.files?.[0];
  if (!file) return;
  state.uploads[state.flow][input.dataset.upload] = file.name;
  save();
  renderDocuments();
  toast("Documento agregado a la demostración");
}

function continueDocuments() {
  if (state.flow === "property") {
    const location = document.getElementById("exactLocation").value.trim();
    if (!location) return toast("Agrega la ubicación exacta");
    state.answers.property.exactLocation = location;
  }
  state.stage = "banks";
  save();
  renderBanks();
}

function renderBanks() {
  const selected = state.banks[state.flow];
  screen.innerHTML = `<section class="flow-screen">${progressMarkup()}
    <p class="question-kicker">Entidades financieras</p><h1 class="question-title">¿Qué bancos deseas consultar?</h1>
    <p class="question-help">Selecciona uno o varios. Cada banco evaluaría el expediente por separado.</p>
    <div class="bank-list">${bankOptions.map(([id, name, abbr]) => `<button class="bank-card ${selected.includes(id) ? "selected" : ""}" data-bank="${id}"><span class="bank-logo">${abbr}</span><strong>${name}</strong></button>`).join("")}</div>
    <div class="flow-actions"><button class="primary-button coral" id="finishButton" ${selected.length ? "" : "disabled"}>Solicitar precalificación hipotecaria <i data-lucide="send"></i></button></div>
    <p class="home-note" style="text-align:left"><i data-lucide="shield-check"></i> Al continuar autorizas la preparación del expediente para los bancos seleccionados.</p>
  </section>`;
  icons();
}

function toggleBank(id) {
  const selected = state.banks[state.flow];
  const index = selected.indexOf(id);
  index >= 0 ? selected.splice(index, 1) : selected.push(id);
  save();
  renderBanks();
}

function finishFlow() {
  if (!state.banks[state.flow].length) return toast("Selecciona al menos un banco");
  const type = state.flow;
  const reference = `LST-${type === "client" ? "CL" : "PR"}-${String(Date.now()).slice(-6)}`;
  state.processes.unshift({ id: reference, type, banks: state.banks[type].length, date: new Date().toISOString(), status: "Expediente preparado" });
  state.stage = "success";
  save();
  renderSuccess(reference);
}

function renderSuccess(reference) {
  const latest = reference || state.processes[0]?.id || "LST-000000";
  screen.innerHTML = `<section class="success-screen">
    <div class="success-mark"><i data-lucide="check"></i></div>
    <h1>${state.flow === "client" ? "Tu precalificación hipotecaria está en camino" : "Tu propiedad ya está en proceso"}</h1>
    <p>Migo organizará la información para que pueda ser evaluada por las entidades seleccionadas.</p>
    <div class="reference"><div><span>Referencia</span><strong>${latest}</strong></div><div><span>Bancos seleccionados</span><strong>${state.banks[state.flow].length}</strong></div><div><span>Estado</span><strong>Expediente preparado</strong></div></div>
    <button class="primary-button" data-route="saved" style="width:100%">Ver mis procesos <i data-lucide="folder-check"></i></button>
    <button class="secondary-button" data-route="home" style="width:100%;margin-top:10px">Volver al inicio</button>
  </section>`;
  icons();
}

function renderMarket() {
  const filtered = state.marketFilter === "Todas" ? properties : properties.filter(item => item.type === state.marketFilter);
  screen.innerHTML = `<section class="market-screen">
    <div class="screen-title"><h1>Propiedades disponibles</h1><p>Inmuebles con información organizada para financiamiento.</p></div>
    <button class="market-tool" data-route="tasimetro"><span><i data-lucide="calculator"></i></span><div><strong>¿No sabes cuánto pagar?</strong><small>Consulta un rango orientativo por zona</small></div><i data-lucide="chevron-right"></i></button>
    <div class="filter-row">${["Todas","Apartamento","Casa","Villa","Finca","Solar"].map(filter => `<button class="filter-chip ${state.marketFilter === filter ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("")}</div>
    <div class="property-list">${filtered.map(propertyCard).join("")}</div>
  </section>`;
  icons();
}

function propertyCard(property) {
  const monthly = payment(property.price);
  const specs = property.specs || [[`${property.area} m²`,"Área"],[property.rooms,"Habitaciones"],[property.baths,"Baños"]];
  return `<article class="property-card">
    <div class="property-photo"><img src="${property.photo}" alt="${property.title}"><span class="photo-badge"><i data-lucide="badge-check"></i> Propiedad Migo</span></div>
    <div class="property-body">
      <div class="property-price"><h2>${money(property.price)}</h2><small>Precio de venta</small></div>
      <h3>${property.title}</h3><p class="property-location"><i data-lucide="map-pin"></i>${property.location}</p>
      <div class="property-specs">${specs.map(([value, label]) => `<span><strong>${value}</strong>${label}</span>`).join("")}</div>
      <div class="verification-row">${property.tags.map(tag => `<span class="verify-tag"><i data-lucide="check"></i>${tag}</span>`).join("")}</div>
      <div class="mortgage-box"><header><strong>Estimado hipotecario</strong><span>Tasa promedio 12.5%</span></header><div class="payment-value">${money(monthly)} <small>/ mes</small></div><div class="loan-summary">Inicial 20% · Financiamiento a 20 años</div></div>
      <button class="primary-button" data-property="${property.id}">Ver y calcular <i data-lucide="calculator"></i></button>
    </div>
  </article>`;
}

function renderPropertyDetail() {
  const property = properties.find(item => item.id === state.selectedProperty) || properties[0];
  screen.innerHTML = `<section class="calculator-screen">
    <div class="calculator-hero"><img src="${property.photo}" alt="${property.title}"></div>
    <h1>${property.title}</h1><div class="location">${property.location} · ${property.area} m²</div>
    <div class="detail-verifications">${property.tags.map(tag => `<div class="detail-check"><i data-lucide="badge-check"></i><div><strong>${tag}</strong><small>Información incorporada al expediente</small></div></div>`).join("")}</div>
    <div class="calc-card">
      <div class="calc-field"><div class="calc-label"><span>Inicial</span><output id="downOutput">20%</output></div><input type="range" id="downRange" min="10" max="50" value="20" step="5"></div>
      <div class="calc-field"><div class="calc-label"><span>Tasa anual estimada</span><output id="rateOutput">12.5%</output></div><input type="range" id="rateRange" min="8" max="18" value="12.5" step="0.5"></div>
      <div class="calc-field"><div class="calc-label"><span>Plazo</span><output id="yearsOutput">20 años</output></div><input type="range" id="yearsRange" min="5" max="30" value="20" step="5"></div>
      <div class="calc-result"><span>Cuota mensual estimada</span><strong id="monthlyOutput">${money(payment(property.price))}</strong><small id="financedOutput">Financiando ${money(property.price * .8)}</small></div>
    </div>
    <div class="section-note" style="margin-top:16px"><i data-lucide="info"></i><span>Estimación orientativa. La tasa y condiciones definitivas serán emitidas por cada banco.</span></div>
    <button class="primary-button coral" data-start="client" style="width:100%">Precalificarme para esta propiedad</button>
  </section>`;
  screen.dataset.propertyPrice = property.price;
  icons();
}

function updateCalculator() {
  const price = Number(screen.dataset.propertyPrice);
  const down = Number(document.getElementById("downRange").value);
  const rate = Number(document.getElementById("rateRange").value);
  const years = Number(document.getElementById("yearsRange").value);
  document.getElementById("downOutput").textContent = `${down}%`;
  document.getElementById("rateOutput").textContent = `${rate}%`;
  document.getElementById("yearsOutput").textContent = `${years} años`;
  document.getElementById("monthlyOutput").textContent = money(payment(price, down, rate, years));
  document.getElementById("financedOutput").textContent = `Financiando ${money(price * (1 - down / 100))}`;
}

function renderSaved() {
  screen.innerHTML = `<section class="saved-screen"><div class="screen-title"><h1>Mis procesos</h1><p>Expedientes creados en este dispositivo.</p></div><div class="saved-list">
    ${state.processes.length ? state.processes.map(process => `<article class="saved-card"><span class="saved-icon"><i data-lucide="${process.type === "client" ? "user-round-check" : "house-check"}"></i></span><div><h3>${process.type === "client" ? "Precalificación hipotecaria" : "Registro de propiedad"}</h3><p>${process.id} · ${process.banks} banco${process.banks === 1 ? "" : "s"}</p><span class="status">${process.status}</span></div></article>`).join("") : `<div class="empty-card"><i data-lucide="folder-open"></i><h3>Aún no tienes procesos</h3><p>Comienza una precalificación hipotecaria o registra una propiedad.</p></div>`}
  </div></section>`;
  icons();
}

function goBack() {
  if (state.route === "property-detail") return navigate("market");
  if (state.route === "services" && state.selectedService) {
    state.selectedService = null;
    return renderServices();
  }
  if (state.route === "tasimetro") {
    if (state.valuationStage === "result") {
      state.valuationStage = "questions";
      state.valuationStep = valuationQuestions().length - 1;
      return renderValuationQuestion();
    }
    if (state.valuationStage === "questions" && state.valuationStep > 0) {
      state.valuationStep -= 1;
      return renderValuationQuestion();
    }
    if (state.valuationStage === "questions") {
      state.valuationStage = "mode";
      state.valuationMode = null;
      return renderValuationMode();
    }
  }
  if (state.route === "method" && state.methodStep > 0) {
    state.methodStep -= 1;
    renderMethod();
    return window.scrollTo(0, 0);
  }
  if (state.route !== "flow") return navigate("home");
  if (state.stage === "questions") {
    if (state.step === 0) return navigate("home");
    state.step -= 1;
  } else if (state.stage === "register") {
    state.stage = "questions";
    state.step = questions().length - 1;
  } else if (state.stage === "documents") state.stage = "register";
  else if (state.stage === "banks") state.stage = "documents";
  else return navigate("home");
  renderFlow();
}

document.addEventListener("click", event => {
  const route = event.target.closest("[data-route]")?.dataset.route;
  if (route) { event.preventDefault(); return navigate(route); }
  const start = event.target.closest("[data-start]")?.dataset.start;
  if (start) return startFlow(start);
  const answer = event.target.closest("[data-answer]")?.dataset.answer;
  if (answer) return chooseAnswer(answer);
  if (event.target.closest("[data-manual]")) {
    document.getElementById("manualArea").hidden = false;
    document.getElementById("manualInput").focus();
    return;
  }
  if (event.target.closest("#manualContinue")) {
    const input = document.getElementById("manualInput");
    if (!input.value.trim()) return toast("Escribe la información para continuar");
    const q = questions()[state.step];
    if (q.multi) {
      const values = Array.isArray(state.answers[state.flow][q.id]) ? state.answers[state.flow][q.id] : [];
      values.push(input.value.trim());
      state.answers[state.flow][q.id] = values;
    } else state.answers[state.flow][q.id] = input.value.trim();
    save();
    return nextQuestion();
  }
  if (event.target.closest("#multiContinue")) return nextQuestion();
  if (event.target.closest("#registerButton")) return registerPhone();
  if (event.target.closest("#documentsContinue")) return continueDocuments();
  const bank = event.target.closest("[data-bank]")?.dataset.bank;
  if (bank) return toggleBank(bank);
  if (event.target.closest("#finishButton")) return finishFlow();
  if (event.target.closest("#loginContinue")) {
    const phone = document.getElementById("loginPhone").value.replace(/\D/g, "");
    if (phone.length < 10) return toast("Ingresa un número de teléfono válido");
    toast("Acceso de demostración verificado");
    return setTimeout(() => navigate("saved"), 500);
  }
  const filter = event.target.closest("[data-filter]")?.dataset.filter;
  if (filter) { state.marketFilter = filter; return renderMarket(); }
  const property = event.target.closest("[data-property]")?.dataset.property;
  if (property) return navigate("property-detail", { property: Number(property) });
  const service = event.target.closest("[data-service]")?.dataset.service;
  if (service) { state.selectedService = service; renderServices(); return window.scrollTo(0, 0); }
  if (event.target.closest("[data-services-back]")) { state.selectedService = null; renderServices(); return window.scrollTo(0, 0); }
  const serviceInterest = event.target.closest("[data-service-interest]")?.dataset.serviceInterest;
  if (serviceInterest) return toast("Servicio seleccionado. Próximamente podrás solicitarlo desde aquí.");
  const methodPage = event.target.closest("[data-method-page]")?.dataset.methodPage;
  if (methodPage !== undefined) { state.methodStep = Number(methodPage); renderMethod(); return window.scrollTo(0, 0); }
  if (event.target.closest("[data-method-next]")) { state.methodStep = Math.min(methodPages.length - 1, state.methodStep + 1); renderMethod(); return window.scrollTo(0, 0); }
  if (event.target.closest("[data-method-prev]")) { state.methodStep = Math.max(0, state.methodStep - 1); renderMethod(); return window.scrollTo(0, 0); }
  const valuationMode = event.target.closest("[data-valuation-mode]")?.dataset.valuationMode;
  if (valuationMode) {
    state.valuationMode = valuationMode;
    state.valuationStage = "questions";
    state.valuationStep = 0;
    state.valuationAnswers = {};
    state.valuationResult = null;
    return renderValuationQuestion();
  }
  const valuationAnswer = event.target.closest("[data-valuation-answer]")?.dataset.valuationAnswer;
  if (valuationAnswer !== undefined) return answerValuation(valuationAnswer);
  const valuationFollowup = event.target.closest("[data-valuation-followup]")?.dataset.valuationFollowup;
  if (valuationFollowup) return selectValuationFollowup(valuationFollowup);
  if (event.target.closest("[data-recalculate]")) {
    state.valuationMode = null;
    state.valuationStage = "mode";
    state.valuationStep = 0;
    state.valuationAnswers = {};
    state.valuationResult = null;
    renderValuationMode();
    return window.scrollTo(0, 0);
  }
});

document.addEventListener("change", event => {
  if (event.target.matches("[data-upload]")) handleUpload(event.target);
  if (event.target.matches("#downRange,#rateRange,#yearsRange")) updateCalculator();
});
document.addEventListener("submit", event => {
  if (!event.target.matches("#valuationQuestionForm")) return;
  event.preventDefault();
  submitValuationInput();
});
document.addEventListener("input", event => {
  if (event.target.matches("#downRange,#rateRange,#yearsRange")) updateCalculator();
});

document.getElementById("backButton").addEventListener("click", goBack);
document.getElementById("savedButton").addEventListener("click", () => navigate("saved"));

load();
navigate("home");
});
