export default function PaymentList({label, value}: {label: string, value: string}) {
  return (
    <li>
        <div className="flex justify-between">
            <p>{label}</p>
            <p>{value}</p>
        </div>
    </li>
  )
}
