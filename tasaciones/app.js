document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "18294977679";
  const API_BASE = window.location.hostname.endsWith("github.io") ? "https://migo-tasaciones.infes-edu.chatgpt.site" : "";
  if (!document.getElementById("request-flow")) {
    document.body.insertAdjacentHTML("beforeend", `<section id="request-flow" class="request-flow" aria-label="Solicitud de tasación" hidden>
      <div class="flow-shell">
        <div class="flow-topbar">
          <button type="button" class="icon-button" id="flow-back" aria-label="Volver"><i data-lucide="arrow-left"></i></button>
          <img src="./assets/migo-logo-blue.png" alt="Migo">
          <button type="button" class="icon-button" id="flow-close" aria-label="Cerrar solicitud"><i data-lucide="x"></i></button>
        </div>
        <div class="progress-label"><span id="progress-text"></span><span>Solicitud de tasación</span></div>
        <div class="progress-track"><span id="progress-bar"></span></div>
        <div id="flow-content" class="flow-content" aria-live="polite"></div>
      </div>
    </section>`);
  }
  const flow = document.getElementById("request-flow");
  const content = document.getElementById("flow-content");
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress-bar");
  const backButton = document.getElementById("flow-back");
  const state = { step: 0, answers: {}, contact: { name: "", phone: "" }, associate: null, leadId: "" };
  const referralCode = new URLSearchParams(window.location.search).get("ref");
  if (referralCode) {
    fetch(`${API_BASE}/api/referral?code=${encodeURIComponent(referralCode)}`)
      .then(response => response.json())
      .then(data => {
        if (!data.associate) return;
        state.associate = data.associate;
        const banner = document.createElement("div");
        banner.className = "referral-banner";
        banner.textContent = `Te acompaña ${data.associate.name}, inspector asociado de Migo`;
        document.querySelector(".hero-inner")?.appendChild(banner);
      }).catch(() => {});
  }

  const buildingTypes = ["Casa", "Villa", "Apartamento", "Local comercial", "Edificio", "Otro"];
  const landTypes = ["Casa", "Villa", "Solar", "Finca", "Otro"];
  const knownTypes = [...new Set([...buildingTypes, ...landTypes])];
  const type = () => state.answers.type;
  const customType = () => Boolean(type() && !knownTypes.includes(type()));
  const questions = [
    { id: "type", label: "Tipo de inmueble", title: "¿Qué tipo de propiedad deseas tasar?", options: [["Casa", "house"], ["Apartamento", "building-2"], ["Villa", "house-plus"], ["Solar", "map"], ["Finca", "trees"], ["Local comercial", "store"], ["Edificio", "building"]], manual: true, placeholder: "Describe el tipo de inmueble" },
    { id: "purpose", label: "Finalidad", title: "¿Para qué necesitas la tasación?", options: [["Venta", "badge-dollar-sign"], ["Compra", "key-round"], ["Préstamo hipotecario", "landmark"], ["Herencia o partición", "files"], ["Conocimiento patrimonial", "scale"]], manual: true, placeholder: "Otra finalidad" },
    { id: "location", label: "Ubicación", title: "¿En qué ciudad o zona está ubicada?", options: [["Distrito Nacional", "map-pin"], ["Santo Domingo Este", "map-pin"], ["Santo Domingo Norte", "map-pin"], ["Santo Domingo Oeste", "map-pin"], ["Santiago", "map-pin"], ["Punta Cana / Bávaro", "map-pin"]], manual: true, placeholder: "Ciudad, municipio o provincia" },
    { id: "address", label: "Sector o dirección", title: "¿Conoces el sector o la dirección?", help: "Puedes escribir una referencia; no necesitas indicar la dirección exacta ahora.", inputOnly: true, placeholder: "Sector, calle o referencia" },
    { id: "landArea", label: "Terreno", title: "¿Cuántos metros cuadrados tiene el terreno?", help: "Para casas, villas, solares y fincas.", when: () => !type() || landTypes.includes(type()) || customType(), options: [["Hasta 200 m²", "ruler"], ["201 a 500 m²", "ruler"], ["501 a 1,000 m²", "ruler"], ["Más de 1,000 m²", "ruler"]], manual: true, numeric: true, suffix: "m²", placeholder: "Metros cuadrados del terreno" },
    { id: "builtArea", label: "Construcción", title: "¿Cuántos metros cuadrados tiene la construcción?", help: "En apartamentos, indica únicamente el área del apartamento.", when: () => !type() || buildingTypes.includes(type()) || customType(), options: [["Hasta 80 m²", "ruler"], ["81 a 150 m²", "ruler"], ["151 a 250 m²", "ruler"], ["Más de 250 m²", "ruler"]], manual: true, numeric: true, suffix: "m²", placeholder: "Metros cuadrados de construcción" },
    { id: "age", label: "Antigüedad", title: "¿Qué antigüedad tiene el inmueble?", when: () => !type() || buildingTypes.includes(type()) || customType(), options: [["A estrenar", "sparkles"], ["1 a 5 años", "calendar"], ["6 a 15 años", "calendar"], ["Más de 15 años", "calendar"]], manual: true, placeholder: "Años aproximados" },
    { id: "condition", label: "Estado", title: "¿En qué estado se encuentra?", when: () => !type() || buildingTypes.includes(type()) || customType(), options: [["Excelente", "badge-check"], ["Bueno", "house-check"], ["Necesita mejoras", "hammer"], ["En construcción", "hard-hat"]], manual: true, placeholder: "Describe brevemente su estado" },
    { id: "parking", label: "Parqueos", title: "¿Cómo son los parqueos?", when: () => !type() || buildingTypes.includes(type()) || customType(), options: [["No tiene", "circle-minus"], ["Uno techado", "car-front"], ["Uno destechado", "car"], ["Dos o más techados", "parking-square"], ["Dos o más destechados", "parking-square"]], manual: true, placeholder: "Cantidad y tipo de parqueo" },
    { id: "parkingArea", label: "Área de parqueo", title: "¿Cuántos m² tienen los parqueos?", help: "Si conoces el área total, compártela aquí.", when: () => Boolean(state.answers.parking && state.answers.parking !== "No tiene"), inputOnly: true, numeric: true, suffix: "m²", placeholder: "Área total aproximada" },
    { id: "bank", label: "Entidad financiera", title: "¿La tasación es para alguna entidad financiera?", options: [["Banreservas", "landmark"], ["Banco Popular", "landmark"], ["Banco BHD", "landmark"], ["Asociación Popular de Ahorros y Préstamos", "landmark"], ["Aún no lo sé", "circle-help"]], manual: true, placeholder: "Otra entidad" }
  ];

  function visibleQuestions() { return questions.filter(question => !question.when || question.when()); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
  function icons() { if (window.lucide) window.lucide.createIcons(); }

  function start() {
    state.step = 0;
    state.answers = {};
    state.contact = { name: "", phone: "" };
    state.leadId = "";
    flow.hidden = false;
    document.body.style.overflow = "hidden";
    render();
  }

  function close() {
    flow.hidden = true;
    document.body.style.overflow = "";
  }

  function render() {
    const visible = visibleQuestions();
    const isContact = state.step >= visible.length;
    progressText.textContent = `Paso ${Math.min(state.step + 1, visible.length + 1)} de ${visible.length + 1}`;
    progressBar.style.width = `${(Math.min(state.step + 1, visible.length + 1) / (visible.length + 1)) * 100}%`;
    backButton.setAttribute("aria-label", state.step === 0 ? "Cerrar solicitud" : "Pregunta anterior");
    content.innerHTML = isContact ? contactMarkup() : questionMarkup(visible[state.step]);
    flow.scrollTop = 0;
    icons();
    const heading = content.querySelector("h2");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  function questionMarkup(question) {
    const options = (question.options || []).map(([label, icon]) => `<button type="button" class="choice-button" data-answer="${escapeHtml(label)}"><i data-lucide="${icon}"></i><span>${escapeHtml(label)}</span></button>`).join("");
    const manual = question.inputOnly ? inputMarkup(question) : question.manual ? `<button type="button" class="manual-trigger" id="manual-trigger"><i data-lucide="pencil"></i> Escribir mi respuesta</button><div id="manual-container" hidden>${inputMarkup(question)}</div>` : "";
    return `<p class="eyebrow">${escapeHtml(question.label)}</p><h2>${escapeHtml(question.title)}</h2>${question.help ? `<p class="flow-help">${escapeHtml(question.help)}</p>` : `<p class="flow-help">Selecciona una opción o continúa sin este dato.</p>`}${options ? `<div class="choice-grid">${options}</div>` : ""}${manual}<div class="flow-actions"><button type="button" class="skip-button" id="skip-question">Continuar sin responder</button>${question.inputOnly ? `<button type="button" class="primary-button" id="save-manual">Continuar <i data-lucide="arrow-right"></i></button>` : ""}</div><p class="flow-error" id="flow-error" role="alert"></p>`;
  }

  function inputMarkup(question) {
    return `<div class="manual-box"><label class="field-label" for="manual-answer">Tu respuesta</label><input class="text-field" id="manual-answer" type="${question.numeric ? "number" : "text"}" ${question.numeric ? 'min="0" step="any" inputmode="decimal"' : ""} placeholder="${escapeHtml(question.placeholder || "Escribe aquí")}" autocomplete="off">${question.numeric ? `<span class="field-hint">La medida se registrará en ${question.suffix}.</span>` : ""}${question.inputOnly ? "" : `<div class="flow-actions"><button type="button" class="primary-button" id="save-manual">Continuar <i data-lucide="arrow-right"></i></button></div>`}</div>`;
  }

  function contactMarkup() {
    return `<p class="eyebrow">Último paso</p><h2>¿Cómo podemos contactarte?</h2><p class="flow-help">Prepararemos un mensaje con los datos que compartiste para enviarlo por WhatsApp.</p><form id="contact-form" novalidate><div class="contact-fields"><div class="field-group"><label class="field-label" for="contact-name">Nombre completo</label><input class="text-field" id="contact-name" name="name" autocomplete="name" maxlength="100" value="${escapeHtml(state.contact.name)}" required></div><div class="field-group"><label class="field-label" for="contact-phone">Número de celular</label><input class="text-field" id="contact-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="809 000 0000" maxlength="24" value="${escapeHtml(state.contact.phone)}" required></div></div><label class="contact-consent"><input id="contact-consent" type="checkbox"> Autorizo a Migo y Tasalo a guardar estos datos y contactarme sobre esta solicitud.</label><p class="flow-error" id="flow-error" role="alert"></p><div class="flow-actions"><button type="submit" class="primary-button">Continuar a WhatsApp <i data-lucide="arrow-up-right"></i></button></div><p class="privacy-note">Guardaremos tu solicitud en el portal. WhatsApp abrirá el mensaje preparado; revísalo y pulsa enviar para compartirlo. No se envía automáticamente.</p></form>`;
  }

  function next(answer) {
    const question = visibleQuestions()[state.step];
    if (!question) return;
    if (answer) state.answers[question.id] = answer;
    else delete state.answers[question.id];
    if (question.id === "type") {
      for (const id of ["landArea", "builtArea", "age", "condition", "parking", "parkingArea"]) delete state.answers[id];
    }
    if (question.id === "parking" && answer === "No tiene") delete state.answers.parkingArea;
    state.step += 1;
    render();
  }

  function saveManual() {
    const question = visibleQuestions()[state.step];
    const input = document.getElementById("manual-answer");
    const value = input.value.trim();
    if (!value) { document.getElementById("flow-error").textContent = "Escribe una respuesta o continúa sin este dato."; input.focus(); return; }
    if (question.numeric && (!Number.isFinite(Number(value)) || Number(value) <= 0)) { document.getElementById("flow-error").textContent = "Escribe una medida mayor que cero."; input.focus(); return; }
    next(question.numeric ? `${value} ${question.suffix}` : value);
  }

  function message() {
    const lines = ["Hola, Migo. Quiero solicitar una tasación.", "", `Nombre: ${state.contact.name}`, `Celular: ${state.contact.phone}`];
    if (state.leadId) lines.push(`Solicitud: ${state.leadId}`);
    if (state.associate) lines.push(`Asociado que me refirió: ${state.associate.name} (${state.associate.code})`);
    const shared = questions.filter(question => state.answers[question.id]);
    if (shared.length) {
      lines.push("", "Datos del inmueble:");
      for (const question of shared) lines.push(`• ${question.label}: ${state.answers[question.id]}`);
    } else {
      lines.push("", "Prefiero compartir los datos del inmueble por WhatsApp.");
    }
    lines.push("", "Por favor, indíquenme los próximos pasos y el costo del servicio.");
    return lines.join("\n");
  }

  async function submitContact(event) {
    event.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();
    const digits = phone.replace(/\D/g, "");
    const error = document.getElementById("flow-error");
    if (name.length < 2) { error.textContent = "Escribe tu nombre para continuar."; document.getElementById("contact-name").focus(); return; }
    if (digits.length < 10 || digits.length > 15) { error.textContent = "Escribe un número de celular válido."; document.getElementById("contact-phone").focus(); return; }
    if (!document.getElementById("contact-consent").checked) { error.textContent = "Confirma que podemos guardar tu solicitud y contactarte."; document.getElementById("contact-consent").focus(); return; }
    state.contact = { name, phone };
    const submit = event.target.querySelector('button[type="submit"]');
    submit.disabled = true;
    error.textContent = "Registrando tu solicitud...";
    try {
      const response = await fetch(`${API_BASE}/api/referral`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, answers: state.answers, code: state.associate?.code || referralCode || "" }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo registrar la solicitud");
      state.leadId = data.id;
      state.associate = data.associate;
    } catch (failure) {
      error.textContent = "No pudimos guardar la solicitud. Revisa tu conexión e inténtalo de nuevo.";
      submit.disabled = false;
      return;
    }
    const recipient = WHATSAPP_NUMBER.replace(/\D/g, "");
    const url = recipient ? `https://wa.me/${recipient}?text=${encodeURIComponent(message())}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(message())}`;
    window.location.assign(url);
  }

  document.querySelectorAll("[data-start]").forEach(button => button.addEventListener("click", start));
  document.getElementById("flow-close").addEventListener("click", close);
  backButton.addEventListener("click", () => { if (state.step === 0) close(); else { state.step -= 1; render(); } });
  content.addEventListener("click", event => {
    const choice = event.target.closest("[data-answer]");
    if (choice) { next(choice.dataset.answer); return; }
    if (event.target.closest("#skip-question")) { next(""); return; }
    if (event.target.closest("#manual-trigger")) {
      event.target.closest("#manual-trigger").hidden = true;
      document.getElementById("manual-container").hidden = false;
      document.getElementById("manual-answer").focus();
      icons();
      return;
    }
    if (event.target.closest("#save-manual")) saveManual();
  });
  content.addEventListener("keydown", event => { if (event.key === "Enter" && event.target.id === "manual-answer") { event.preventDefault(); saveManual(); } });
  content.addEventListener("submit", event => { if (event.target.id === "contact-form") submitContact(event); });
  icons();
});
