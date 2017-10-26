var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('./../config');


//var db = mongojs('mongodb://user:password@ds161262.mlab.com:61262/sgrestaurant',['restaurants']);

var db = mongojs(config.db);
var ObjectID = mongojs.ObjectID;




// Get All Tasks
router.get('/restaurant', function(req, res, next) {

  db.restaurants.find({} ,{ name:1 },function(err, restaurants) {
    if (err) {
      res.send(err);
    }
    res.json(restaurants);
    console.log(restaurants);
  });
});

// get restaurants for userid

router.get('/restaurant/:id', function(req, res, next) {
  //db.restaurants.findOne({"staff.staffid":"HMxFSQyw2QcXkRbCju1R0DLJA6x2", "staff.role":5})
  console.log("id : " + req.params.id);
  db.restaurants.findOne({
    "staff.staffid": req.params.id,
    "staff.role": 5
  }, {
    "name": 1,
    "menucategory": 1
  }, function(err, restaurants) {
    if (err) {
      res.send(err);
    }
    res.json(restaurants);
    console.log("From get Restaurant menthod : "+restaurants);
  });

});

// get menus for restuarant - used in rest admin app
router.post('/restaurant/getrest/:id', function(req, res, next) {
  //db.restaurants.findOne({"staff.staffid":"HMxFSQyw2QcXkRbCju1R0DLJA6x2", "staff.role":5})
  console.log("id : " + req.params.id);
  db.restaurants.findOne({
    "staff.staffid": req.params.id,
    "staff.role": 5
  }, {
    "name": 1,
    "menucategory": 1,
    "menuitem":1
  }, function(err, restaurants) {
    if (err) {
      res.send(err);
    }
    res.json(restaurants);
    console.log("From get Restaurant menthod : "+restaurants);
  });

});

//Add a new Restaurant
router.post('/restaurant/', function(req, res, next) {
        //create a new object id
          debugger;
        var vrestaurant = req.body;
        console.log("CREATING NEW RESTAURANT " + vrestaurant);
        //  console.log("insid menu category  : "+menuCategory.menuCat1.category);
        var isodate = new Date().toISOString()
        if (!vrestaurant) {
          res.status(400);
          res.json({
            "error": "Bad Data"
          });
        } else {

      var counter1;
      console.log("rc trigger : "+new Date().toString());
      /**
      var request = require('request');

      function getRequest(url) {
      return new Promise(function (success, failure) {
      request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      success(body);
      } else {
      failure(error);
      }
      });
      });
      }
      getRequest('https://httpbin.org/get').then(function (body1) {
      // do something with body1
      return getRequest('http://www.test.com/api2');
      });
      */

      function getRequest() {
      return new Promise(function (success, failure) {db.RestaurantCounter.findAndModify({
      query: { "key":"Restaurant" },
      update: { $inc: {counter: 1} },
      new: true
      },
          function(err, data) {
            if (err) {
              res.send(err);
              console.log(err);
            }
            success(data)
            counter1 = data.counter;
            console.log("Restaurant Counter " + counter1 +"   ----   "+data.counter);


          });
        });
      }

      console.log("rc ended : "+new Date().toString());
          //db.getCollection('restaurants').update({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {$push:{"menucategory":{"categoryname":"Breakfast"}}})
          //db.restaurants.update({"_id" : mongojs.ObjectId('596c31a3cd5b449992628cb1')},{$addToSet:{"menucategory":{"categoryname":menuCategory.menuCat}}}, function(err, restaurant){
      getRequest().then(function (data) {
          db.restaurants.insert({
            "name": vrestaurant.name,
            "company_regno":vrestaurant.company_regno,
            "restaurant_id" : data.counter,
            "is_active" : false,
            "suspend": false,

            "charge_gst":vrestaurant.charge_gst,
            "gstNo":vrestaurant.gstNo,
            "address":vrestaurant.address,
            "address2":vrestaurant.address2,
            "block":vrestaurant.block,
            "unit":vrestaurant.unit,
            "website":vrestaurant.website,
            "email":vrestaurant.email,
            "phone":vrestaurant.phone,
            "pincode":vrestaurant.pincode,
            "state":vrestaurant.state,
            "city":vrestaurant.city,
            "country":vrestaurant.country,
            "createdby":vrestaurant.createdby,
            "createddate":isodate,
            "lastmodifiedby":vrestaurant.lastmodifiedby,
            "lastmodifieddate":isodate

          }, function(err, restaurant) {
            if (err) {
              res.send(err);
              console.log(err);
            }
            res.json(restaurant);
            console.log("Created Restaurant " + restaurant);
          });
        });
        //  console.log("rc insert complete : "+new Date().toString()+"         "+counter1);
        }


});


