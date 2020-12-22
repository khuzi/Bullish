import React from 'react';
import Head from 'next/head';

export default class PlayerB extends React.Component {
    render(){
        return (
            <>
                <Head>
                    <link rel="stylesheet" href="/styles/jwplayer/custom/playerB.css" />
                </Head>
                <h1>This is an embed for the player component IFrame</h1>
                <div className="playerIframeContainer">
                    <iframe src="/embed/testPartner"/>
                </div>
            </>
        )
    }
}