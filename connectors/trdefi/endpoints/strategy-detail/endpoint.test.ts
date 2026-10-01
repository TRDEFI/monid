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
                hash: "0x20691ea20452e7b0b7311428ae9be4cf8ffefc890aa09a2c3bcc298198606d72",
            },
        },
        mode: "replay",
        fixture: await loadFixture(`${chains}strategy-detail-ok.json`),
    });
    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    const output = result.output as Record<string, unknown>;
    const data = output.data as Record<string, unknown>;
    assertEquals(data.strategy_hash, "0x20691ea20452e7b0b7311428ae9be4cf8ffefc890aa09a2c3bcc298198606d72");
});

Deno.test("trdefi#api/strategy-detail provider error (synthetic): 503 is data, zero usage", async () => {
    const unit = await testSealedUnit("trdefi#api/strategy-detail");
    const result = await runEndpoint({
        unit,
        input: { queryParams: { hash: ""0x20691ea20452e7b0b7311428ae9be4cf8ffefc890aa09a2c3bcc298198606d72"" } },
        mode: "replay",
        fixture: await loadFixture(${chains}synthetic-provider-error.json),
    });
    assertEquals(result.isProviderError, true);
    assertEquals(result.usage, { credits: {}, evidence: {} });
});
