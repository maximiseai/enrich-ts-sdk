/**
 * Basic usage examples for the Enrich API TypeScript SDK.
 *
 * Run with: npx tsx examples/basic-usage.ts
 */

import { EnrichApiClient, EnrichApi, EnrichApiError, EnrichApiTimeoutError } from "../index.js";

const client = new EnrichApiClient({
  apiKey: process.env.ENRICH_API_KEY!,
  environment: "https://api.enrich.so/v1",
});

// ── Email Finder ────────────────────────────────────────────────────────

async function findEmail() {
  const result = await client.emailFinder.findEmail({
    firstName: "Emily",
    lastName: "Zhang",
    domain: "figma.com",
  });
  console.log("Email found:", result);
}

// ── Email Validation ────────────────────────────────────────────────────

async function validateEmail() {
  const result = await client.emailValidation.validateEmail({
    email: "emily@figma.com",
  });
  console.log("Validation result:", result);
}

// ── Phone Finder ────────────────────────────────────────────────────────

async function findPhone() {
  const result = await client.phoneFinder.findPhone({
    linkedinUrl: "https://linkedin.com/in/emilyzhang",
  });
  console.log("Phone found:", result);
}

// ── Reverse Email Lookup ────────────────────────────────────────────────

async function reverseLookup() {
  const result = await client.reverseEmailLookup.lookup({
    email: "emily@figma.com",
  });
  console.log("Reverse lookup:", result);
}

// ── People Search ───────────────────────────────────────────────────────

async function findEmployees() {
  const result = await client.peopleSearch.findEmployees({
    domain: "figma.com",
    limit: 5,
  });
  console.log("Employees:", result);
}

// ── Wallet Balance ──────────────────────────────────────────────────────

async function checkBalance() {
  const balance = await client.wallets.getBalance();
  console.log("Balance:", balance);
}

// ── Error Handling ──────────────────────────────────────────────────────

async function errorHandlingExample() {
  try {
    await client.emailFinder.findEmail({
      firstName: "Emily",
      lastName: "Zhang",
      domain: "figma.com",
    });
  } catch (error) {
    if (error instanceof EnrichApi.UnauthorizedError) {
      console.error("Invalid API key");
    } else if (error instanceof EnrichApi.PaymentRequiredError) {
      console.error("Insufficient credits");
    } else if (error instanceof EnrichApi.TooManyRequestsError) {
      console.error("Rate limited — slow down");
    } else if (error instanceof EnrichApiTimeoutError) {
      console.error("Request timed out");
    } else if (error instanceof EnrichApiError) {
      console.error("API error:", error.statusCode, error.body);
    } else {
      throw error;
    }
  }
}

// ── Run ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("--- Enrich API SDK Examples ---\n");

  await checkBalance();
  await findEmail();
  await validateEmail();
}

main().catch(console.error);
