import { EmbedManager } from 'src/lib/embedManager';
const fs = require("fs");

export default class JSImport {

}

export async function getServerSideProps({res, query}) {
    let baseEmbed = fs.readFileSync("public/js/embed/base.js").toString();
    let embed = await EmbedManager.getVideoPlayerEmbed(query, baseEmbed);
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.write(embed);
    res.end();
    
    return {
        props:{}
    }; // it never reaches here but required as getInitialProps need to return object.
}