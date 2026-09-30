import { assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const chains = fromFileUrl(new URL("../../fixtures/", import.meta.url));

Deno.test("trdefi#api/quote happy: free — zero usage", async () => {
    const unit = await testSealedUnit("trdefi#api/quote");
    const result = await runEndpoint({
        unit,
        input: {
            queryParams: {
                hash: "0x0000000000000000000000000000000000000000000000000000000000000001",
                chain: "ethereum",
                amount: "1000000",
                direction: "aToB",
            },
        },
        mode: "replay",
        fixture: await loadFixture(`${chains}quote-ok.json`),
    });
    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    const output = result.output as Record<string, unknown>;
    assertEquals(typeof output.data, "object");
});

Deno.test("trdefi#api/quote provider error (synthetic): 503 is data, zero usage", async () => {
    const unit = await testSealedUnit("trdefi#api/quote");
    const result = await runEndpoint({
        unit,
        input: {
            queryParams: {
                hash: "0x0000000000000000000000000000000000000000000000000000000000000001",
                amount: "1000000",
            },
        },
        mode: "replay",
        fixture: await loadFixture(`${chains}provider-error.json`),
    });
    assertEquals(result.isProviderError, true);
    assertEquals(result.usage, { credits: {}, evidence: {} });
});