// ADD a menu Category

router.post('/restaurant/:id', function(req, res, next) {

  //create a new object id
  var objectId = new ObjectID();
  console.log("new objectid created for menucategory : " + objectId);

  var menuCategory = req.body;
  console.log("insid id : " + req.params.id);
  console.log("insid id : " + menuCategory.menuCat1);
  //  console.log("insid menu category  : "+menuCategory.menuCat1.category);
  if (!menuCategory.menuCat1) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {

    //db.getCollection('restaurants').update({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {$push:{"menucategory":{"categoryname":"Breakfast"}}})
    //db.restaurants.update({"_id" : mongojs.ObjectId('596c31a3cd5b449992628cb1')},{$addToSet:{"menucategory":{"categoryname":menuCategory.menuCat}}}, function(err, restaurant){
    db.restaurants.update({
      "_id": mongojs.ObjectId(req.params.id)
    }, {
      $addToSet: {
        "menucategory": {
          "categoryname": menuCategory.menuCat1,
          "_id": objectId
        }
      }
    }, function(err, restaurant) {
      if (err) {
        res.send(err);
        console.log(err);
      }
      console.log("From POST Restaurant menthod : " + restaurant);
      //  db.getCollection('restaurants').find({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {"menucategory.categoryname":1})
      db.restaurants.findOne({
        "_id": mongojs.ObjectId(req.params.id)
      }, {
        "name": 1,
        "menucategory": 1
      }, function(err, restaurants) {
        // - dont need :db.restaurants.find({"staff.staffid": req.params.id, "staff.role":5}, {"menucategory.categoryname":1}, function(err, restaurants){
        if (err) {
          res.send(err);
        }
        res.json(restaurants);
        console.log("From POST Restaurant menthod : " + restaurants);

      });
    });
  }


});

// Delete a menuCategory

router.post('/restaurant/:id/:mcat', function(req, res, next){
  var vdeleteMenuCategory =  req.params.mcat;
    console.log("insid delete id : "+req.params.id);
     console.log("insid delete id category: "+ vdeleteMenuCategory);

  //  console.log("insid menu category  : "+menuCategory.menuCat1.category);
  if(!vdeleteMenuCategory){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
      //db.getCollection('restaurants').update({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {$pull:{"menucategory":{"categoryname":"Washers"}}})
      db.restaurants.update({"_id" : mongojs.ObjectId(req.params.id)},{$pull:{"menucategory":{"categoryname":vdeleteMenuCategory}}}, function(err, restaurant){
            if(err){
                res.send(err);
                console.log(err);
            }
            console.log("From Delete Restaurant menthod : "+restaurant);
          //  db.getCollection('restaurants').find({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {"menucategory.categoryname":1})
          db.restaurants.findOne({"_id": mongojs.ObjectId(req.params.id)}, {"name":1, "menucategory":1}, function(err, restaurants){
            // - dont need :db.restaurants.find({"staff.staffid": req.params.id, "staff.role":5}, {"menucategory.categoryname":1}, function(err, restaurants){
              if(err){
                res.send(err);
              }
              res.json(restaurants);
            console.log("From Delete Restaurant menthod : "+restaurants);

        });
      });
    }


});


