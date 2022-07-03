const {MongoClient}=require('mongodb');
require('dotenv').config();
const collectionfun=async()=>
{
  
 
  const clients=await MongoClient.connect(process.env.DATABASE_CONNECT_URL);
   const db= clients.db('codesync');
   const codeSync = db.collection('code');
   const clientsSync=db.collection('clients');
   return [codeSync,clientsSync]
}
  

module.exports=collectionfun;

 