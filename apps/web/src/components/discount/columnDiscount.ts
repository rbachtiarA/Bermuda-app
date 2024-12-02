const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'DISCOUNT TYPE', uid: 'discountType', sortable: true },
  { name: 'MIN PURCHASE', uid: 'minPurchase', sortable: true },
  { name: 'PRODUCT ID', uid: 'productId', sortable: true },
  { name: 'STORE ID', uid: 'storeId', sortable: true },
  { name: 'VALUE', uid: 'value', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL = ['id', 'discountType', 'value', 'actions'];

export { columns, INITIAL };
