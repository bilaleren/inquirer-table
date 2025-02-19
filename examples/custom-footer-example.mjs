import { table } from 'inquirer-table';
import { posts } from './data.mjs';

async function bootstrap() {
  const selectedPost = await table({
    data: posts,
    columns: [
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
    ],
    selectable: true,
    renderFooter: ({
      data,
      range,
      pageSize,
      multiple,
      selectable,
      selectedRows
    }) => {
      const footer = [];
      const countOfData = data.length;

      if (countOfData > pageSize) {
        const [startRange, endRange] = range;

        footer.push(
          `Out of a total of ${countOfData} data, ${startRange} to ${endRange} are displayed.`
        );

        if (multiple && selectable) {
          footer.push(` (${selectedRows.length} items selected)`);
        }
      } else if (multiple && selectable) {
        footer.push(`${selectedRows.length} items selected.`);
      }

      return footer.join('');
    }
  });

  console.log('Selected post:', selectedPost);
}

bootstrap();
