export interface IShippingCost {
    service: string,
    description: string,
    cost: {
    value: number,
    etd: string,
    note: string
    }[]
}