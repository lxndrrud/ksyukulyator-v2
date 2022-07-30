import React from 'react'

function IconSVG({ data, color="currentColor" }) {
  return (
    <span>
        <svg style={{padding: "0px", width: "20px", height:"20px", justifyContent: "center", alignItems: "center"}} viewBox="0 0 24 24">
            <path fill={color} d={data} />
        </svg>
    </span>
  )
}

export default IconSVG