import { useState, useEffect, useKeypress, createPrompt } from '@inquirer/core';
import cliCursor from 'cli-cursor';
import createCliTable, { type CliTableExternalOptions } from './createCliTable';
import type { TableItem, TableColumn } from './types';

export type TableValue<
  TItem extends TableItem,
  TSelectable extends boolean = false,
  TMultiple extends boolean = false
> = TSelectable extends true
  ? TMultiple extends true
    ? TItem[]
    : TItem
  : never;

export interface TableConfig<
  TItem extends TableItem,
  TSelectable extends boolean = false,
  TMultiple extends boolean = false
> extends CliTableExternalOptions<TItem> {
  /**
   * Data to be shown in the table.
   */
  data: TItem[];

  /**
   * Table columns.
   */
  columns: TableColumn<TItem>[];

  /**
   * Page size for pagination.
   * @default 5
   */
  pageSize?: number;

  /**
   * If `true`, multiple selection is allowed.
   * @default false
   */
  multiple?: TMultiple;

  /**
   * If `true`, table rows become selectable.
   * @default false
   */
  selectable?: TSelectable;

  /**
   * If an `AbortController` is provided, the prompt can be cancelled by pressing `backspace`.
   * @see https://github.com/SBoudrias/Inquirer.js#canceling-prompt
   */
  abortController?: AbortController;
}

const table = createPrompt(
  <
    TItem extends TableItem,
    TSelectable extends boolean = false,
    TMultiple extends boolean = false
  >(
    config: TableConfig<TItem, TSelectable, TMultiple>,
    done: (value: TableValue<TItem, TSelectable, TMultiple>) => void
  ) => {
    const {
      data,
      columns,
      pageSize = 5,
      multiple = false,
      selectable = false,
      abortController,
      ...cliTableOptions
    } = config;

    const [pointer, setPointer] = useState<number>(0);
    const [selectedRows, setSelectedRows] = useState<TItem[]>([]);
    const {
      table: cliTable,
      header: tableHeader,
      footer: tableFooter
    } = createCliTable<TItem>({
      ...cliTableOptions,
      data,
      columns,
      pointer,
      pageSize,
      multiple,
      selectable,
      selectedRows,
      abortController
    });

    useKeypress((event) => {
      switch (event.name) {
        case 'up': {
          if (pointer > 0) {
            setPointer(pointer - 1);
          }
          break;
        }
        case 'down': {
          if (pointer < data.length - 1) {
            setPointer(pointer + 1);
          }
          break;
        }
        case 'return': {
          if (selectable) {
            if (multiple) {
              done(selectedRows as TableValue<TItem, TSelectable, TMultiple>);
            } else {
              done(data[pointer] as TableValue<TItem, TSelectable, TMultiple>);
            }
          }
          break;
        }
        case 'space': {
          if (selectable && multiple) {
            const rows = [...selectedRows];
            const selectedRow = data[pointer];
            const selectedRowIndex = rows.indexOf(selectedRow);

            if (selectedRowIndex > -1) {
              rows.splice(selectedRowIndex, 1);
              setSelectedRows(rows);
            } else {
              rows.push(selectedRow);
              setSelectedRows(rows);
            }
          }
          break;
        }
        case 'backspace': {
          if (abortController && !abortController.signal.aborted) {
            abortController.abort();
          }
          break;
        }
      }
    });

    useEffect(() => {
      cliCursor.hide();
      return () => cliCursor.show();
    }, []);

    return [tableHeader, cliTable.toString(), tableFooter]
      .filter(Boolean)
      .join('\n');
  }
);

export default table;
