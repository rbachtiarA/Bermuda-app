'use client'
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function DisplayUserLocation() {
    const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null)

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    console.log(userLocation);
                },

                

                (error) => {
                    console.error("Error get user location: ", error);
                }
            )
        } else {
            console.log("Geolodation is not supported by this browser");
        }
    }

    return (
        <>
            <h1>Geolocation App</h1>

            <Button onClick={getUserLocation}>Get User Location</Button>

            {userLocation && (
                <div>
                    <h2>User Location</h2>
                    <p>Latitude: {userLocation.latitude}</p>
                    <p>Longitude: {userLocation.longitude}</p>

                </div>
            )}
        </>
    )
}