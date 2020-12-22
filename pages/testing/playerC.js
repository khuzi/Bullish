import React from 'react';
import Head from 'next/head';

export default class PlayerB extends React.Component {
    render(){
        return (
            <>
                <Head>
                    <link rel="stylesheet" href="/styles/jwplayer/custom/playerC.css" />
                    <script type="text/javascript" src="/embed/js/testPartner?container_id='iframeContainerId'&testing=1"/>
                </Head>
                <h1>This is an embed for the player component IFrame UPDATED</h1>
                <div className="playerIframeContainer" id="iframeContainerId">
                </div>
            </>
        )
    }
}