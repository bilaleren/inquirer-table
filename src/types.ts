import type CliTable from 'cli-table3';

export type KnownKeys<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : K]: T[K];
};

export type TableItem = Record<string, any>;

export type TableCellRenderer<TItem extends TableItem> = (
  item: TItem,
  index: number
) => CliTable.Cell;

export type TableColumn<TItem extends TableItem> = {
  /**
   * Column header.
   */
  header: string;

  /**
   * Column width.
   */
  width?: number | null;

  /**
   * Column horizontal alignment.
   */
  align?: CliTable.HorizontalAlignment;
} & (
  | {
      /**
       * Render cell content.
       */
      renderCell: TableCellRenderer<TItem>;
    }
  | {
      /**
       * Access key for cell content.
       */
      accessorKey: keyof KnownKeys<TItem>;
    }
);
