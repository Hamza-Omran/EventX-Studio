import React from 'react'
import './LoadingDots.css'

const LoadingDots = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
            }}
        >
            <div className="load">
                <div className="one"></div>
                <div className="two"></div>
                <div className="three"></div>
            </div>
        </div>
    )
}

export default LoadingDots