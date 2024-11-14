export default function NotificationBottomNavbar({value}: {value:number}) {

    return (
        <span className="absolute -top-1 -right-2 bg-red-600 rounded-full text-white text-[.7em] text-center px-1">{value}</span>
    )
}