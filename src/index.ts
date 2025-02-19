import table from './table';

export {
  default as createCliTable,
  type CliTableOptions,
  type CliTableReturn,
  type RenderFigureCellParams,
  type CliTableExternalOptions,
  type CellRenderer,
  type HeaderRenderer,
  type FooterRenderer,
  type FigureCellRenderer
} from './createCliTable';

export {
  default as createTablePagination,
  type TablePaginationOptions,
  type TablePaginationReturn
} from './createTablePagination';

export type { TableValue, TableConfig } from './table';

export * from './types';

export { table };
export default table;
