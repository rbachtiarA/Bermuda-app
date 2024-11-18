import { Request, Response } from "express";
import prisma from "../prisma";

export class SuperAdminController {
    async getAllStore(req: Request, res: Response) {
        try {
            const stores = await prisma.store.findMany({
                include: {
                    city: true,
                },
            });
            res.status(200).json({ success: true, data: stores });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching stores", error });
        }
    }

    async createStore(req: Request, res: Response) {
        const { name, location, latitude, longitude, cityId } = req.body;

        if (!name || !location || !latitude || !longitude || !cityId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        try {
            const newStore = await prisma.store.create({
                data: {
                    name,
                    location,
                    latitude,
                    longitude,
                    cityId,
                },
            });
            res.status(201).json({ success: true, data: newStore });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error creating store", error });
        }
    }
}
