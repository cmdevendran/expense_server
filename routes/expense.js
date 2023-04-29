

var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var {MongoClient} = require('mongodb');

var ObjectId = require('mongodb').ObjectId;
const { db } = require('./../config');
var config = require('./../config');


//Connect to db:
const client = new MongoClient(config.db);
client.connect();

// var dbo= MongoClient.connect(config.db, function(err, db) {
//   if (err) throw err;
//   console.log("Database connected!");
//   return db.db("expense_tracker");

  

 
// }); 

//var db = mongojs(config.db);
//var ObjectID = mongojs.ObjectID;

// used to get the categories for expense form
router.post('/getcat/',verifySession,  async function (req, res, next) {
  var session = req.headers.session;
  console.log("within getcat called" + session);


  const dbo = client.db("expense_tracker");

  const coll = await dbo.collection('category').findOne({ "name": "category", "userid":session }, { "categories": 1 });
  if(coll){
    res.status(200).send(coll);

  }else{
    res.status(200).send("Error in getting Collection");

  }

});

// returns the expenses
router.post('/getexpenses/', verifySession, async function (req, res, next) {
  console.log("within Expenses called");
  //console.log(req.body);
//  console.log(req.body.credential.startDate);
  startDate = req.body.startDate;
  endDate = req.body.endDate;
  session = req.headers.session;


  const dbo = client.db("expense_tracker");

  console.log( "in get expenses : "+ startDate +" "+endDate);

  if(!startDate && !endDate) {
      console.log("No start and end date");

      const doccoll =await dbo.collection('expense_entries').find({'userid':session,
      'expdate' :{
        'gte' : (new Date(startDate).toISOString()),
      
        '$lte' :  (new Date(endDate).toISOString())
     }
        }).limit(10).sort({expdate:-1}).toArray();
        return res.status(200).send(doccoll);
        
  } else if(!startDate){
    console.log("only start date");
  
    const doccoll= await dbo.collection('expense_entries').find({'userid':session, 'expdate' :{
      
         '$lte' :  (new Date(endDate).toISOString())
      }
      }).sort({expdate:-1}).toArray();
      if(doccoll){
        return res.status(200).send(doccoll);
      }
      
  }else if(!endDate){
    console.log("only end date" +"session : "+session);
    const doccoll = await dbo.collection('expense_entries').find({'userid':session, 'expdate' :{
      '$gte' : (new Date(startDate).toISOString())
         
      }
      }).sort({expdate:-1}).toArray();
      return res.status(200).send(doccoll);
      

  }else{
    console.log("have both date");
    console.log("have both date"+startDate);
    console.log("have both date"+endDate);
    if(dbo){

      const doccoll =  await dbo.collection('expense_entries').find({'userid':session, 'expdate' :{
        '$gte' : mimicISOString(startDate,"startDate"),
         '$lte' :  mimicISOString(endDate,"endDate") 
         
 
       }
       }).sort({expdate:-1}).toArray();
       return res.status(200).send(doccoll);
    }else{
      throw Error("Issue in getting expenses between date range")
    }
   
      
      // function (err, restaurants) {
      //   if (err) {
      //     console.log(err)
      //     res.send(err);
      //   }
      //   res.json(restaurants);
      //   console.log("From get Restaurant menthod : " + restaurants);
      // });
   }





});




function mimicISOString(date,value) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if(value=="startDate")
        return [year, month, day].join('-') +'T00:00:00.000Z';
    else if(value=="endDate")
         return [year, month, day].join('-') +'T23:59:00.000Z';
        


}

console.log(mimicISOString(new Date()));



// USED to check the session is active or not. if session not available then most of things should not proceed.
async function verifySession (req, res, next) {
  const dbo = client.db("expense_tracker");

  console.log(JSON.stringify(req.headers));
  const session = req.headers.session;
  console.log(" req login 1: " + session);
  if (req.get('session')) {
    const result = await dbo.collection('sessions').findOne({ "session": new ObjectId(session) });
    if(result){
      console.log("verify session : " + JSON.stringify(result));
      return next();

    }else{
      throw Error("issue in getting session");
    }}
    //console.log("verify session 2 : "+JSON.stringify(data));

 
}



function requiresLogin(req, res, next) {
  console.log("requires login");

  console.log(JSON.stringify(req.headers));
  console.log(" req login : " + req.headers.session);

  if (req.session && req.session.userId) {
    console.log("console requires login : " + req.session.userId);
    console.log("console requires login : " + req.session);
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}

router.post('/postexp/',verifySession, async function (req, res, next) {
  const dbo = client.db("expense_tracker");

  var expcat = req.body.expcat;
  var expdate = req.body.expdate;
  var expamount = req.body.expamount;
  var expremark = req.body.expremark;

  var isodate = new Date(expdate).toISOString();
  console.log("iso_expdate : " + isodate)
  const doc = await dbo.collection('expense_entries').insertOne({
    "expcat": req.body.expcat,
    "expdate": isodate,
    "userid":req.headers.session ,
    // "expamount" : req.body.expamount,
    // "expamount" : parseFloat(expamount),
    "expamount": Number(expamount),
    "expremark": req.body.expremark,
    "exppaymentmode" : req.body.exppaymentmode

  });
  res.status(200).send(doc);






});


  /***
   * 
   *  Delete Expense
   * 
   
   */

  router.post('/deleteexp/', verifySession, async function (req, res, next) {
    const dbo = client.db("expense_tracker");


    var session = req.headers.session;
    console.log("within expenses.." + session)

    await dbo.collection('expense_entries').remove({
      "_id": new ObjectId(req.body._id)
    }, function (err, data) {
      if (err) {
        res.send(err);
      }
      res.json(data);

    });



  });

module.exports = router;