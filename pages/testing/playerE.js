import React from 'react';
import Head from 'next/head';

export default class PlayerE extends React.Component {
    render(){
        return (
            <>
                <Head>
                    <link rel="stylesheet" href="/styles/jwplayer/custom/playerE.css" />
                    <script type="text/javascript" src="/embed/js/testPartner?container_id='iframeContainerId'&testing=1&fit_content=1"/>
                </Head>
                <h1>This is an embed for the player component IFrame</h1>
                <p>
                    Requires to unset styling for width on .css. It will define it as 100% upon initialization.
                    <br/>
                    The height will be set automatically whenever a resize event is changed.
                    <br/>
                    
                    <br/>
                </p>
                <div className="playerIframeContainer" id="iframeContainerId">
                </div>
            </>
        )
    }
}