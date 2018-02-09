const express =require('express');
const path=require('path');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const session=require('express-session');
const mongoose=require('mongoose');
const passport=require('passport');
const MongoStore=require('connect-mongo')(session);


require('dotenv').config();
const port=Number(process.env.PORT || 8080);

const flash=require('express-flash');

 const app=express();

mongoose.connect(process.env.MONGOURI||'mongodb://localhost/booktradingclub');



const user=require('./controllers/user');
const profile=require('./controllers/profile');
const tradeBooks=require('./controllers/tradeBooks');

require('./config/passport');

app.set('view engine','ejs'); 
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());


 app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret:'tutorial',
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(user);
app.use(profile);


app.use('/tradeBooks',tradeBooks);

app.listen(port,function(){
    console.log('Listen on port '+ port);
});
