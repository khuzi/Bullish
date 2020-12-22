// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ArticleManager } from "@lib/articleManager";
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
        paging = isNaN(parseInt(paging)) ? 1 : parseInt(paging);
        let posts = await ArticleManager.searchPosts(paging, undefined, q || "");
        let returnPosts = JSON.parse(JSON.stringify(posts));
		res.statusCode = 200;
		res.json(returnPosts)
	} catch (e) {
		res.statusCode = 500;
		res.json({
			error: "Fetching videos"
		});
	}
}
