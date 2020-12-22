import React from 'react';
import { Helmet } from 'react-helmet';
import MDLHeader from '../mdl-header';

export default function MDLiteLayout(props){
    const {children} = props;
    const {className} = props;
    return (
        <div className={`mdl-layout mdl-js-layout color--gray is-small-screen mdl-layout--fixed-header ${className}`} style={{height:"100vh"}}>
            <Helmet>
                <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,300,100,600,700,900" rel="stylesheet" type="text/css"/>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link href="https://fonts.googleapis.com/css?family=Old+Standard+TT" rel="stylesheet"></link>
                <script type="text/javascript" src="https://unpkg.com/@ungap/url-search-params@0.2.2/min.js"/>
            </Helmet>
            <MDLHeader/>
            <main className="mdl-layout__content">
                {children}
            </main>
        </div>
    )
}