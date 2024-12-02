const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'EMAIL', uid: 'email' },
  { name: 'ROLE', uid: 'role', sortable: true },
  { name: 'STORE ID', uid: 'storeId' },
  { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL = ['name', 'role', 'storeId', 'actions'];
export { columns, INITIAL };
