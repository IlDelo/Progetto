const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const PORT = 5000;
const app = express();

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/api/cat", async (req, res) => {
    try{
        const cat = await getCat();
        return res.status(200).json({
            response: cat,
        });
    } catch (err) {
        return res.status(500).json({
            err: err.toString()
        });
    }
});

async function getCat() {
    
    const url = "http://albo.comune.parma.it/Affissione/parma/Page";
    
    try {
        const res = await axios.get(url);
        const htmlData = res.data;
        const $ = cheerio.load(htmlData);
        const cat = [];
        const listItem = $('#sidebar > ul > li:nth-child(1) > ul > li');

        listItem.each((i, el) => {
            const c = $(el).text();
            const l = $(el).children("a").attr("href");
            cat.push({c: c, l: l});
        });

        return cat;
    
    } catch (error) {
        console.error(error)
    }
}

app.get("/api/doc/", async (req, res) => {
    try{
        const cat = req.params.cat;
        const doc = await getAllDoc(`/Affissione/parma/Page`);
        return res.status(200).json({
            result: doc,
        });
    } catch (err) {
        return res.status(500).json({
            err: err.toString()
        });
    }
});

async function getAllDoc(dir) {
    
    const url = "http://albo.comune.parma.it" + dir;

    try {
        const res = await axios.get(url);
        const htmlData = res.data;
        const $ = cheerio.load(htmlData);
        const doc = [];
        const listItem = $('div[class=post]');

        listItem.each((i, el) => {
            const cat = $(el).children('h2').children('a').text();
            const link = $(el).children('h2').children('a').attr('href');
            const dataIn = $(el).children('p').text().split("\n")[1].trim();
            const dataFin = $(el).children('p').text().split("\n")[2].trim();
            const posted = $(el).children('p').children('span').text();
            const descr = $(el).children('div[class=entry]').text().replace(/\n/g, ' ').trim();
            doc.push({cat: cat, link: link, dataIn: dataIn, dataFin: dataFin, posted: posted, descr: descr});
        });

        return doc;
    
    } catch (error) {
        console.error(error)
    }
}

app.get("/api/doc/:cat", async (req, res) => {
    try{
        const cat = req.params.cat;
        const doc = await getDocByCat(`/Affissione/parma/${cat}/Page`);
        return res.status(200).json({
            result: doc,
        });
    } catch (err) {
        return res.status(500).json({
            err: err.toString()
        });
    }
});

async function getDocByCat(dir) {
    
    const url = "http://albo.comune.parma.it" + dir;

    try {
        const res = await axios.get(url);
        const htmlData = res.data;
        const $ = cheerio.load(htmlData);
        const doc = [];
        const listItem = $('div[class=post]');

        listItem.each((i, el) => {
            const cat = $(el).children('h2').children('a').text();
            const link = $(el).children('h2').children('a').attr('href');
            const dataIn = $(el).children('p').text().split("\n")[1].trim();
            const dataFin = $(el).children('p').text().split("\n")[2].trim();
            const posted = $(el).children('p').children('span').text();
            const descr = $(el).children('div[class=entry]').text().replace(/\n/g, ' ').trim();
            doc.push({cat: cat, link: link, dataIn: dataIn, dataFin: dataFin, posted: posted, descr: descr});
        });

        return doc;
    
    } catch (error) {
        console.error(error)
    }
}
  

app.get("/api/infoDoc/:l", async (req, res) => {
    try{
        const l = req.params.l;
        const info = await getInfoDoc(`/Affissione/parma/${l}`);
        return res.status(200).json({
            result: info,
        });
    } catch (err) {
        return res.status(500).json({
            err: err.toString()
        });
    }
});

async function getInfoDoc(dir) {
    
    const url = "http://albo.comune.parma.it" + dir;

    try {
        const res = await axios.get(url);
        const htmlData = res.data;
        const $ = cheerio.load(htmlData);
        const listItem = $('div[class=row]');

        nProt = $(listItem[0]).children('div[class=firstvalue]').text().trim();
        enteRic = $(listItem[2]).children('div[class=value]').text().trim();
        uffRic = $(listItem[3]).children('div[class=value]').text().trim();
        enteEmi = $(listItem[4]).children('div[class=value]').text().trim();
        uffEmi = $(listItem[5]).children('div[class=value]').text().trim();
        tipoAtto = $(listItem[6]).children('div[class=value]').text().trim();
        dataIn = $(listItem[8]).children('div[class=firstvalue]').text().trim();
        dataScad = $(listItem[9]).children('div[class=secondvalue]').text().trim();
        ogg = $(listItem[10]).children('div[class=value]').text().trim();
        linkDoc = $('#sidebar > ul > li > ul > li > a').attr('href');

        const info = {nProt: nProt, enteRic: enteRic, uffRic: uffRic, enteEmi: enteEmi, uffEmi: uffEmi, tipoAtto: tipoAtto, dataIn: dataIn, dataScad: dataScad, ogg: ogg, linkDoc: linkDoc}

        return info;
    
    } catch (error) {
        console.error(error)
    }
}
 


