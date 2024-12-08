import SkeletonProductCard from "./skeletonProductCard";

export default function SkeletonProductList() {

    return (
        <>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <SkeletonProductCard />
            <SkeletonProductCard />
            <SkeletonProductCard />
            <SkeletonProductCard />
            <SkeletonProductCard />
        </div>
        </>
    )
}
