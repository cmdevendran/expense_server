var express = require('express');
var router = express.Router();


var mongojs = require('mongojs');
var db = mongojs('mongodb://user:password@ds161262.mlab.com:61262/sgrestaurant', ['restaurants']);
var ObjectID = mongojs.ObjectID;

router.get('/menuitem', function(req, res, next) {

  db.restaurants.find({} ,{ name:1 },function(err, restaurants) {
    if (err) {
      res.send(err);
    }
    res.json(restaurants);
    console.log(restaurants);
  });
});
//create menuItem

router.post('/menuitem/:id', function(req, res, next) {

  var objectId = new ObjectID();
  var vmenuitem = req.body;
  var menucategory = vmenuitem.menucategory;
  console.log(menucategory);
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

        "menuitem": {
          "_id": objectId,
          "item_name": vmenuitem.item_name,
          "menu_item_desc": vmenuitem.menu_item_desc,
          "item_price": vmenuitem.item_price,
          "menu_item_img": "",
          "catid": vmenuitem.catid,
          "catname": vmenuitem.catname,
          "lastmodifiedby": vmenuitem.lastmodifiedby,
          "currency": "SGD",
          "addgst" : vmenuitem.addgst,
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
