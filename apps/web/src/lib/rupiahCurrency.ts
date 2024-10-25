
export default function currencyRupiah(value: number) {
    const IDR = new Intl.NumberFormat('en-id', {
        style: 'currency',
        currency: 'IDR'
      })
    
    return IDR.format(value)
}