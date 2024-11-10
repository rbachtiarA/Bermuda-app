export default function SuccessCheckmarkIcon({ size, height, width, ...props }: {size?: number, height?: number, width?:number}) {

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height= {size || height || 24} 
            width= {size || width || 24}
            viewBox="0 0 24 24" 
            fill="#000000" 
            id="check-mark-circle-2" 
            className="icon line"
            {...props}
        >
            <path 
                id="primary" 
                d="M20.94,11A8.26,8.26,0,0,1,21,12a9,9,0,1,1-9-9,8.83,8.83,0,0,1,4,1" 
                style={{fill: 'none', stroke: 'rgb(0,0,0)', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth: 1.5}}>
            </path>

            <polyline 
                id="primary-2" 
                data-name="primary" 
                points="21 5 12 14 8 10" 
                style={{fill: 'none', stroke: 'rgb(0,0,0)', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth: 1.5}}>
        </polyline>
        </svg>
    )
}