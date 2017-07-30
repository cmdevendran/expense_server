var express = require('express');
var router = express.Router();


var mongojs = require('mongojs');
var db = mongojs('mongodb://user:password@ds161262.mlab.com:61262/sgrestaurant', ['restaurants']);
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

//Add a new Restaurant
router.post('/restaurant/', function(req, res, next) {
  //create a new object id
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

    //db.getCollection('restaurants').update({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {$push:{"menucategory":{"categoryname":"Breakfast"}}})
    //db.restaurants.update({"_id" : mongojs.ObjectId('596c31a3cd5b449992628cb1')},{$addToSet:{"menucategory":{"categoryname":menuCategory.menuCat}}}, function(err, restaurant){
    db.restaurants.insert({
      "name": vrestaurant.name,
      "company_regno":vrestaurant.company_regno,
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
  var isodate = new Date().toISOString()

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
module.exports = router;
