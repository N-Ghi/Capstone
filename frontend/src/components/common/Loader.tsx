import React from 'react';
import { LoaderIcon } from './Icons';

const Loader: React.FC = () => {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            < LoaderIcon />
        </div>
    );
};

export default Loader;