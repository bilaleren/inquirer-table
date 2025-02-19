import chalk from 'chalk';
import CliTable from 'cli-table3';
import figures from '@inquirer/figures';
import createTablePagination, {
  type TablePaginationReturn
} from './createTablePagination';
import type { TableItem, TableColumn } from './types';

export type HeaderRenderer<TItem extends TableItem> = (
  params: TablePaginationReturn & CliTableBaseOptions<TItem>
) => string | null | undefined;

export type FooterRenderer<TItem extends TableItem> = (
  params: TablePaginationReturn & CliTableBaseOptions<TItem>
) => string | null | undefined;

export type CellRenderer = (value: CliTable.CellValue) => CliTable.CellValue;

export type FigureCellRenderer = (
  params: RenderFigureCellParams
) => CliTable.Cell;

export interface CliTableBaseOptions<TItem extends TableItem> {
  /**
   * Data to be shown in the table.
   */
  data: TItem[];

  /**
   * Table columns.
   */
  columns: TableColumn<TItem>[];

  /**
   * Which row the cursor is on.
   */
  pointer: number;

  /**
   * Page size for pagination.
   * @default 5
   */
  pageSize: number;

  /**
   * If `true`, multiple selection is allowed.
   * @default false
   */
  multiple: boolean;

  /**
   * If `true`, table rows become selectable.
   * @default false
   */
  selectable: boolean;

  /**
   * Selected rows in the table.
   */
  selectedRows: TItem[];

  /**
   * If an `AbortController` is provided, the prompt can be cancelled by pressing `backspace`.
   * @see https://github.com/SBoudrias/Inquirer.js#canceling-prompt
   */
  abortController: AbortController | undefined;
}

export interface RenderFigureCellParams {
  /**
   * Is the cursor on the current row?
   */
  isActive: boolean;

  /**
   * Has the row been selected?
   */
  isSelected: boolean;
}

export interface CliTableExternalOptions<TItem extends TableItem> {
  /**
   * `cli-table3` options.
   */
  tableOptions?: Omit<
    CliTable.TableConstructorOptions,
    'head' | 'colWidths' | 'colAligns'
  >;

  /**
   * Render the table header.
   */
  renderHeader?: HeaderRenderer<TItem>;

  /**
   * Render the table footer.
   */
  renderFooter?: FooterRenderer<TItem>;

  /**
   * Render figure cell.
   */
  renderFigureCell?: FigureCellRenderer;

  /**
   * Render the cell where the pointer is active.
   */
  renderActiveCell?: CellRenderer;

  /**
   * Render the selected cell.
   */
  renderSelectedCell?: CellRenderer;

  /**
   * Render the unselected cell.
   */
  renderUnSelectedCell?: CellRenderer;
}

export type CliTableOptions<TItem extends TableItem> =
  CliTableBaseOptions<TItem> & CliTableExternalOptions<TItem>;

export interface CliTableReturn {
  table: CliTable.Table;

  /**
   * Table header content.
   */
  header: string | null | undefined;

  /**
   * Table footer content.
   */
  footer: string | null | undefined;
}

function createCliTable<TItem extends TableItem>(
  options: CliTableOptions<TItem>
): CliTableReturn {
  const {
    data,
    columns,
    pointer,
    multiple,
    selectable,
    pageSize,
    selectedRows,
    tableOptions,
    abortController,
    renderHeader = ({ multiple, selectable, abortController }) => {
      const texts: string[] = [];

      if (selectable && multiple) {
        texts.push(`${chalk.cyan('<space>')} to select a row`);
      }

      texts.push(
        `${chalk.cyan('<up>')} and ${chalk.cyan(
          '<down>'
        )} to navigate between rows`
      );

      if (selectable) {
        texts.push(
          `${chalk.cyan('<enter>')} to confirm ${multiple ? 'selections' : 'the selection'}`
        );
      }

      if (abortController) {
        texts.push(`${chalk.cyan('<backspace>')} to cancel`);
      }

      return texts.length ? `(${texts.join(', ')}) press the keys` : null;
    },
    renderFooter,
    renderFigureCell = ({ isActive, isSelected }) => {
      const figure = isSelected ? figures.radioOn : figures.radioOff;

      if (isActive) {
        return chalk.cyan.bold(`[ ${figure} ]`);
      } else if (isSelected) {
        return chalk.green.bold(figure);
      } else {
        return figure;
      }
    },
    renderActiveCell = chalk.cyan,
    renderSelectedCell = chalk.green,
    renderUnSelectedCell = (value) => value
  } = options;

  if (!data.length) {
    throw new Error('You must specify at least one item to create the table.');
  }

  if (!columns.length) {
    throw new Error(
      'You must specify at least one column to create the table.'
    );
  }

  const table = new CliTable({
    ...tableOptions,
    head: columns.reduce<string[]>(
      (acc, curr) => [...acc, curr.header],
      selectable && multiple ? [' '] : []
    ),
    colWidths: columns.reduce<(number | null)[]>(
      (acc, curr) => [...acc, curr.width ?? null],
      selectable && multiple ? [null] : []
    ),
    colAligns: columns.reduce<CliTable.HorizontalAlignment[]>(
      (acc, curr) => [...acc, curr.align || 'left'],
      selectable && multiple ? ['center'] : []
    )
  });

  const { range, firstIndex, lastIndex } = createTablePagination({
    data,
    pointer,
    pageSize
  });

  for (let index = 0; index < data.length; index++) {
    if (index < firstIndex || index > lastIndex) {
      continue;
    }

    const cells: CliTable.Cell[] = [];
    const item = data[index];
    const isActive = index === pointer;
    const isSelected = selectable && multiple && selectedRows.includes(item);

    const renderCellValue = isActive
      ? renderActiveCell
      : isSelected
        ? renderSelectedCell
        : renderUnSelectedCell;

    const renderedCells: CliTable.Cell[] = columns.map((column) => {
      if ('accessorKey' in column) {
        return renderCellValue(item[column.accessorKey]);
      }

      const renderResult = column.renderCell?.(item, index);

      if (renderResult != null && typeof renderResult === 'object') {
        return {
          ...renderResult,
          content: renderCellValue(renderResult.content)
        };
      }

      return renderCellValue(renderResult);
    });

    if (selectable && multiple) {
      cells.push(
        renderFigureCell({
          isActive,
          isSelected
        })
      );
    }

    cells.push(...renderedCells);

    table.push(cells);
  }

  const params: TablePaginationReturn & CliTableBaseOptions<TItem> = {
    // cli table params
    data,
    columns,
    pointer,
    multiple,
    selectable,
    pageSize,
    selectedRows,
    abortController,
    // pagination params
    range,
    firstIndex,
    lastIndex
  };

  return {
    table,
    header: renderHeader?.(params),
    footer: renderFooter?.(params)
  };
}

export default createCliTable;
