import { Store } from "@prisma/client";

//from https://www.geodatasource.com/developers/javascript
function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        const radlat1 = Math.PI * lat1/180;
        const radlat2 = Math.PI * lat2/180;
        const theta = lon1-lon2;
        const radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        // if (unit=="K") { dist = dist * 1.609344 }
        // if (unit=="N") { dist = dist * 0.8684 }
        // distance in kilometer
        return dist * 1.609344;
    }
}

export default function nearestStore(lat: number, lon: number, stores: Store[]): Store | null {
    if(stores.length === 0) {
        return null
    }

    const storesDistance = stores.map((store) => distance(lat, lon, store.latitude, store.longitude))
    const closestDistance = Math.min(...storesDistance)
    const nearestStoreIndex = storesDistance.findIndex((distance) => distance === closestDistance)
    if(nearestStoreIndex !== -1) {
        return stores[0]
    } else {
        return null
    }
}