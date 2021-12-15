const fs = require('fs');
const readline = require('readline');
const syncdata = require('./ReadData.js')

class QueryController {
    async index(req, res) {
        let data = await syncdata.ReadData();
        //res.render('sqli', { sqli: sqli, no_sqli: no_sqli });
        res.render('sqli', { data : data });
    }    
}

module.exports = new QueryController;