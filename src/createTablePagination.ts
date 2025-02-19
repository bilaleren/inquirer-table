export interface TablePaginationOptions {
  data: unknown[];
  pointer: number;
  pageSize: number;
}

export interface TablePaginationReturn {
  range: readonly [number, number];
  firstIndex: number;
  lastIndex: number;
}

function createTablePagination(
  options: TablePaginationOptions
): TablePaginationReturn {
  const { data, pointer, pageSize } = options;
  const countOfData = data.length;
  const middleOfPage = Math.floor(pageSize / 2);
  const firstPageIndex = Math.max(0, pointer - middleOfPage);
  const lastPageIndex = Math.min(
    firstPageIndex + pageSize - 1,
    countOfData - 1
  );
  const lastPageOffset = pageSize - 1 - lastPageIndex + firstPageIndex;
  const firstIndex = Math.max(0, firstPageIndex - lastPageOffset);
  const startRange = firstIndex + 1;
  const endRange = Math.min(countOfData, lastPageIndex + 1);

  return {
    range: [startRange, endRange],
    firstIndex,
    lastIndex: lastPageIndex
  };
}

export default createTablePagination;
