import SkeletonCategoryCard from "./skeletonCategoryCard";

export default function SkeletonCategoriesList() {
    return (
        <div className="flex overflow-auto gap-2 p-1">
            <SkeletonCategoryCard />    
            <SkeletonCategoryCard />    
            <SkeletonCategoryCard />    
            <SkeletonCategoryCard />    
            <SkeletonCategoryCard />    
        </div>
    )
}
