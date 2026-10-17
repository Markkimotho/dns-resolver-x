import test from "node:test";
import assert from "node:assert/strict";
import { normalizeDomain, registrationDate, ageInDays, dnsAnswers } from "../site/domain.js";
test("normalizes a URL to a domain", () => assert.equal(normalizeDomain("https://www.Example.com/path"), "www.example.com"));
test("rejects private or malformed targets", () => {
  assert.throws(() => normalizeDomain("localhost"));
  assert.throws(() => normalizeDomain("https://user:pass@example.com"));
  assert.throws(() => normalizeDomain("bad..example.com"));
});
test("reads registration event without claiming trust", () => {
  const date = registrationDate({ events: [{ eventAction: "registration", eventDate: "2024-01-01T00:00:00Z" }] });
  assert.equal(ageInDays(date, new Date("2024-01-11T00:00:00Z")), 10);
  assert.equal(registrationDate({ events: [] }), null);
});
test("reads DNS answers", () => assert.deepEqual(dnsAnswers({ Answer: [{ data: "1.2.3.4" }] }), ["1.2.3.4"]));
