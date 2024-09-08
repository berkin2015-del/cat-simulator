import React, { useEffect, useState } from 'react';
import './paw.css';

export const Paw = () => {

    const [pawImageStyles, setPawImageStyles] = useState('cat-paw');
    const [pawImageSpinning, setPawImageSpinning] = useState(false)

    const handlePawImgClick = () => {
        console.log(`clicked paw\nspin set to ${!pawImageSpinning}`);
        setPawImageSpinning(!pawImageSpinning);
    }

    useEffect(() => {
        if (pawImageSpinning) {
            if (!pawImageStyles.includes('cat-paw-spin')) {
                setPawImageStyles(pawImageStyles + ' cat-paw-spin')
            }
        }
        if (!pawImageSpinning) {
            setPawImageStyles(pawImageStyles.replaceAll(' cat-paw-spin', ''))
        }
    }, [pawImageSpinning])

    return (
        <div className='cat-box'>
            <img
                src={require('./cat-paw.png')}
                className={pawImageStyles}
                onClick={handlePawImgClick}
                style={{ pointerEvents: "all" }} />
            <p>If clicked, spin, click again, stop spin.</p>
        </div>
    );
}