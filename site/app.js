import { normalizeDomain, registrationDate, ageInDays, dnsAnswers } from "./domain.js";

const form = document.querySelector("#lookup");
const status = document.querySelector("#status");
const results = document.querySelector("#results");

async function getJSON(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timeout); }
}

function showRecords(records) {
  const container = document.querySelector("#records");
  container.replaceChildren();
  const list = document.createElement("dl");
  for (const [type, result] of records) {
    const term = document.createElement("dt");
    term.textContent = type;
    const detail = document.createElement("dd");
    detail.textContent = result.status === "fulfilled"
      ? (dnsAnswers(result.value).join(" · ") || "No record returned")
      : "Could not load";
    list.append(term, detail);
  }
  container.append(list);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  let domain;
  try { domain = normalizeDomain(form.elements.domain.value); }
  catch (error) { status.textContent = error.message; results.hidden = true; return; }
  status.textContent = `Looking up ${domain}…`;
  results.hidden = true;
  const types = ["A", "AAAA", "MX", "NS"];
  const [rdap, ...dns] = await Promise.allSettled([
    getJSON(`https://rdap.org/domain/${encodeURIComponent(domain)}`, { Accept: "application/rdap+json" }),
    ...types.map((type) => getJSON(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, { Accept: "application/dns-json" }))
  ]);
  document.querySelector("#result-domain").textContent = domain;
  const date = rdap.status === "fulfilled" ? registrationDate(rdap.value) : null;
  document.querySelector("#registration").textContent = date ? `Registered ${date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}` : "Registration date unavailable";
  document.querySelector("#age").textContent = date ? `About ${Math.floor(ageInDays(date) / 365.25)} years old` : "";
  document.querySelector("#rdap-note").textContent = rdap.status === "rejected" ? "The registry may block browser lookups. A missing date is not evidence of risk." : "Registry dates can be incomplete or changed by transfers.";
  showRecords(types.map((type, index) => [type, dns[index]]));
  document.querySelector("#safety-link").href = `https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(domain)}`;
  results.hidden = false;
  status.textContent = "Lookup complete. Interpret these records with care.";
});
