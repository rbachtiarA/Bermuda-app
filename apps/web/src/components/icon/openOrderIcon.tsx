export default function OpenOrderIcon({ size, height, width, fill, ...props }: {size?: number, height?: number, width?:number, fill?:string}) {

    return (
		<svg 
			height= {size || height || 24} 
			width= {size || width || 24}
			fill="none"
			viewBox="0 0 24 24" 
			xmlns="http://www.w3.org/2000/svg" 
		>
			<rect x="5" y="4" width="14" height="17" rx="2" stroke="#000000"/>
			<path d="M9 9H15" stroke="#000000" strokeLinecap="round"/>
			<path d="M9 13H15" stroke="#000000" strokeLinecap="round"/>
			<path d="M9 17H13" stroke="#000000" strokeLinecap="round"/>
		</svg>
    )
}