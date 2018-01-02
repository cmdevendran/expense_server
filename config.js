module.exports = {

'header': {
  "alg": "HS256",
  "typ": "JWT"
},
    'secret': 'sgrestaurant@1234S',
    'db' : 'mongodb://user:password@ds161262.mlab.com:61262/sgrestaurant', 
    'env': 'DEV'
// PROD for production environment
// DEV for dev environment
};
