const fs = require('fs');
const readline = require('readline');

module.exports.ReadData = async function get_data() {
        const fileStreamSQLI = fs.createReadStream('./src/logs/access.txt');

        const rl = readline.createInterface({
            input: fileStreamSQLI,
            crlfDelay: Infinity
        });

        var data = [];

        var patterm_ip = '[0-9]*.[0-9]*.[0-9]*.[0-9]*'
        var patterm_date = '[0-9]{2}/.*/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2}'
        var patterm_link = '(GET|POST|PUT) \/.* HTTP\/1.1'
        //var query = ''

        for await (const line of rl) {
            var ip = line.match(new RegExp(patterm_ip));
            var date = line.match(new RegExp(patterm_date));
            var link = line.match(new RegExp(patterm_link));
            //var query = line.match(new RegExp(query));

            // Pattern for SQLi
            var patterm_Sqli_detect_meta_char = '(\%27)|(\')|(\-\-)|(\%23)|(#)'
            var patterm_Sqli_detect_meta_char_2 = '((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))'
            var patterm_Sqli_detect_typical = '\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))'
            var patterm_Sqli_detect_union = '((\%27)|(\'))union'
            var patterm_Sqli_detect_sqlserver = 'exec(.*)'
            var patterm_Sqli_detect_common = '(ALTER|ORDER BY|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})'
            // Patterm for XSS
            

            if (line.match(new RegExp(patterm_Sqli_detect_meta_char, 'i')) ||
                line.match(new RegExp(patterm_Sqli_detect_meta_char_2, 'i')) ||
                line.match(new RegExp(patterm_Sqli_detect_typical, 'i')) ||
                line.match(new RegExp(patterm_Sqli_detect_union, 'i')) ||
                line.match(new RegExp(patterm_Sqli_detect_sqlserver, 'i')) ||
                line.match(new RegExp(patterm_Sqli_detect_common, 'i'))) { 
                data.push({ 

                //(\%27)|(\')|(\-\-)|(\%23)|(#) -> Detect ' or -- or #
                // ((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;)) -> Detect meta character
                // \w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52)) -> Detect by Typical
                // (ALTER|ORDER BY|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})
                // exec(\s|\+)+(s|x)p\w+ -> SQL server
                time: date,
                ip: ip,
                param: line,
                type: 'sqli' });
            }
            
        }
        return data;
    }