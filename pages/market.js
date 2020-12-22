import React from 'react';
import HeadComponent from '../src/components/head';
//import Markeponents/stockPage/ridgelineChart';
import RidgelineChart from '../src/components/stockPage/ridgelineChart'
import Market from '@components/marketSummary/market';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';
import { JSONLDManager } from 'src/lib/jsonldManager';

export default class MarketPage extends React.Component {


	render() {
		return (
			<>
				<HeadComponent meta={this.props.meta} jsonLD={this.props.jsonLD} cssImports={HeadsImport.pageImports.css['market']}/>
				<Market API_ENDPOINT={this.props.API_ENDPOINT}/>
			</>
		)
	}
}

export async function getServerSideProps() {
	const meta = await MetaFetcher.fetchPageData('market');
	let jsonLD = JSONLDManager.getPageData();

	return {
		props: {
			meta:meta,
			API_ENDPOINT: process.env.REACT_APP_API_END,
			jsonLD
		}
	}
}