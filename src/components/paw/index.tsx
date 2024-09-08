import { useEffect, useState } from 'react';
import './paw.css';

export const Paw = () => {

    const [pawImageStyles, setPawImageStyles] = useState('cat-paw');
    const [pawImageSpinning, setPawImageSpinning] = useState(false);

    const handlePawImgClick = () => {
        console.log(`clicked paw\nspin set to ${!pawImageSpinning}`);
        setPawImageSpinning(!pawImageSpinning);
    };

    useEffect(() => {
        if (pawImageSpinning) {
            if (!pawImageStyles.includes('cat-paw-spin')) {
                setPawImageStyles(pawImageStyles + ' cat-paw-spin')
            }
        } else {
            setPawImageStyles(pawImageStyles.replaceAll(' cat-paw-spin', ''))
        }
    }, [pawImageSpinning, pawImageStyles]);

    return (
        <div className='cat-box'>
            <h1>Hello World</h1>
            <img
                alt="paw"
                src={require('./paw.png')}
                className={pawImageStyles}
                onClick={handlePawImgClick}
            />
            <p>click, spin, click again, stop spin.</p>
        </div>
    );
}