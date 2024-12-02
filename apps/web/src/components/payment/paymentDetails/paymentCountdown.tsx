'use client'
import { useEffect, useState } from "react"

export default function PaymentCountdown({expDate}: {expDate:string}) {
    const [timeLeft, setTimeLeft] = useState<number | null>(null)

    useEffect(() => {
        const expiredLeftInSecond = Math.ceil((Date.parse(expDate) - Date.now())/1000)
        
        setTimeLeft(expiredLeftInSecond <= 0? 0 : expiredLeftInSecond)
    },[])

    useEffect(() => {
        if(timeLeft === null || timeLeft <= 0) return;

        const tick = setInterval(() => {
            setTimeLeft(timeLeft - 1)

        }, 1000)
        return () => clearInterval(tick)
    }, [timeLeft])

  return (
    <div>
      <p className="font-semibold text-danger">
        Time limit :   {`${Math.floor((timeLeft||0)/60)}`.padStart(2, '0')}:{`${((timeLeft||0)%60)}`.padStart(2, '0')} left
      </p>
    </div>
  )
}
