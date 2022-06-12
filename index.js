const axios = require('axios')
const cheerio = require('cheerio')
const exp = require('constants')
const express = require('express')
const fs = require('fs-extra')
const path = require('path')

const re = 'Win Rate[0-9]{2} %'
// const str = 'Profile2188FP-points100RankMasterLevelLvl 40ttvOmbeagle#M6EP4NQTotal Battles2315No. Of Wins1459Total Win Rate63 %'
// const myArray = str.match(re)
// console.log(myArray[0])

const PORT = 8000

const app = express()

const url = "https://www.theguardian.com.au/"
const url1 = "https://uniteapi.dev/p/ttvOmbeagle"
const url2 = "https://uniteapi.dev/p/UntamedTheG"
const url3 = "https://uniteapi.dev/p/TofuBean"


const urls = ["https://uniteapi.dev/p/ttvOmbeagle", "https://uniteapi.dev/p/UntamedTheG", "https://uniteapi.dev/p/TofuBean"]

// const ombeagle = cheerio.load(`
// <meta name="viewport" content="width=device-width"/><meta charSet="utf-8"/><meta name="description"/><meta itemProp="name"/><meta name="twitter:site" content="@uniteapi"/><meta name="twitter:title"/><meta name="twitter:description"/><meta name="twitter:creator" content="@uniteapi"/><meta name="twitter:image:src"/><meta name="twitter:card" content="summary_large_image"/><meta name="og:type" content="website"/><meta name="og:url" content="uniteapi.dev/p/ttvOmbeagle"/><meta name="og:image"/><meta name="og:description"/><meta name="og:site_name" content="Unite Api"/><meta name="og:published_time" content="2022-06-06T10:50:05.477Z"/><meta name="og:modified_time" content="2022-06-06T10:50:05.477Z"/><script type="application/ld+json">{"@context":"http://schema.org","@type":"page","url":"uniteapi.dev/p/ttvOmbeagle"}</script><meta content="Unite API - ttvOmbeagle (M6EP4NQ)" property="og:title"/><meta content="Pokémon Unite : Lv.40 Master 2188
// Battles : 2315
// Wins : 1459
// Win Rate : 63" property="og:description"/><link rel="preload" as="image" imagesrcset="/_next/image?url=%2FSprites%2Ft_CreateRole_female3_1.png&amp;w=256&amp;q=75 1x, /_next/image?url=%2FSprites%2Ft_CreateRole_female3_1.png&amp;w=384&amp;q=75 2x"/><meta name="next-head-count" content="21"/>`);

// myArray = (ombeagle("meta[property='og:title']").attr("content"))
// // console.log(myArray)
// const re_name = '- [a-zA-Z0-9]{0,12}'
// var profile = myArray.match(re_name)
// profile = profile[0].slice(2)
// console.log(profile)

// myEloArray = (ombeagle("meta[property='og:description']").attr("content"))
// const re_elo = '[0-9]{4}'
// const re_winrate = 'Win Rate : [0-9]{2}'
// var elo = myEloArray.match(re_elo)
// elo = elo[0]
// const winrate = myEloArray.match(re_winrate)
// winPercent = winrate[0].slice(11,13)
// // console.log(elo[0])
// // console.log(winPercent)

// var unitePro = ''
// const uniteProfile = {profile, elo, winPercent}
// unitePro = unitePro.concat(profile, ', ', elo, ', ', winPercent, '\n')
// console.log(uniteProfile)
// console.log(unitePro)
// fs.writeFile(path.join('/GitPos/oce-unite-leaderboard', 'uniteapi.txt'), unitePro, {flag: 'a+'}, err => {
//     if(err) {
//         console.error(err)
//     }
// });


const getUniteApiData = async (url) => {
    try {
        const {data} = await axios.get(url);
        // const html = response.data
        const $ = cheerio.load(data)
        const uniteProfile = {};

        myArray = ($("meta[property='og:title']").attr("content"))
        // console.log(myArray)
        const re_name = '- [a-zA-Z0-9]{0,12}'
        var profile = myArray.match(re_name)
        profile = profile[0].slice(2)

        myEloArray = ($("meta[property='og:description']").attr("content"))
        const re_elo = '[0-9]{4}'
        const re_winrate = 'Win Rate : [0-9]{2}'
        var elo = myEloArray.match(re_elo)
        elo = elo[0]
        const winrate = myEloArray.match(re_winrate)
        winPercent = winrate[0].slice(11,13)
        uniteProfile[profile] = [elo, winPercent]

        return uniteProfile

    } catch(error) {
        console.log(error)
    }
}

let rankingData = []
for (let i=0; i< urls.length; i++) {
    getUniteApiData(urls[i])
    .then((uniteProfile) => {
        rankingData.push(uniteProfile)
        console.log(rankingData)
    })
}

// Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'oce-rankings','index.html'));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
