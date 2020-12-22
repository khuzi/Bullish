import React from 'react';
import Head from 'next/head';

export default class PlayerD extends React.Component {
    render(){
        return (
            <>
                <Head>
                    <link rel="stylesheet" href="/styles/jwplayer/custom/playerD.css" />
                    <script type="text/javascript" src="https://bullish.studio/embed/js/testPartner?container_id='iframeContainerId'"/>
                </Head>
                <h1>This is an embed for the player component IFrame</h1>
                <div className="playerIframeContainer" id="iframeContainerId">
                </div>
            </>
        )
    }
}