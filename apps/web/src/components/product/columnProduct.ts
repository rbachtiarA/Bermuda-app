const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'PRICE', uid: 'price', sortable: true },
  // { name: 'STOCK', uid: 'stock', sortable: true },
  // { name: 'CATEGORIES', uid: 'categories', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL = ['name', 'price', 'actions'];
export { columns, INITIAL };
