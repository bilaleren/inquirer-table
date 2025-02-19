import { table } from 'inquirer-table';
import { posts } from './data.mjs';

async function bootstrap() {
  const selectedPosts = await table({
    data: posts,
    multiple: true,
    selectable: true,
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

  console.log('Selected posts:', selectedPosts);
}

bootstrap();
