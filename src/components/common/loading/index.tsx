'use client';

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export interface LoadingSpinnerProps {
    show: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    show
}) => {

if(show){
    return (
        <div id="loader" style={{
            background: 'rgba(255, 255, 255, 0.5)',
            width: '100%',
            height: '100%',
            zIndex: 999999,
            position: 'absolute',
            left: '5%',
            top: '5%'
        }}>
            <div style={{
                position: 'absolute',
                left: '36%',
                top:'30%'
            }}>
                <div className="lds-hourglass"></div>
            </div>

        </div>
    );
}
};

export default LoadingSpinner;