//create menuItem


router.post('/restaurant/menuitem/:id', function(req, res, next) {
    console.log("CREATING NEW menuItem " + vmenuitem);
  var objectId = new ObjectID();
  var vmenuitem = req.body;
  var menucategory = vmenuitem.menucategory;
  var isodate = new Date().toISOString();

  console.log("CREATING NEW menuItem " + vmenuitem);
  if (!vmenuitem) {
    res.status(400);
    res.json({
      "error": "MenuItem is Bad Data"
    });
  } else {

    db.restaurants.update({
      "_id": mongojs.ObjectId(req.params.id)
    }, {
      $addToSet: {

        "menucategory": {
          "_id": objectId,
          "item_name": menucategory.item_name,
          "menu_item_desc": menucategory.menu_item_desc,
          "item_price": menucategory.item_price,
          "menu_item_img": "",
          "catid": menucategory.catid,
          "catname": menucategory.catname,
          "lastmodifiedby": menucategory.lastmodifiedby,
          "currency": "SGD",
          "lastmodifieddate": isodate
        }


      }
    }, function(err, restaurant) {
      if (err) {
        res.send(err);
        console.log(err);
      }
      res.json(restaurant);
      console.log("Menu Item Created " + restaurant);
    });
  }




});

// Create new Order
router.post('/order/neworder/:id',function(req, res, next){
  var vorder = req.body;
  console.log("CREATING NEW ORDER " + vorder);
      var isodate = new Date().toISOString()
      if (!vorder) {
        res.status(400);
        res.json({
          "error": "Bad Data"
        });
      } else {

        var counter1;
        console.log("rc trigger : " + new Date().toString());

        function getRequest() {
          return new Promise(function(success, failure) {
            db.RestaurantCounter.findAndModify({
                query: {
                  "key": req.params.id
                },
                update: {
                  $inc: {
                    counter: 1
                  }
                },
                upsert: true,
                new: true
              },
              function(err, data) {
                if (err) {
                  res.send(err);
                  console.log(err);
                }
                success(data)
                counter1 = data.counter;
                console.log("Order Counter " + counter1 + "   ----   " + data.counter);


              });
          });
        }

        console.log("rc ended : " + new Date().toString());
        //db.getCollection('restaurants').update({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {$push:{"menucategory":{"categoryname":"Breakfast"}}})
        //db.restaurants.update({"_id" : mongojs.ObjectId('596c31a3cd5b449992628cb1')},{$addToSet:{"menucategory":{"categoryname":menuCategory.menuCat}}}, function(err, restaurant){
        getRequest().then(function(data) {
          db.order.insert({
            "name": vorder.name,
            "restaurant_id": vorder.restaurant_id,
            "order_number": counter1,
            "order_status": vorder.status,
            "total_amount": vorder.total_amount,
            "OrderDetails": vorder.orderdetails,
            "createdby": vorder.createdby,
            "createddate": isodate,
            "lastmodifiedby": vorder.lastmodifiedby,
            "lastmodifieddate": isodate


          }, function(err, restaurant) {
            if (err) {
              res.send(err);
              console.log(err);
            }
            res.json(restaurant);
            console.log("Created Restaurant " + restaurant);
          });
        });
        //  console.log("rc insert complete : "+new Date().toString()+"         "+counter1);
      }

});

// Retrieve user orders == id is userid
router.post('/order/getmyorder/:id',function(req, res, next){


  db.order.find({createdby:req.params.id}).sort({createddate:-1},
    function(err, myorders) {
      if (err) {
        res.send(err);
        console.log(err);
      }
      res.json(myorders);
      console.log("User orders retrived " + myorders);
    });



});

// Retrieve RESTAURANT Orders with has not paid -- here id is user id


