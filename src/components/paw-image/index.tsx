import { useEffect, useState } from 'react';

import './paw.css';

interface PawImageProps {
    ignoreClick?: boolean,
    spinning?: boolean
};

export const PawImage = (props: PawImageProps) => {
    const startingPawImageClasses = ['cat-paw', 'select-none']
    const pawSpinClassName = 'cat-paw-spin'

    const [pawImageClasses, setPawImageClasses] = useState(startingPawImageClasses);
    const [pawImageSpinning, setPawImageSpinning] = useState(props.spinning);

    const handlePawImgClick = () => {
        if (props.ignoreClick) {
            return
        }
        setPawImageSpinning(!pawImageSpinning);
    };

    useEffect(() => {
        setPawImageSpinning(props.spinning);
    }, [props.spinning]);

    useEffect(() => {
        console.log(`PawImage: ${pawImageSpinning ? '' : 'not '}spinning`);
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