import assert from "node:assert/strict";
import test from "node:test";
import {
  GA_MEASUREMENT_ID,
  gaTagSnippet,
  resolveGaMeasurementId,
} from "./google-analytics";

test("production uses the public measurement ID when the env var is unset", () => {
  assert.equal(
    resolveGaMeasurementId(undefined, "production"),
    GA_MEASUREMENT_ID,
  );
  assert.equal(GA_MEASUREMENT_ID, "G-78DELVNFMX");
});

test("unset ID does not load outside Vercel production", () => {
  assert.equal(resolveGaMeasurementId(undefined, undefined), null);
  assert.equal(resolveGaMeasurementId(undefined, "preview"), null);
  assert.equal(resolveGaMeasurementId(undefined, "development"), null);
});

test("a blank env value disables the tag, including on production", () => {
  assert.equal(resolveGaMeasurementId("", "production"), null);
  assert.equal(resolveGaMeasurementId("   ", "production"), null);
});

test("a set measurement ID is used on preview and local", () => {
  assert.equal(
    resolveGaMeasurementId("G-78DELVNFMX", "preview"),
    "G-78DELVNFMX",
  );
  assert.equal(
    resolveGaMeasurementId(" G-CUSTOM123 ", undefined),
    "G-CUSTOM123",
  );
});

test("values that are not a GA4 measurement ID are ignored", () => {
  assert.equal(resolveGaMeasurementId("UA-123456", "production"), null);
  assert.equal(resolveGaMeasurementId("G-", "production"), null);
  assert.equal(
    resolveGaMeasurementId("G-78DELVNFMX');alert(1)//", "production"),
    null,
  );
});

test("bootstrap snippet configures the measurement ID", () => {
  const snippet = gaTagSnippet("G-78DELVNFMX");
  assert.match(snippet, /window\.dataLayer = window\.dataLayer \|\| \[\];/);
  assert.match(snippet, /function gtag\(\)\{dataLayer\.push\(arguments\);\}/);
  assert.match(snippet, /gtag\('js', new Date\(\)\);/);
  assert.match(snippet, /gtag\('config', "G-78DELVNFMX"\);/);
});
