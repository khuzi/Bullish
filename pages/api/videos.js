// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SearchManager } from "@lib/searchManager";
import NextCors from "nextjs-cors";

export default async (req, res) => {
	await NextCors(req, res, {
		// Options
		methods: ['GET'],
		origin: '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	});
	//let result = await StockManager.fetchStockWeeklyOcurrences(10, undefined, undefined);
	try {
		let { q, tags, sort, paging } = req.query;
		const { searchResults, resultingPaging } = await SearchManager.search(q, tags, sort, paging);
		res.statusCode = 200
		res.json({ searchResults: searchResults || null, resultingPaging: resultingPaging || null })
	} catch (e) {
		res.statusCode = 500
		res.json({
			error: "Fetching videos"
		});
	}
}
