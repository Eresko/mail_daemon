const express = require('express');
const app = express();
const axios = require('axios');
const env =  require('dotenv').config()
const http = require('http').Server(app);
//const https = require('node:https');
const { createServer } = require("https");
const fs = require('node:fs');
let id;
let key = "6zaoern956a6kejnckduaawc64xrmezfrkpjyc9y";
let url = "https://go2.unisender.ru/ru/transactional/api/v1/email/send.json";
// открываем соединение socket.io
const client  = require('redis').createClient({
    socket: {
        host: process.env.HOST_REDIS,
        port: process.env.PORT_REDIS,
    }
});

const subscriber = client.duplicate();

subscriber.connect();


subscriber.subscribe(process.env.CHANEL_REDIS, (message) => {
    let val = JSON.parse(message)
    console.log(val);
    sendMail(val)
});


const sendMail = async (val) => {
    // const httpsAgent = new https.Agent({
    //     rejectUnauthorized: false,
    // })
    // axios.defaults.httpsAgent = httpsAgent
    let res = await axios.post(
        url,
        {
            'message' : val
        },
        {headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/jso',
            'X-API-KEY' : key,
        }}
    )
    console.log("mail = ",res);
}

const port = process.env.PORT || 8881;

http.listen(port,
    function() {
        console.log('Listen at ' + port);
    }
);