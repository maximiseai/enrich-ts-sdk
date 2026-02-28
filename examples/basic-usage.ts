/**
 * Basic usage examples for the Enrich API TypeScript SDK.
 * Run with: npx tsx examples/basic-usage.ts
 */

import { EnrichApiClient, EnrichApi, EnrichApiError, EnrichApiTimeoutError } from "../index.js";

const client = new EnrichApiClient({
  apiKey: "YOUR_API_KEY",
  environment: "https://api.enrich.so/v3",
});


async function findEmail() {
  const result = await client.emailFinder.findEmail({
    firstName: "Emily",
    lastName: "Zhang",
    domain: "figma.com",
  });
  console.log("Email found:", result);
}


async function validateEmail() {
  const result = await client.emailValidation.validateEmail({
    email: "emily@figma.com",
  });
  console.log("Validation result:", result);
}


async function findPhone() {
  const result = await client.phoneFinder.phoneLookup({
    linkedin: "https://linkedin.com/in/emilyzhang",
  });
  console.log("Phone found:", result);
}


async function reverseLookup() {
  const result = await client.reverseEmailLookup.reverseLookup({
    email: "emily@figma.com",
  });
  console.log("Reverse lookup:", result);
}


async function findEmployees() {
  const result = await client.peopleSearch.employeeFinder({
    company_linkedin_url: "https://linkedin.com/company/figma",
  });
  console.log("Employees:", result);
}


async function checkBalance() {
  const balance = await client.wallets.getWalletBalance();
  console.log("Balance:", balance);
}


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


async function main() {
  await checkBalance();
  await findEmail();
  await validateEmail();
}

main().catch(console.error);