router.post('/order/getrestorder/:id',function(req, res, next){
  var id = req.params.id;
//  var uid = req.body;
  console.log("get restaurant paid orders "+ id)
  var restid;
    function getRequest() {
      return new Promise(function(success, failure) {
        db.users.findOne({firebaseid:id},{restaurantid:1 },
          function(err, data) {
            if (err) {
              res.send(err);
              console.log(err);
            }
            success(data)
            restid = data.restaurantid;
            console.log("restid " +  restid);


          });
      });
    }

    getRequest().then(function(data) {
      console.log("within getre "+ restid);
      db.order.find({ "order_status": { $ne: "paid" },  "restaurant_id": data.restaurantid }).sort({createddate:-1},
    //  db.order.find({restaurant_id:data.restaurantid},
      function(err, restaurant) {
        if (err) {
          res.send(err);
          console.log(err);
        }
        res.json(restaurant);
        console.log("restaurant orders " + restaurant);
      });
    });
    /**
  db.order.find({ order_status: { $ne: "paid" },  restaurant_id:req.params.id},
    function(err,restorder) {
      if (err) {
        res.send(err);
        console.log(err);
      }
      res.json(restorder);
      console.log("Restaurant order retrieve " + restorder);
    });*/
});
// Retrieve  ALL RESTAURANT Orders for cashiers-- here id is UID id
router.post('/order/getallrestorder/:id',function(req, res, next){
  var id = req.params.id;
//  var uid = req.body;
  console.log("get restaurant paid orders "+ id)
  var restid;
    function getRequest() {
      return new Promise(function(success, failure) {
        db.users.findOne({firebaseid:id},{restaurantid:1 },
          function(err, data) {
            if (err) {
              res.send(err);
              console.log(err);
            }
            success(data)
            restid = data.restaurantid;
            console.log("restid " +  restid);


          });
      });
    }

    getRequest().then(function(data) {
      console.log("within getre "+ restid);
      db.order.find({ "restaurant_id": data.restaurantid }).sort({createddate:-1},
    //  db.order.find({restaurant_id:data.restaurantid},
      function(err, restaurant) {
        if (err) {
          res.send(err);
          console.log(err);
        }
        res.json(restaurant);
        console.log("restaurant orders " + restaurant);
      });
    });
    /**
  db.order.find({ order_status: { $ne: "paid" },  restaurant_id:req.params.id},
    function(err,restorder) {
      if (err) {
        res.send(err);
        console.log(err);
      }
      res.json(restorder);
      console.log("Restaurant order retrieve " + restorder);
    });*/
});
// User shall stop the order, for restaurant people to ammend the order or cancel it, stop will not work if the status is not ordered

router.post('/order/stoporder/:id',function(req, res, next){
  console.log("insid id : " + req.params.id);

  if(req.params.id){
    db.order.update(
     { _id: mongojs.ObjectId(req.params.id), "order_status":"ordered"},
     { $set: { "order_status": "hold" } },
      function(err, stoporder) {
        if (err) {
          res.send(err);
          console.log(err);
        }
        res.json(stoporder);
        console.log("User order stopped " + stoporder);
      });
  }


});

// Restaurant - acceptPayment - id is orderid

router.post('/order/acceptPayment/:id',function(req, res, next){
  console.log("accept Payment : " + req.params.id);
  var body = req.body;
  var isodate = new Date().toISOString()
  if(req.params.id){
    db.order.update(
     { _id: mongojs.ObjectId(body._id),"order_status": { $ne: "paid" } },
     { $set: { "order_status": "paid",
                "paid_time" : isodate,
                "lastmodifiedby" : body.uid,
              "lastmodifieddate" : isodate,
            "amount_paid" : body.amount_paid,
          "amount_tendered" : body.amount_tendered }},
      function(err, acceptorder) {
        if (err) {
          res.send(err);
          console.log(err);
        }
        res.json(acceptorder);
        console.log("User accept payment " + acceptorder);
      });
  }


});


module.exports = router;
