const redis = require('redis');

let client = redis.createClient({
  url: process.env.DB_HOST || 'redis://redis-12992.c11.us-east-1-3.ec2.cloud.redislabs.com:12992',
  no_ready_check: true,
  auth_pass: process.env.DB_PASSWORD || 'GEIch6P6j3hqri61we8AFoyy57nVYzJk'
});

//let client = redis.createClient();

client.on('connect', ()=>{
  console.log('Connected to redis!');
})

module.exports = client;
