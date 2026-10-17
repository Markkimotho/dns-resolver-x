export function normalizeDomain(input) {
  const raw = input.trim();
  if (!raw) throw new Error("Enter a domain name");
  let url;
  try { url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`); }
  catch { throw new Error("Enter a valid domain or URL"); }
  const domain = url.hostname.toLowerCase().replace(/\.$/, "");
  const labels = domain.split(".");
  if (labels.length < 2 || domain.length > 253 || labels.some((label) => label.length < 1 || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) {
    throw new Error("Enter a public domain, such as example.com");
  }
  if (url.username || url.password) throw new Error("Do not include credentials in the URL");
  return domain;
}
export function registrationDate(rdap) {
  const event = rdap?.events?.find((item) => item.eventAction === "registration");
  const date = event?.eventDate ? new Date(event.eventDate) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}
export function ageInDays(date, now = new Date()) {
  return date ? Math.max(0, Math.floor((now - date) / 86400000)) : null;
}
export function dnsAnswers(response) {
  return Array.isArray(response?.Answer) ? response.Answer.map((answer) => answer.data).filter((value) => typeof value === "string") : [];
}
