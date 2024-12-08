import { Request, Response } from 'express';
import midtrans from '../services/midtrans';
import prisma from '@/prisma';
import cancelOrder from '@/helpers/cancelOrder';
import { cloudinaryUpload } from '@/middleware/cloudinary';

export class OrderController {
  async updatePaymentProof(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      if (!req?.file) throw 'Please upload validated file';
      const { secure_url } = await cloudinaryUpload(req.file, 'paymentProof')
      const imgLink = secure_url;
      // const imgLink = `${process.env.BASE_URL_BE}public/paymentProof/${req.file.filename}`;

      const updatedOrder = await prisma.order.update({
        where: { id: +orderId! },
        data: {
          paymentProofUrl: imgLink,
          status: 'Waiting',
        },
      });
      if (!updatedOrder) throw 'Order is invalid';
      return res.status(200).send({
        status: 'ok',
        msg: imgLink,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        msg: `${error}`,
      });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { orderId } = req.params;
      const order = await prisma.order.findUnique({
        where: {
          id: +orderId,
          userId: +userId!,
        },
        include: {
          Payment: true,
          Address: true,
          Store: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) throw 'Cant find order';
      return res.status(200).send({
        status: 'ok',
        msg: order,
      });
    } catch (error) {
      return res.status(401).send({
        status: 'error',
        msg: error,
      });
    }
  }

  // get order which have status 'pending', return msg FOUND / NOT FOUND and Order with Order & Payment
  async getPendingOrder(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const pendingOrder = await prisma.order.findFirst({
        where: { userId: userId, status: 'PendingPayment' },
        include: {
          Payment: true,
          Address: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
      return res.status(200).send({
        status: 'ok',
        msg: pendingOrder ? 'FOUND' : 'NOT_FOUND',
        order: pendingOrder,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        msg: error,
      });
    }
  }

  async getUserOrder(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userOrder = await prisma.order.findMany({
        where: {
          userId: +userId!,
        },
        include: {
          Payment: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (!userOrder) throw 'User doesnt have any order';

      return res.status(200).send({
        status: 'ok',
        msg: 'Success get data',
        order: userOrder,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        msg: `${error}`,
      });
    }
  }

  async patchCompletedOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const userId = req.user?.id;
      const existOrder = await prisma.order.findFirst({
        where: {
          AND: {
            id: +orderId,
            userId: +userId!,
          },
        },
      });
      if (!existOrder) throw 'User doesnt have any order';

      const updatedOrder = await prisma.order.update({
        where: { id: existOrder.id },
        data: { status: 'Completed' },
      });

      return res.status(200).send({
        status: 'ok',
        msg: 'Success update order',
      });
    } catch (error) {
      return res.status(401).send({
        status: 'error',
        msg: `${error}`,
      });
    }
  }

  async userCancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const userId = req.user?.id;

      const existOrder = await prisma.order.findFirst({
        where: {
            id: +orderId,
            userId: +userId!,
            status: {
              not: 'Cancelled'
            }
          },
        include: {
          Payment: true,
          Store: true,
        },
      });

      if (!existOrder) throw 'Order is Invalid';
      const isExpired =
        Date.parse(String(existOrder.Payment?.expiredDate)) < Date.now();
      if (existOrder.Payment?.paymentMethod === 'Gateway' && !isExpired) {
        //cancel midtrans
        try {
          const midtransStatus = await midtrans.snap.transaction.cancel(
            `${process.env.PREFIX_ORDERNAME_MIDTRANS}${existOrder.id}`,
          );
        } catch (error) {
          return res.status(200).send({ status: 'ok', msg: 'NOT_FOUND' });
        }
      }
      if (existOrder.paymentProofUrl !== null)
        throw 'You already have uploaded payment proof';

      await cancelOrder(existOrder.id);

      return res.status(200).send({
        status: 'ok',
        msg: 'FOUND',
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        msg: `${error}`,
      });
    }
  }

  async getUserOrderReport(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await prisma.user.findUnique({
        where: {
          id: +userId!,
        },
      });
      let userOrder: any[] = [];
      if (user?.role != 'SUPER_ADMIN') {
        userOrder = await prisma.order.findMany({
          where: {
            storeId: Number(user?.storeId),
          },
          include: {
            Payment: true,
            orderItems: {
              include: {
                product: {
                  include: {
                    stores: true,
                    categories: true,
                    stock: {
                      where: {
                        storeId: Number(user?.storeId),
                      },
                    },
                  },
                },
                order: {
                  include: {
                    discount: true,
                    Store: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      } else {
        userOrder = await prisma.order.findMany({
          include: {
            Payment: true,
            orderItems: {
              include: {
                product: {
                  include: {
                    stores: true,
                    categories: true,
                  },
                },
                order: {
                  include: {
                    discount: true,
                    Store: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }
      console.log(userId, 'USERID');

      if (!userOrder) throw 'User doesnt have any order';

      return res.status(200).send({
        status: 'ok',
        msg: 'Success get data',
        order: userOrder,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        msg: `${error}`,
      });
    }
  }
}
