import { table } from 'inquirer-table';
import { posts } from './data.mjs';

async function bootstrap() {
  await table({
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
    ]
  });
}

bootstrap();
