export default function NotificationBottomNavbar({data}: {data:any[]}) {

    return (
        <span className="absolute top-0 -right-3 bg-red-600 rounded-full text-white text-[.7em] text-center px-1">{data.length}</span>
    )
}