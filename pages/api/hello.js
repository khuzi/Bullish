// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextCors from "nextjs-cors";

export default async (req, res) => {
  await NextCors(req, res, {
      // Options
      methods: ['GET'],
      origin: 'http://bullish.studio',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
