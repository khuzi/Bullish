import React from 'react';
import HeadComponent from '../../src/components/head';
import MDLiteLayout from "../../src/components/layout/mdlite";
import MDLTabs from "../../src/components/tabs";
import TweetTable from "../../src/components/stockPage/table";
import Footer from '../../src/components/footer';
import { MetaFetcher } from 'src/lib/metaFetcher';
import { HeadsImport } from 'src/lib/headsImports';

export default class StockPage extends React.Component {


	render() {
		return (
			<>
				<HeadComponent meta={this.props.meta} cssImports={HeadsImport.pageImports.css['stock']} />
				<MDLiteLayout className="stock-page">
					<MDLTabs active="stocks" />
					<TweetTable API_ENDPOINT={this.props.API_ENDPOINT}  STOCK_ENDPOINTS={this.props.STOCK_ENDPOINTS}/>
					<div id='footer-cont'>
						<Footer />
					</div>
				</MDLiteLayout>
			</>
		)
	}
}

export async function getServerSideProps() {
	const meta = await MetaFetcher.fetchPageData('stock');
	return {
		props: {
			meta: meta,
			API_ENDPOINT: process.env.REACT_APP_API_END,
			STOCK_ENDPOINTS: {
				STOCK_MARKET_DESCRIPTION_END: process.env.STOCK_MARKET_DESCRIPTION_END,
				STOCK_MARKET_PRICE_END: process.env.STOCK_MARKET_PRICE_END,
			}
		}
	}
}