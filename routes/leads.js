const express = require('express');
const router = express.Router();
const rHelpers = require('../redis-helpers');
const leadServices = require('../services/lead-services');

let isLeadValidate = (data) =>{
  let statusObj = {};
  if(data.first_name && data.last_name && data.email && data.mobile && data.location_type && data.location_string){
    if(data.mobile.length === 10){
      statusObj.status = true;
    } else{
      statusObj = { status: false, error: 'Mobile number should be of 10 digits!'};
    }
  } else{
    statusObj = { status: false, error: 'insufficient Data!'};
  }
  return statusObj;
}

let createLeadObj = (values) =>{
  let obj = {
    id: values[0],
    first_name: values[1] ,
    last_name: values[2],
    mobile: values[3],
    email: values[4],
    location_type: values[5],
    location_string: values[6],
    status: values[7]
  };
  if(values[8]){
    obj.communication = values[8]
  }
  return obj;
}

router.post('/', (req, res, next) => {
  let data = JSON.parse(JSON.stringify(req.body));
  let validationObj = isLeadValidate(data);
  console.log('post /:lead_id', data);
  if(validationObj.status){
    console.log('post /:lead_id Object validated');
    rHelpers.isHashFieldAlreadyExists('emails', data.email)
    .then( ()=> {
      return rHelpers.isHashFieldAlreadyExists('mobiles', data.mobile);
    })
    .then( () =>{
      data.status = 'Created';
      return rHelpers.setLeadsHash('lead', data);
    })
    .then( () => {
      console.log('ALL SET')
      res.status(201);
      res.data = data;
      next();
    })
    .catch((err) => {
      res.status(400);
      res.data = {status: 'failure', reason: err};
      next();
    })
  } else{
    res.status(400);
    res.data = {status: 'failure', reason: validationObj.error};
    next();
  }
})

router.get('/:lead_id', (req, res, next) =>{
  let id = req.params.lead_id;
  console.log(' get /:lead_id', id);
  if(id){
    rHelpers.getValuesFromHash('lead' + id)
    .then((result) => {
      console.log(' get /:lead_id', result);
      if(result){
        res.status(200);
        res.data = result;
        next();
      } else{
        res.status(404);
        res.data = {};
        next();
      }
    })
    .catch((err) =>{
      res.status(400);
      res.data = {status: 'failure', reason: err};
      next();
    })
  } else{
    res.status(400);
    res.data = {status: 'failure', reason: 'lead_id is not present!'};
    next();
  }
})

router.put('/:lead_id', (req, res, next) =>{
  let id = req.params.lead_id;
  console.log(' put /:lead_id', id);
  let data = req.body;
  if(id){
    let validationObj = isLeadValidate(data);
    if(validationObj.status){
      leadServices.updateLeadRecord(rHelpers, id, data)
      .then( (status) => {
        res.status(202);
        res.data = {status: 'success'};
        next();
      })
      .catch((err) =>{
        res.status(400);
        res.data = {status: 'failure', reason: err.message};
        next();
      })
    }
  } else{
    res.status(400);
    res.data = {status: 'failure', reason: 'lead_id is not present!'};
    next();
  }
})

router.delete('/:lead_id', (req, res, next) =>{
  let id = req.params.lead_id;
  console.log('delete /:lead_id', id);
  if(id){
    leadServices.deleteLeadRecord(rHelpers, id)
    .then(()=>{
      res.status(200);
      res.data = {status: 'success'};
      next();
    })
    .catch((err) =>{
      res.status(400);
      res.data = {status: 'failure', reason: err};
      next();
    })
  } else{
    res.status(400);
    res.data = {status: 'failure', reason: 'lead_id is not present!'};
    next();
  }
})

module.exports = router;
