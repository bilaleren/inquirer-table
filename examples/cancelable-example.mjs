import { table } from 'inquirer-table';
import { posts } from './data.mjs';
import { AbortPromptError } from '@inquirer/core';

async function bootstrap() {
  const controller = new AbortController();
  const selectedPost = await table(
    {
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
      abortController: controller
    },
    { signal: controller.signal }
  ).catch((error) => {
    if (error instanceof AbortPromptError) {
      // Default value
      return undefined;
    }

    throw error;
  });

  if (selectedPost) {
    console.log('Selected post:', selectedPost);
  } else {
    console.log('Cancelled');
  }
}

bootstrap();
