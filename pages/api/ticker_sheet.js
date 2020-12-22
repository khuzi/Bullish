// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextCors from "nextjs-cors";

const { get } = require("axios").default;


async function loadTickerSheet() {
    let url = process.env.TICKER_SHEET;
    let { data } = await get(url);
    return data;
}

export default async (req, res) => {
    await NextCors(req, res, {
        // Options
        methods: ['GET'],
        origin: 'http://bullish.studio',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    let data = await loadTickerSheet();
    console.log({data});
    data = data.split("\n").map((line, index) => {
        if (index == 0) {
            return null;
        }
        if (line && line.indexOf(",") > 0) {
            return line.split(",")[0].toUpperCase()
        } else {
            return null;
        }
    }).filter(Boolean);
    res.statusCode = 200
    res.json(data)
}
