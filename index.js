const axios = require('axios')
const cheerio = require('cheerio')
const exp = require('constants')
const express = require('express')
// var Regex = require("regex")
// var regex = new Regex(/Win Rate\d{2} %/)

const re = 'Win Rate[0-9]{2} %'
// const str = 'Profile2188FP-points100RankMasterLevelLvl 40ttvOmbeagle#M6EP4NQTotal Battles2315No. Of Wins1459Total Win Rate63 %'
// const myArray = str.match(re)
// console.log(myArray[0])

const PORT = 8000

const app = express()

const url = "https://www.theguardian.com.au/"
const url1 = "https://uniteapi.dev/p/ttvOmbeagle"


axios(url1)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        const rankings = []
        $('p.sc-b9e9ff3d-2.dnFSby', html).each(function() {
            const elo = $(this).text()
            console.log("Elo",elo)
            rankings.push(elo)
        })

        $('div.sc-4c7411ed-0.bFVGxH', html).each(function() {
            const divText = $(this).find('p').text()
            const winRate = divText.match(re)
            if (winRate) {
                winPercent = winRate[0].slice(8,12)
                console.log("Win Rate", winRate[0].slice(8,12))
                rankings.push(winPercent)
            }
            
        })
        
        console.log('Rankings',rankings)
    }).catch(err => console.log(err))

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
