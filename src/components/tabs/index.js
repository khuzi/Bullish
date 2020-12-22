import React from 'react';
import Link from 'next/link';
import { ROUTES } from '../../const';

export default function MDLTabs(props){
    const {active} = props;
    let stockClass = active === "stocks" ? 'active' : '';
    let marketClass = active === "market" ? 'active' : '';
    return (
        <div className="mdl-tabs mdl-tabs mdl-js-tabs pages-tabs">
            <div className="mdl-tabs__tab-bar">
                <Link href={ROUTES.TWEET}>
                    <a className={`mdl-tabs__tab ${stockClass}`}>
                        Stock
                    </a>
                </Link>
                <Link href={ROUTES.MARKET}>
                    <a className={`mdl-tabs__tab ${marketClass}`}>
                        Market
                    </a>
                </Link>
            </div>
        </div>
    );
}