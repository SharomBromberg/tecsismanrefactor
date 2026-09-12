export type StockState = 'in-stock' | 'low-stock' | 'out-of-stock';

export const LOW_STOCK_THRESHOLD = 5;

export function getStockState(stock: number | undefined): StockState {
  const value = stock ?? 0;

  if (value <= 0) {
    return 'out-of-stock';
  }

  if (value <= LOW_STOCK_THRESHOLD) {
    return 'low-stock';
  }

  return 'in-stock';
}

export function getStockStateLabel(state: StockState): string {
  switch (state) {
    case 'out-of-stock':
      return 'Agotado';
    case 'low-stock':
      return 'Bajo stock';
    default:
      return 'Disponible';
  }
}
