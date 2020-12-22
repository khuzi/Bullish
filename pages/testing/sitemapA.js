import React from 'react';
import { SitemapManager } from 'src/lib/sitemapManager';


export default class SiteMapBuilder extends React.Component {

    render(){
        return (
            <pre>
                {this.props.xml}
            </pre>
        )
    }
}

export async function getServerSideProps(){
    const meta = await SitemapManager.generateSitemap();
    return {
        props: {
            xml: meta
        }
    }
}