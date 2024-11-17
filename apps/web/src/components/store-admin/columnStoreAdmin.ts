const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'EMAIL', uid: 'email' },
  { name: 'ROLE', uid: 'role', sortable: true },
  { name: 'STOREID', uid: 'storeId' },
  { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL = ['name', 'role', 'actions'];
export { columns, INITIAL };
