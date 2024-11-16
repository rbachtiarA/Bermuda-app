import { Request, Response } from 'express';
import prisma from '@/prisma';
import { rajaonkir } from '@/templates/rajaonkir';

export class AddressController {
  async updateProvince(req:Request, res:Response) {
    const { results } = rajaonkir
    const provinces = results.map((item) => {return {id: Number(item.province_id), name: item.province}})
    const cities = results.map((item) => {return {id: Number(item.city_id), provinceId: Number(item.province_id), 
      name: `${item.type === 'Kota'? 'Kota ':' '}${item.city_name}`}})
    
    const setProvince = new Set([...provinces])
    await prisma.province.createMany({
      data: provinces,
      skipDuplicates: true
    })
    await prisma.city.createMany({
      data: cities,
      skipDuplicates: true
    })
    return res.status(200).send({
      msg: 'Success update city and province'
    })
  }
}
