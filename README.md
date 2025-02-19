# inquirer-table

[![NPM](https://img.shields.io/npm/v/inquirer-table.svg)](https://www.npmjs.com/package/inquirer-table)
![](https://badgen.net/npm/license/inquirer-table)
![](https://badgen.net/npm/dw/inquirer-table)
![](https://badgen.net/npm/dm/inquirer-table)

> A table prompt for [Inquirer.js](https://github.com/SBoudrias/Inquirer.js).

Interactive table component for command line interfaces.

# Installation

| yarn                      | npm                          | pnpm                      |
| :------------------------ | :--------------------------- | :------------------------ |
| `yarn add inquirer-table` | `npm install inquirer-table` | `pnpm add inquirer-table` |

# Usage

```typescript
import { table, type TableColumn } from 'inquirer-table';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const posts: Post[] = [
  {
    userId: 1,
    id: 1,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
  }
];

const columns: TableColumn<Post>[] = [
  {
    header: 'ID',
    accessorKey: 'id'
  },
  {
    header: 'User ID',
    accessorKey: 'userId'
  },
  {
    header: 'Title',
    accessorKey: 'title'
  },
  {
    header: 'Body',
    accessorKey: 'body'
  }
];

const answer = await table({
  data: posts,
  columns
});
```

> [See other usage examples](./examples)

# Options

| Property               | Type                                                                                                    | Required | Description                                                                                                                                                             |
| :--------------------- |:--------------------------------------------------------------------------------------------------------| :------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data`                 | `TableItem[]`                                                                                           | Yes      | Data to be shown in the table.                                                                                                                                          |
| `columns`              | `TableColumn<TableItem>[]`                                                                              | Yes      | Table columns.                                                                                                                                                          |
| `pageSize`             | `number`                                                                                                | No       | Page size for pagination. Defaults to `5`.                                                                                                                              |
| `multiple`             | `boolean`                                                                                               | No       | If `true`, multiple selection is allowed. Defaults to `false`.                                                                                                          |
| `selectable`           | `boolean`                                                                                               | No       | If `true`, table rows become selectable.. Defaults to `false`.                                                                                                          |
| `abortController`      | `AbortController`                                                                                       | No       | If an `AbortController` is provided, the prompt can be cancelled by pressing `backspace`. [Canceling Prompt](https://github.com/SBoudrias/Inquirer.js#canceling-prompt) |
| `tableOptions`         | `Omit<CliTable.TableConstructorOptions, 'head' \| 'colWidths' \| 'colAligns'>`                          | No       | `cli-table3` options.                                                                                                                                                   |
| `renderHeader`         | `(params: UseTablePaginationReturn & UseCliTableBaseOptions<TableItem>) => string \| null \| undefined` | No       | Render the table header.                                                                                                                                                |
| `renderFooter`         | `(params: UseTablePaginationReturn & UseCliTableBaseOptions<TableItem>) => string \| null \| undefined` | No       | Render the table footer.                                                                                                                                                |
| `renderFigureCell`     | `(params: RenderFigureCellParams) => CliTable.Cell`                                                     | No       | Render figure cell.                                                                                                                                                     |
| `renderActiveCell`     | `(value: CliTable.CellValue) => CliTable.CellValue`                                                     | No       | Render the cell where the pointer is active.                                                                                                                            |
| `renderSelectedCell`   | `(value: CliTable.CellValue) => CliTable.CellValue`                                                     | No       | Render the selected cell.                                                                                                                                               |
| `renderUnSelectedCell` | `(value: CliTable.CellValue) => CliTable.CellValue`                                                     | No       | Render the unselected cell.                                                                                                                                             |
