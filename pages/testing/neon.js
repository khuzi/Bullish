import React from 'react';
import Head from 'next/head';

export default class Neon extends React.Component {

    render(){
        return (
            <>
                <Head>
                    <link rel="stylesheet" href="/styles/neon.css" />
                </Head>
                <div className="neon-effect">
                    <div className="neon" style={{width:'200px', height:'200px', border:'4px solid white'}}>
                        
                    </div>
                    <div className="gradient"></div>
                    <div className="spotlight"></div>
                </div>
            </>
        );
    }
}