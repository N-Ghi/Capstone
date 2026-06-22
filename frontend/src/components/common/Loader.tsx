import React from 'react';
import { LoaderIcon } from './Icons';
import styles from './Loader.module.css';

const Loader: React.FC = () => {
    return (
        <div className={styles['loader-container']}>
            <div className={styles['loader-ring']}>
                <div className={styles['loader-ring__arc']} />
                <div className={styles['loader-ring__arc']} />
                <div className={styles['loader-ring__arc']} />
            </div>
            <div className={styles['loader-icon-wrap']}>
                <LoaderIcon />
            </div>
        </div>
    );
};

export default Loader;