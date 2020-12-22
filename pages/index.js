import React from 'react';
import { HeadsImport } from 'src/lib/headsImports';
import { MetaFetcher } from 'src/lib/metaFetcher';
import HeadComponent from '../src/components/head';
import Market from '../src/components/marketSummary/market';

export default class Index extends React.Component {

	render() {
		return (
			<>
				<HeadComponent meta={this.props.meta} cssImports={HeadsImport.pageImports.css['market']}/>
				<Market API_ENDPOINT={this.props.API_ENDPOINT} />
			</>
		)
	}
}

export async function getServerSideProps(...ctx) {
	const meta = await MetaFetcher.fetchPageData('index');
	return {
		props: {
			meta: meta,
			API_ENDPOINT: process.env.REACT_APP_API_END
		}
	}
}