import { Utils } from '@components/common/util';
import React from 'react';


export class ResponsiveAd extends React.Component {

    componentDidMount(){
        Utils.WaitForCondition(() => {
            return !!window.adsbygoogle;
        })
        .then(()=>{
            (adsbygoogle = window.adsbygoogle || []).push({});
        })
        .catch(()=>{
            console.log("Error...");
        })
    }

    render(){
        return (
            <ins class="adsbygoogle"
                style={{display:"block", background:"black"}}
                adtest="on"
                google_adtest="on"
                data-ad-test="on"
                data-ad-client="ca-pub-6005266360791261"
                data-ad-slot="1021534529"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        )
    }
}