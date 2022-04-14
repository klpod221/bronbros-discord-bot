require('dotenv').config();
const fs = require('fs');

let RULE34_PAGE = 0;
fs.readFile('./page.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    RULE34_PAGE = parseInt(data);
});

const axios = require('axios');
const Discord = require('discord.js');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    switch (msg.content) {
        case '!ping':
            msg.reply('Pong!');
            break;

        case '!meme':
            msg.reply("Here's your meme!");
            const imgUrl = await getMeme(msg);
            msg.channel.send(imgUrl);
            break;

        case '!hentai':
            msg.channel.send("Here's your rule34 image!");
            await rule34(msg);
            break;

        case '!brobothelp':
            let helpMessage = '!ping: just a Pong message.\n';
            helpMessage += '!meme: get a random meme.\n';
            helpMessage +=
                '!hentai: get a random rule34 genshin impact image.\n';
            helpMessage += '!brobothelp: this message.\n';

            msg.reply(helpMessage);
            break;
    }
});

async function sendErr(msg) {
    try {
        msg.channel.send('Error! Please try again later.');
    } catch {
        console.error(err);
    }
}

async function getMeme(msg) {
    try {
        const res = await axios.get('https://meme-api.herokuapp.com/gimme');
        return res.data.url;
    } catch (err) {
        console.error(err);
        sendErr(msg);
    }
}

async function rule34(msg) {
    try {
        url =
            'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1' +
            '&tags=' +
            process.env.RULE34_TAG +
            '&limit=' +
            process.env.RULE34_LIMIT +
            '&pid=' +
            RULE34_PAGE;

        const res = await axios.get(url);

        RULE34_PAGE++;
        fs.writeFile('./page.txt', RULE34_PAGE.toString(), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.data.forEach((img) => {
            let split = img.file_url.split('.');
            let ext = split[3];
            if (
                ext === 'mp4' ||
                ext === 'webm' ||
                ext === 'mov' ||
                ext === 'wmv' ||
                ext === 'avi' ||
                ext === 'flv' ||
                ext === 'mkv'
            )
                return;
            else msg.channel.send(img.file_url);
        });
    } catch (err) {
        console.error(err);
        sendErr(msg);
    }
}

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
