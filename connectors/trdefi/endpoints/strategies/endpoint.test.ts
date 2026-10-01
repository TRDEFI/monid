import { assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const chains = fromFileUrl(new URL("../../fixtures/", import.meta.url));

Deno.test("trdefi#api/strategies happy: free — zero usage", async () => {
    const unit = await testSealedUnit("trdefi#api/strategies");
    const result = await runEndpoint({
        unit,
        input: {
            queryParams: {
                pair: "1INCH/USDC",
                limit: 2,
            },
        },
        mode: "replay",
        fixture: await loadFixture(`${chains}strategies-ok.json`),
    });
    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    const output = result.output as Record<string, unknown>;
    const rows = output.strategies as Array<Record<string, unknown>>;
    assertEquals(Array.isArray(rows), true);
    for (const row of rows) assertEquals(row.pair, "1INCH/USDC");
});

Deno.test("trdefi#api/strategies provider error (synthetic): 503 is data, zero usage", async () => {
    const unit = await testSealedUnit("trdefi#api/strategies");
    const result = await runEndpoint({
        unit,
        input: { queryParams: { pair: ""1INCH/USDC"", limit: 2 } },
        mode: "replay",
        fixture: await loadFixture(${chains}synthetic-provider-error.json),
    });
    assertEquals(result.isProviderError, true);
    assertEquals(result.usage, { credits: {}, evidence: {} });
});
