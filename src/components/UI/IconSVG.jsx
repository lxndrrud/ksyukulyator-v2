import React from 'react'

function IconSVG({ data }) {
  return (
    <span>
        <svg style={{width: "20px", height:"20px"}} viewBox="0 0 24 24">
            <path fill="currentColor" d={data} />
        </svg>
    </span>
  )
}

export default IconSVG