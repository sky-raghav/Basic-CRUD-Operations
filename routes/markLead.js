const express = require('express');
const router = express.Router();
const rHelpers = require('../redis-helpers');

router.put('/:lead_id', (req, res, next) =>{
  let id = req.params.lead_id;
  console.log(' put mark lead /:lead_id', id);
  let data = {
    status: 'Contacted',
    communication: req.body.communication
  }
  if(id){
      rHelpers.setValueInAnyHash('lead' + id, data)
      .then(()=>{
        res.status(202);
        res.data = data;
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
