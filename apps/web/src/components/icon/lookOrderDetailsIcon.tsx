export default function LookOrderDetailsIcon({ size, height, width, fill, ...props }: {size?: number, height?: number, width?:number, fill?:string}) {

  return (
    <svg 
    height= {size || height || 24} 
    width= {size || width || 24}
    fill= {fill || '#000000'} 
      viewBox="0 0 32 32" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >

    <g data-name="18. Bill" id="_18._Bill">

    <path d="M16,7h2a1,1,0,0,0,0-2H17a1,1,0,0,0-2,0v.18A3,3,0,0,0,16,11a1,1,0,0,1,0,2H14a1,1,0,0,0,0,2h1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,16,9a1,1,0,0,1,0-2Z"/>

    <path d="M31,24H28V3a3,3,0,0,0-3-3H3A3,3,0,0,0,0,3V9a1,1,0,0,0,1,1H4V29a3,3,0,0,0,3,3H29a3,3,0,0,0,3-3V25A1,1,0,0,0,31,24ZM2,3A1,1,0,0,1,4,3V8H2ZM8,25v4a1,1,0,0,1-.31.71A.93.93,0,0,1,7,30a1,1,0,0,1-1-1V3a3,3,0,0,0-.18-1H25a1,1,0,0,1,1,1V24H9A1,1,0,0,0,8,25Zm22,4a1,1,0,0,1-.31.71A.93.93,0,0,1,29,30H9.83A3,3,0,0,0,10,29V26H30Z"/>

    <path d="M17,19H9a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2Z"/>

    <path d="M23,19H21a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z"/>

    </g>

    </svg>
     
  )
}