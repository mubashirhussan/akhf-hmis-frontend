/** Grid placement for FormGrid / FormGridRow children. */
export function resolveGridColumn(col, colStart) {
  if (col === 'full' || col === 0) {
    return { gridColumn: '1 / -1' };
  }

  const span = Number(col);
  const spanValue = Number.isFinite(span) && span >= 1 ? span : 1;

  if (colStart != null) {
    const start = Number(colStart);
    if (Number.isFinite(start) && start >= 1) {
      return { gridColumn: `${start} / span ${spanValue}` };
    }
  }

  return { gridColumn: `span ${spanValue}` };
}
