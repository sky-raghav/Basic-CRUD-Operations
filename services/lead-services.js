
const deleteLeadRecord = (client, id) =>{
  let cVal = [];
  return client.getValuesFromHash('lead' + id, ['email', 'mobile'])
  .then((values) => {
    cVal = values;
    return client.deleteFieldsFromHash('emails', cVal[0])
  })
  .then(() => client.deleteFieldsFromHash('mobiles', cVal[1]))
  .then(() => client.deleteFieldFromRedis('lead' + id))
  .catch((err)=>{
    throw err;
  })
}

const updateLeadRecord = (client, id, data) =>{
  let cVal = [];
  let mobileObj = {};
  mobileObj[data.mobile] = id;
  let emailObj = {};
  emailObj[data.email] = id;
  return client.getValuesFromHash('emails', data.email)
  .then((fetchedId)=> {
    console.log('fetchedIdEmails::', fetchedId.indexOf(null));
    if(fetchedId.indexOf(null) < 0 && (fetchedId.length >= 2 || fetchedId.indexOf(id) < 0)){
      throw new Error('email is already registered by some other user!');
    } else{
      return client.getValuesFromHash('mobiles', data.mobile);
    }
  })
  .then((fetchedId) =>{
    console.log('fetchedIdMobile::', fetchedId);
    if(fetchedId.indexOf(null) < 0 && (fetchedId.length >= 2 || fetchedId.indexOf(id) < 0)){
      throw new Error('Mobile number is already registered by some other user!');
    } else{
      return client.getValuesFromHash('lead' + id, ['email', 'mobile']);
    }
  })
  .then((values) => {
    cVal = values;
    return client.deleteFieldsFromHash('emails', cVal[0])
  })
  .then(() => client.deleteFieldsFromHash('mobiles', cVal[1]))
  .then(() => client.setValueInAnyHash('mobiles', mobileObj ))
  .then(() => client.setValueInAnyHash('emails', emailObj ))
  .then(() => client.setValueInAnyHash('lead' + id, data))
  .catch((err)=>{
    throw err;
  })
}

module.exports ={
  deleteLeadRecord: deleteLeadRecord,
  updateLeadRecord: updateLeadRecord
}
