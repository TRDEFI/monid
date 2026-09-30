import { assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const chains = fromFileUrl(new URL("../../fixtures/", import.meta.url));

Deno.test("trdefi#api/chains happy: free — zero usage", async () => {
    const unit = await testSealedUnit("trdefi#api/chains");
    const result = await runEndpoint({
        unit,
        input: { queryParams: {} },
        mode: "replay",
        fixture: await loadFixture(`${chains}chains-ok.json`),
    });
    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    const output = result.output as Record<string, unknown>;
    assertEquals(Array.isArray(output.chains), true);
});
