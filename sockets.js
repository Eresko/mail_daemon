const express = require('express');
const app = express();
const axios = require('axios');
const env =  require('dotenv').config()
const http = require('http').Server(app);
const { createServer } = require("https");
const fs = require('node:fs');
let id;
let key = "key";
let url = "url";
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
    sendMail(val)
});


const sendMail = async (val) => {
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
