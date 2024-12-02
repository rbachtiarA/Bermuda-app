const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL = ['id', 'name', 'actions'];

export { columns, INITIAL };

// async getAvailableDiscount(req: Request, res: Response) {
//   try {
//     const discount = await prisma.discount.findMany({});

//     return res.status(200).send({
//       status: 'ok',
//       discount,
//     });
//   } catch (error) {
//     return res.status(400).send({
//       status: 'error',
//       msg: error,
//     });
//   }
// }
