const redis = require('redis');

let client = redis.createClient({
  url: process.env.DB_HOST,
  no_ready_check: true,
  auth_pass: process.env.DB_PASSWORD
});

//let client = redis.createClient();

client.on('connect', ()=>{
  console.log('Connected to redis!');
})

module.exports = client;
