const { Client } = require("@notionhq/client");
const fs = require("fs")
const token = "secret_YeRe1CA0qeoZH0Kpv3aX5wpSm4xe2EQgetdFUE7T9Du";
const database_id = "d4e4d6a2b41349a394dfd766566ebf8b";
let notion = new Client({ auth: token });
const Languages = [
    { name: "English", symbol: "en",messages:{} },
    { name: "Chinese", symbol: "zh_CN",messages:{} },
    { name: "Japanese", symbol: "ja" ,messages:{}},
    { name: "Spanish", symbol: "es" ,messages:{}},
]

function getPropertyPlainText(property) {
    let arr = property.title || property.rich_text;
    if (arr.length == 0) return "";
    return arr[0].plain_text;
}

let run = async () => {
    let langMap = {};
    Languages.forEach(v => {
        langMap[v.name] = v;
    })
    let data = await notion.databases.query({
        database_id
    })
    data.results.forEach((v) => {
        Languages.forEach(lang => {
            let key = getPropertyPlainText(v.properties['Name'])
            if (key) {
                lang.messages[key] = {
                    message:getPropertyPlainText(v.properties[lang.name])
                }
            } else {
                console.error("Invalid Key!",key)
            }
        })
    })
    Languages.forEach(lang => {
        fs.mkdirSync(`./_raw/_locales/${lang.symbol}/`,{recursive:true})
        fs.writeFileSync(`./_raw/_locales/${lang.symbol}/messages.json`,JSON.stringify(lang.messages))
    })
}
run();