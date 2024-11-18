export async function rajaongkirShippingCost(origin: number, destination: number) {
    try {
        const res = await fetch('https://api.rajaongkir.com/starter/cost', {
            method: 'POST',
            headers: {
                "Content-type":"application/json",
                key: `${process.env.RAJAONGKIR_KEY}`
            },
            body: JSON.stringify({origin, destination, weight: 1000, courier: 'jne'})
        })
        
        const json: any = res.json()
        return json
    } catch (error) {
        return {
            rajaongkir: {
                status: '400'
            }
        }
    }
}