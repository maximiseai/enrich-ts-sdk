# Enrich API TypeScript SDK

The official TypeScript SDK for the [Enrich API](https://enrich.so) — find emails, phone numbers, validate emails, discover leads, and more.

## Installation

```bash
npm install enrich-ts-sdk
```

## Quick Start

```typescript
import { EnrichApiClient } from "enrich-ts-sdk";

const client = new EnrichApiClient({
  apiKey: "YOUR_API_KEY",
  environment: "https://api.enrich.so/v1",
});

const result = await client.emailFinder.findEmail({
  firstName: "Emily",
  lastName: "Zhang",
  domain: "figma.com",
});

console.log(result);
```

## Authentication

All API requests require an API key passed via the `x-api-key` header. The SDK handles this automatically — just provide your key when creating the client:

```typescript
const client = new EnrichApiClient({
  apiKey: "YOUR_API_KEY",
  environment: "https://api.enrich.so/v1",
});
```

You can also provide the API key lazily via a supplier function:

```typescript
const client = new EnrichApiClient({
  apiKey: () => process.env.ENRICH_API_KEY!,
  environment: "https://api.enrich.so/v1",
});
```

## Credit Costs

Every API call costs credits. You're **not charged** when a lookup fails (e.g. email not found).

| API | Method | Cost |
|---|---|---|
| Email Finder | `findEmail` | 10 credits |
| Email Finder | `batchFindEmails` | 10 credits/lead |
| Email Finder | `getEmailFinderBatchStatus` | Free |
| Email Finder | `getEmailFinderBatchResults` | Free |
| Email Validation | `validateEmail` | 5 credits |
| Email Validation | `batchValidateEmails` | 5 credits/email |
| Email Validation | `getEmailValidationBatchStatus` | Free |
| Email Validation | `getEmailValidationBatchResults` | Free |
| Phone Finder | `phoneLookup` | 50 credits |
| Phone Finder | `createPhoneBulkJob` | 50 credits/lead |
| Phone Finder | `getPhoneBulkJobStatus` | Free |
| Phone Finder | `getPhoneBulkJobResults` | Free |
| Reverse Email Lookup | `reverseLookup` | 10 credits |
| Reverse Email Lookup | `bulkReverseLookup` | 10 credits/email |
| Reverse Email Lookup | `getBulkLookupStatus` | Free |
| Reverse Email Lookup | `getBulkLookupResults` | Free |
| Lead Finder | `searchLeads` | Free (preview) |
| Lead Finder | `countLeads` | Free |
| Lead Finder | `revealLeads` | Credits per lead |
| Lead Finder | `enrichLeads` | Credits per lead |
| Lead Finder | `unlockNames` | Credits per lead |
| Lead Finder | `exportLeads` | Credits per lead |
| Lead Finder | `getFilterOptions` | Free |
| Lead Finder | `suggestCompanyNames` | Free |
| Lead Finder | `listSavedSearches` | Free |
| Lead Finder | `createSavedSearch` | Free |
| Lead Finder | `deleteSavedSearch` | Free |
| People Search | `employeeFinder` | Credits per result |
| People Search | `waterfallIcpSearch` | Credits per result |
| Company Followers | `startCompanyFollowerScrape` | Credits per follower |
| Company Followers | `startCountEstimate` | Free |
| Company Followers | `checkCompanyFollowerLimit` | Free |
| Company Followers | All status/results/export | Free |
| Teams | All methods | Free |
| Wallets | All methods | Free |

Check your balance anytime with `client.wallets.getWalletBalance()`.

## API Reference

### Email Finder

Find professional email addresses given a person's name and company domain.

```typescript
// Single lookup (10 credits, free if not found)
const email = await client.emailFinder.findEmail({
  firstName: "Emily",
  lastName: "Zhang",
  domain: "figma.com",
});

// Batch lookup (up to 500,000 leads)
const batch = await client.emailFinder.batchFindEmails({
  leads: [
    { firstName: "Emily", lastName: "Zhang", domain: "figma.com" },
    { firstName: "David", lastName: "Kim", domain: "vercel.com" },
  ],
  webhookUrl: "https://api.yourapp.com/webhooks/enrich",
});

// Check batch status
const status = await client.emailFinder.getEmailFinderBatchStatus({
  batchId: batch.data.id,
});

// Get batch results (paginated)
const results = await client.emailFinder.getEmailFinderBatchResults({
  batchId: batch.data.id,
  page: 1,
  limit: 50,
});
```

### Email Validation

Validate email addresses for deliverability.

```typescript
// Single validation
const validation = await client.emailValidation.validateEmail({
  email: "emily@figma.com",
});

// Batch validation
const batch = await client.emailValidation.batchValidateEmails({
  emails: ["emily@figma.com", "david@vercel.com"],
  webhookUrl: "https://api.yourapp.com/webhooks/validate",
});

// Check batch status
const status = await client.emailValidation.getEmailValidationBatchStatus({
  batchId: batch.data.id,
});

// Get batch results
const results = await client.emailValidation.getEmailValidationBatchResults({
  batchId: batch.data.id,
});
```

### Phone Finder

Find phone numbers for professionals.

```typescript
// Single lookup
const phone = await client.phoneFinder.findPhone({
  linkedinUrl: "https://linkedin.com/in/emilyzhang",
});

// Batch lookup
const batch = await client.phoneFinder.batchFindPhones({
  leads: [{ linkedinUrl: "https://linkedin.com/in/emilyzhang" }],
});

// Check status & get results
const status = await client.phoneFinder.getPhoneBulkJobStatus({
  jobId: batch.data.id,
});

const results = await client.phoneFinder.getPhoneBulkJobResults({
  jobId: batch.data.id,
});
```

### Reverse Email Lookup

Look up a person's profile using their email address.

```typescript
// Single lookup
const profile = await client.reverseEmailLookup.lookup({
  email: "emily@figma.com",
});

// Bulk lookup
const bulk = await client.reverseEmailLookup.bulkLookup({
  emails: ["emily@figma.com", "david@vercel.com"],
});

// Check status & get results
const status = await client.reverseEmailLookup.getBulkLookupStatus({
  batchId: bulk.data.id,
});

const results = await client.reverseEmailLookup.getBulkLookupResults({
  batchId: bulk.data.id,
});
```

### Lead Finder

Search and discover leads based on filters.

```typescript
// Search leads
const leads = await client.leadFinder.searchLeads({
  filters: { jobTitle: "CTO", companySize: "51-200" },
  page: 1,
  limit: 25,
});

// Get lead count
const count = await client.leadFinder.getLeadCount({
  filters: { jobTitle: "CTO", companySize: "51-200" },
});

// Reveal lead contact details
const revealed = await client.leadFinder.revealLeads({
  leadIds: ["lead_123", "lead_456"],
});

// Enrich leads
const enriched = await client.leadFinder.enrichLeads({
  leadIds: ["lead_123"],
});

// Save a search
const saved = await client.leadFinder.createSavedSearch({
  name: "CTO at mid-size companies",
  filters: { jobTitle: "CTO", companySize: "51-200" },
});

// List saved searches
const searches = await client.leadFinder.listSavedSearches();

// Delete a saved search
await client.leadFinder.deleteSavedSearch({ searchId: "search_123" });

// Suggest company names
const suggestions = await client.leadFinder.suggestCompanyNames({
  query: "Goo",
});

// Unlock names
const unlocked = await client.leadFinder.unlockNames({
  leadIds: ["lead_123"],
});

// Export leads
const exported = await client.leadFinder.exportLeads({
  filters: { jobTitle: "CTO" },
});

// Get filter options
const options = await client.leadFinder.getFilterOptions();
```

### People Search

Find employees at specific companies.

```typescript
// Find employees
const employees = await client.peopleSearch.findEmployees({
  domain: "figma.com",
  limit: 10,
});

// Waterfall ICP search
const icpResults = await client.peopleSearch.waterfallIcpSearch({
  domain: "figma.com",
  jobTitles: ["CTO", "VP Engineering"],
});
```

### Company Followers

Get followers of a company.

```typescript
// Start a company follower job
const job = await client.companyFollowers.startCompanyFollowerJob({
  companyUrl: "https://linkedin.com/company/figma",
});

// Check progress
const progress = await client.companyFollowers.getCompanyFollowerProgress({
  jobId: job.data.id,
});

// Get results
const followers = await client.companyFollowers.getCompanyFollowerResults({
  jobId: job.data.id,
  page: 1,
  limit: 50,
});

// Start count estimate
const estimate = await client.companyFollowers.startCountEstimate({
  companyUrl: "https://linkedin.com/company/figma",
});

// Check count estimate status
const estimateStatus = await client.companyFollowers.getCountEstimateStatus({
  jobId: estimate.data.id,
});

// Check limits
const limit = await client.companyFollowers.checkCompanyFollowerLimit();

// Export as CSV
const csv = await client.companyFollowers.exportCompanyFollowerCsv({
  jobId: job.data.id,
});
```

### Teams

Manage team members and invitations.

```typescript
// List team members
const members = await client.teams.listTeamMembers({
  page: 1,
  limit: 20,
});

// Invite a member
const invitation = await client.teams.invite({
  email: "newmember@company.com",
  role: "member",
});

// List invitations
const invitations = await client.teams.listTeamInvitations({
  page: 1,
  limit: 20,
});

// Cancel invitation
await client.teams.cancelInvitation({ invitationId: "inv_123" });
```

### Wallets

Check credit balance and transaction history.

```typescript
// Get wallet balance
const balance = await client.wallets.getBalance();

// Get transaction history
const transactions = await client.wallets.getWalletTransactions({
  page: 1,
  limit: 50,
});
```

## Configuration

### Timeouts

```typescript
const client = new EnrichApiClient({
  apiKey: "YOUR_API_KEY",
  environment: "https://api.enrich.so/v1",
  timeoutInSeconds: 30, // Default: 60
});

// Per-request timeout
const result = await client.emailFinder.findEmail(
  { firstName: "Emily", lastName: "Zhang", domain: "figma.com" },
  { timeoutInSeconds: 10 },
);
```

### Retries

Requests are retried up to 2 times by default on failure:

```typescript
const client = new EnrichApiClient({
  apiKey: "YOUR_API_KEY",
  environment: "https://api.enrich.so/v1",
  maxRetries: 5, // Default: 2
});

// Per-request retries
const result = await client.emailFinder.findEmail(
  { firstName: "Emily", lastName: "Zhang", domain: "figma.com" },
  { maxRetries: 0 }, // No retries
);
```

### Abort Requests

```typescript
const controller = new AbortController();

const result = client.emailFinder.findEmail(
  { firstName: "Emily", lastName: "Zhang", domain: "figma.com" },
  { abortSignal: controller.signal },
);

// Cancel the request
controller.abort();
```

### Logging

```typescript
const client = new EnrichApiClient({
  apiKey: "YOUR_API_KEY",
  environment: "https://api.enrich.so/v1",
  logging: {
    level: "debug",
    silent: false,
  },
});
```

### Custom Fetch

```typescript
import fetch from "node-fetch";

const client = new EnrichApiClient({
  apiKey: "YOUR_API_KEY",
  environment: "https://api.enrich.so/v1",
  fetch: fetch as unknown as typeof globalThis.fetch,
});
```

### Raw Response Access

Every method returns an `HttpResponsePromise` that provides access to the raw response:

```typescript
const response = await client.emailFinder.findEmail({
  firstName: "Emily",
  lastName: "Zhang",
  domain: "figma.com",
});

// Access parsed data
console.log(response);

// Access raw response
const { data, rawResponse } = await client.emailFinder
  .findEmail({
    firstName: "Emily",
    lastName: "Zhang",
    domain: "figma.com",
  })
  .withRawResponse();

console.log(rawResponse.status); // 200
console.log(rawResponse.headers);
```

## Error Handling

The SDK throws typed errors for different HTTP status codes:

```typescript
import {
  EnrichApiClient,
  EnrichApiError,
  EnrichApiTimeoutError,
  EnrichApi,
} from "enrich-ts-sdk";

try {
  const result = await client.emailFinder.findEmail({
    firstName: "Emily",
    lastName: "Zhang",
    domain: "figma.com",
  });
} catch (error) {
  if (error instanceof EnrichApi.BadRequestError) {
    // 400 — invalid request parameters
    console.error("Bad request:", error.body);
  } else if (error instanceof EnrichApi.UnauthorizedError) {
    // 401 — invalid or missing API key
    console.error("Unauthorized:", error.body);
  } else if (error instanceof EnrichApi.PaymentRequiredError) {
    // 402 — insufficient credits
    console.error("Insufficient credits:", error.body);
  } else if (error instanceof EnrichApi.TooManyRequestsError) {
    // 429 — rate limit exceeded
    console.error("Rate limited:", error.body);
  } else if (error instanceof EnrichApi.InternalServerError) {
    // 500 — server error
    console.error("Server error:", error.body);
  } else if (error instanceof EnrichApiTimeoutError) {
    // Request timed out
    console.error("Request timed out");
  } else if (error instanceof EnrichApiError) {
    // Other API errors
    console.error("API error:", error.statusCode, error.body);
  }
}
```

## Runtime Support

This SDK works across multiple JavaScript runtimes:

- Node.js 18+
- Deno
- Bun
- Cloudflare Workers
- Browsers (with bundler)
- Vercel Edge Runtime

## License

MIT
