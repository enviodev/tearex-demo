import {
  TradingCore,
  MarketNFT,
  AddMargin,
  OpenPosition,
  ClosePosition,
  Liquidate,
  StopLoss,
  TakeProfit,
  PositionTransfer,
  IndexerStats,
} from "generated";

const STATS_ID = "global";

async function updateStats(
  context: any,
  updates: { openDelta?: number; closeDelta?: number; transferDelta?: number },
  block: { number: number; timestamp: number }
) {
  const existing = await context.IndexerStats.get(STATS_ID);
  const stats: IndexerStats = {
    id: STATS_ID,
    totalOpenPositions: (existing?.totalOpenPositions ?? 0n) + BigInt(updates.openDelta ?? 0),
    totalClosePositions: (existing?.totalClosePositions ?? 0n) + BigInt(updates.closeDelta ?? 0),
    totalPositionTransfers: (existing?.totalPositionTransfers ?? 0n) + BigInt(updates.transferDelta ?? 0),
    lastProcessedBlock: block.number,
    lastProcessedTimestamp: block.timestamp,
  };
  context.IndexerStats.set(stats);
}

// TradingCore event handlers - each sets an entity for the event
TradingCore.AddMargin.handler(async ({ event, context }) => {
  const id = `${event.block.number}-${event.logIndex}`;
  const entity: AddMargin = {
    id,
    market: event.params.market.toString(),
    positionId: event.params.positionId,
    addedAmount: event.params.addedAmount,
    blockNumber: event.block.number,
    logIndex: event.logIndex,
  };
  context.AddMargin.set(entity);
});

TradingCore.OpenPosition.handler(async ({ event, context }) => {
  const id = `${event.block.number}-${event.logIndex}`;
  const entity: OpenPosition = {
    id,
    market: event.params.market.toString(),
    positionId: event.params.positionId,
    blockNumber: event.block.number,
    logIndex: event.logIndex,
  };
  context.OpenPosition.set(entity);
  await updateStats(context, { openDelta: 1 }, event.block);
});

TradingCore.ClosePosition.handler(async ({ event, context }) => {
  const id = `${event.block.number}-${event.logIndex}`;
  const entity: ClosePosition = {
    id,
    market: event.params.market.toString(),
    positionId: event.params.positionId,
    isFullyClosed: event.params.isFullyClosed,
    assetReceived: event.params.assetReceived,
    debtReceived: event.params.debtReceived,
    swappedAssetToken: event.params.swappedAssetToken,
    decreasedDebtAmount: event.params.decreasedDebtAmount,
    decreasedMarginAmount: event.params.decreasedMarginAmount,
    blockNumber: event.block.number,
    logIndex: event.logIndex,
  };
  context.ClosePosition.set(entity);
  await updateStats(context, { openDelta: -1, closeDelta: 1 }, event.block);
});

TradingCore.Liquidate.handler(async ({ event, context }) => {
  const id = `${event.block.number}-${event.logIndex}`;
  const entity: Liquidate = {
    id,
    market: event.params.market.toString(),
    positionId: event.params.positionId,
    isFullyClosed: event.params.isFullyClosed,
    assetReceived: event.params.assetReceived,
    debtReceived: event.params.debtReceived,
    swappedAssetToken: event.params.swappedAssetToken,
    decreasedDebtAmount: event.params.decreasedDebtAmount,
    decreasedMarginAmount: event.params.decreasedMarginAmount,
    blockNumber: event.block.number,
    logIndex: event.logIndex,
  };
  context.Liquidate.set(entity);
  await updateStats(context, { openDelta: -1, closeDelta: 1 }, event.block);
});

TradingCore.StopLoss.handler(async ({ event, context }) => {
  const id = `${event.block.number}-${event.logIndex}`;
  const entity: StopLoss = {
    id,
    market: event.params.market.toString(),
    positionId: event.params.positionId,
    isFullyClosed: event.params.isFullyClosed,
    assetReceived: event.params.assetReceived,
    debtReceived: event.params.debtReceived,
    swappedAssetToken: event.params.swappedAssetToken,
    decreasedDebtAmount: event.params.decreasedDebtAmount,
    decreasedMarginAmount: event.params.decreasedMarginAmount,
    blockNumber: event.block.number,
    logIndex: event.logIndex,
  };
  context.StopLoss.set(entity);
  await updateStats(context, { openDelta: -1, closeDelta: 1 }, event.block);
});

TradingCore.TakeProfit.handler(async ({ event, context }) => {
  const id = `${event.block.number}-${event.logIndex}`;
  const entity: TakeProfit = {
    id,
    market: event.params.market.toString(),
    positionId: event.params.positionId,
    isFullyClosed: event.params.isFullyClosed,
    assetReceived: event.params.assetReceived,
    debtReceived: event.params.debtReceived,
    swappedAssetToken: event.params.swappedAssetToken,
    decreasedDebtAmount: event.params.decreasedDebtAmount,
    decreasedMarginAmount: event.params.decreasedMarginAmount,
    blockNumber: event.block.number,
    logIndex: event.logIndex,
  };
  context.TakeProfit.set(entity);
  await updateStats(context, { openDelta: -1, closeDelta: 1 }, event.block);
});

// MarketNFT Transfer (position NFT)
MarketNFT.Transfer.handler(async ({ event, context }) => {
  const id = `${event.block.number}-${event.logIndex}`;
  const entity: PositionTransfer = {
    id,
    from: event.params.from.toString(),
    to: event.params.to.toString(),
    tokenId: event.params.tokenId,
    blockNumber: event.block.number,
    logIndex: event.logIndex,
  };
  context.PositionTransfer.set(entity);
  await updateStats(context, { transferDelta: 1 }, event.block);
});
