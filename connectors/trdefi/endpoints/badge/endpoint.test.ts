import { assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const chains = fromFileUrl(new URL("../../fixtures/", import.meta.url));

Deno.test("trdefi#api/badge happy: free — zero usage", async () => {
    const unit = await testSealedUnit("trdefi#api/badge");
    const result = await runEndpoint({
        unit,
        input: { queryParams: { metric: "volume30" } },
        mode: "replay",
        fixture: await loadFixture(`${chains}badge-ok.json`),
    });
    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    const output = result.output as Record<string, unknown>;
    assertEquals(output.schemaVersion, 1);
});
