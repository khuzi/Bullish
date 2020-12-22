import React from 'react';
import Head from 'next/head';

export default class NeonB extends React.Component {

    componentDidMount(){
        window['jwplayer']("playerDiv").setup({
            "file": "https://cdn.jwplayer.com/videos/DOh8Q1Ta-WK8AD8mT.mp4",
            "image": "https://cdn.jwplayer.com/v2/media/DOh8Q1Ta/poster.jpg?width=720",
            title: `We're three friends who turned $30,000 into $30,000,000 using nothing more than Twitter and a 0% commission trading account. Dumb Money looks to consumer behavior that could be tied to an increasing stock. 
            
            Chris Camillo, Dave Hanson, and Jordan Mclain bring a different sense of observation to investing in the stock market. It's that simple. Anybody can do it: we're Dumb Money.`,
            description: `There’s a euphoric market for electric vehicles. New companies with small track records and giant ambitions are testing the waters of the stock market to raise funds and capitalize on the excitement. One of the emerging electric vehicle (EV) companies on investors’ radars is Fisker, which hopes to capture a significant share of the market with a business model far different from Tesla’s. 
            
            Dion Rabouin, Host of Voices of Wall Street and Markets Editor at Axios, spoke with Henrik Fisker, founder and CEO of Fisker, about how the company plans to ramp up production at a faster rate than Tesla did, why it’s low pricing puts its Fisker Ocean SUV in a league of its own and how a Biden presidency impacts the electrification of the automobile industry.`
        });
    }

    render(){
        return (
            <>
                <Head>
                    <link rel="stylesheet" href="/styles/neon.css" />
                    <script type="text/javascript" src="https://cdn.jwplayer.com/libraries/Tn3rw6a4.js" />
                    <link rel="stylesheet" href="/styles/jwplayer/custom/player1.css" />
                </Head>
                <div className="neon-effect neon-player" style={{
                    width: "100%"
                }}>
                    <div className="neon" style={{width:'100%', height:'auto', border:'6px solid white'}}>
                        <div id="playerDiv"/>
                    </div>
                    <div className="gradient"></div>
                    <div className="spotlight"></div>
                </div>
            </>
        );
    }
}