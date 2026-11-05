// The demo's tool list. One definition, three uses: the page, an MCP tools/list, a manifest.
// `store` is whatever holds the todos; the page passes its own, the manifest generator passes a stub.

export function makeTools(store) {
  return [
    {
      name: 'list-todos',
      description: 'List the todo items on this page, with their ids and whether each is done.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute() {
        return { content: [{ type: 'text', text: JSON.stringify(store.list()) }] };
      },
    },
    {
      name: 'add-todo',
      description: 'Add a new todo item to the list on this page.',
      inputSchema: {
        type: 'object',
        properties: { text: { type: 'string', description: 'What needs doing' } },
        required: ['text'],
      },
      execute({ text }) {
        const item = store.add(String(text ?? '').trim());
        if (!item) throw new Error('text must not be empty');
        return { content: [{ type: 'text', text: `Added todo ${item.id}: "${item.text}"` }] };
      },
    },
    {
      name: 'complete-todo',
      description: 'Mark a todo item as done, by id.',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'integer', description: 'The id from list-todos' } },
        required: ['id'],
      },
      execute({ id }) {
        const item = store.complete(Number(id));
        if (!item) throw new Error(`no todo with id ${id}`);
        return { content: [{ type: 'text', text: `Done: "${item.text}"` }] };
      },
    },
  ];
}
