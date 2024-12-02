const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'PRODUCT NAME', uid: 'product', sortable: true },
  { name: 'STORE NAME', uid: 'store', sortable: true },
  { name: 'QUANTITY', uid: 'quantity', sortable: true },
  // { name: 'CHANGE TYPE', uid: 'stockHistory', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL = [
  'id',
  'product',
  'store',
  'quantity',
  // 'stockHistory',
  'actions',
];

export { columns, INITIAL };
