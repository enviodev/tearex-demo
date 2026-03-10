import assert from "assert";
import { TestHelpers } from "generated";
const { MockDb, TradingCore, MarketNFT, Addresses } = TestHelpers;

describe("Tea-REX Events", () => {
  it("OpenPosition sets an OpenPosition entity", async () => {
    const mockDbEmpty = MockDb.createMockDb();
    const marketAddress = Addresses.mockAddresses[0];

    const mockOpenPosition = TradingCore.OpenPosition.createMockEvent({
      market: marketAddress,
      positionId: 1n,
      mockEventData: { block: { number: 100 }, logIndex: 0 },
    });

    const mockDbAfterEvent = await TradingCore.OpenPosition.processEvent({
      event: mockOpenPosition,
      mockDb: mockDbEmpty,
    });

    const openPositionEntity = mockDbAfterEvent.entities.OpenPosition.get(
      "100-0"
    );

    assert.ok(openPositionEntity, "OpenPosition entity should be set");
    assert.equal(
      openPositionEntity?.market,
      marketAddress.toString(),
      "Market address should match"
    );
    assert.equal(
      openPositionEntity?.positionId,
      1n,
      "Position ID should match"
    );

    // Verify IndexerStats aggregation
    const stats = mockDbAfterEvent.entities.IndexerStats.get("global");
    assert.ok(stats, "IndexerStats should be set");
    assert.equal(stats?.totalOpenPositions, 1n, "Should have 1 OpenPosition counted");
  });

  it("MarketNFT Transfer sets a PositionTransfer entity", async () => {
    const mockDbEmpty = MockDb.createMockDb();
    const fromAddress = Addresses.mockAddresses[0];
    const toAddress = Addresses.mockAddresses[1];

    const mockTransfer = MarketNFT.Transfer.createMockEvent({
      from: fromAddress,
      to: toAddress,
      tokenId: 123n,
      mockEventData: { block: { number: 200 }, logIndex: 1 },
    });

    const mockDbAfterEvent = await MarketNFT.Transfer.processEvent({
      event: mockTransfer,
      mockDb: mockDbEmpty,
    });

    const transferEntity = mockDbAfterEvent.entities.PositionTransfer.get(
      "200-1"
    );

    assert.ok(transferEntity, "PositionTransfer entity should be set");
    assert.equal(
      transferEntity?.from,
      fromAddress.toString(),
      "From address should match"
    );
    assert.equal(
      transferEntity?.to,
      toAddress.toString(),
      "To address should match"
    );
    assert.equal(transferEntity?.tokenId, 123n, "Token ID should match");
  });
});
