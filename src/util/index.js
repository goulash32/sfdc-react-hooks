import { useContext, useState } from 'react';
import ForceContext from '../context/ForceContext';

const useForceContext = () => {
    return useContext(ForceContext);
};

const useDefaultStates = () => {
    const loadingState = useState(true);
    const errorState = useState(null);
    const dataState = useState(null);

    return { loadingState, errorState, dataState };
}

export {
    useForceContext,
    useDefaultStates
}