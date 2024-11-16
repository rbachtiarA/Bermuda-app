export default function PaymentList({label, value, className}: {label: string, value: string, className?: string}) {
  return (
    <li className={className}>
        <div className="flex justify-between">
            <p>{label}</p>
            <p>{value}</p>
        </div>
    </li>
  )
}
