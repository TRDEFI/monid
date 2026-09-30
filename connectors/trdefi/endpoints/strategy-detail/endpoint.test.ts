import { assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const chains = fromFileUrl(new URL("../../fixtures/", import.meta.url));

Deno.test("trdefi#api/strategy-detail happy: free — zero usage", async () => {
    const unit = await testSealedUnit("trdefi#api/strategy-detail");
    const result = await runEndpoint({
        unit,
        input: {
            queryParams: {
                hash: "0x0000000000000000000000000000000000000000000000000000000000000001",
            },
        },
        mode: "replay",
        fixture: await loadFixture(`${chains}strategy-detail-ok.json`),
    });
    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    const output = result.output as Record<string, unknown>;
    assertEquals(typeof output.data, "object");
});
