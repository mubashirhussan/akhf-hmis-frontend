/** Minimum table width for horizontal scroll (sum of column widths). */
export function getTableScrollWidth(columns = []) {
  return columns.reduce((sum, column) => {
    if (typeof column.width === 'number') {
      return sum + column.width;
    }

    if (typeof column.minWidth === 'number') {
      return sum + column.minWidth;
    }

    return sum + 120;
  }, 0);
}
