import React from 'react';
import Head from 'next/head';
import Link from 'next/link'

export default function StockWidget(props) {

const { ticker, tweets, logo } = props.tag;

    return (
        <>  
            <Head> <link rel="stylesheet" href="/styles/stock-widget.css"/> </Head>
            <div className={`stock-widget-container ${props.className || ''}`} >
                <Link href={`/stocks/${ticker}`}>
                <div href="" className="stock-widget-link" >
                    <h6 >{ticker || "Ticker" }</h6>
                    <img src={logo || "/images/stock_icon.png"} alt="" className="img-fluid"  />
                    <p >{tweets} people are talking about this</p>
                </div>
                </Link>
            </div>
        </>
    )
}