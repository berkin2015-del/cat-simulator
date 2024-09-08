import { useEffect, useState } from 'react';

import './paw.css';

export const PawImage = () => {
    const startingPawImageClasses = ['cat-paw', 'select-none']
    const pawSpinClassName = 'cat-paw-spin'

    const [pawImageClasses, setPawImageClasses] = useState(startingPawImageClasses);
    const [pawImageSpinning, setPawImageSpinning] = useState(false);

    const handlePawImgClick = () => {
        console.log(`clicked paw\nspin set to ${!pawImageSpinning}`);
        setPawImageSpinning(!pawImageSpinning);
    };

    useEffect(() => {
        if (pawImageSpinning) {
            if (!pawImageClasses.includes(pawSpinClassName)) {
                setPawImageClasses([...pawImageClasses, pawSpinClassName])
            }
        } else {
            setPawImageClasses(pawImageClasses.filter((i) => { return i !== pawSpinClassName }))
        }
    }, [pawImageSpinning]);

    return (<img
        alt="paw"
        src={require('./paw.png')}
        className={pawImageClasses.join(' ')}
        onClick={handlePawImgClick}
        draggable="false"
    />);
}