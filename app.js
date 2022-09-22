
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
const PORT = 5004;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
try{
  mongoose.connect("mongodb+srv://admin-mramis:lSUSUE94f4fq9dP4@cluster0.6jdrcf7.mongodb.net/wikiDB");
  console.log("Server Connected to Database Sucessfully...")
}catch(err){console.log(err.message);}

const articleSchema = {
title:String,
content:String
};

const Article = mongoose.model("Article", articleSchema);

// // TODO:
/////////////////////// Requests Targetting All Articles //////
app.route("/article")

.get(function(req,res) {
Article.find(function(err, result){
  if(!err){
    res.send(result);
    // console.log(result[0].content, result[2].title) // Tab into Specific Part
  }else {console.log(err);}
})
})
.post(function(req, res){

const newArticle = new Article({
  title: req.body.title,
  content: req.body.content
});
  newArticle.save(function(err){
    if(!err){res.send("Data is Successfully Saved ..");}
    else{res.send(err);}
  });
})


.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){res.send("Data is Sucessfully Deleted ..")}
    else{res.send(err)}
  });
})


/////////////////////// Requests Targetting a Specific Article //////

app.route("/article/:articaleTitle")

.get(function(req,res){
const requetTitle = req.params.articaleTitle;
  Article.findOne({title:requetTitle}, function(err, result){
    if(!err){
      if(result){res.send(result);}else{res.send("Data is Not Found !")}

    }else {res.send(err);}
  });
}) // END of GET Method

.put(function(req, res){
//,
  // {overwrite: true},
  Article.updateOne(
    {title: req.params.articaleTitle},
    {title: req.body.title, content:req.body.content},

    function(err){
      if(!err){res.send("Article Updated Sucessfully.. ");}
       else{res.send(err);}});
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articaleTitle},
    {$set:req.body},
    function(err){
      if(!err){res.send("Article Updated Sucessfully.. ");}
       else{res.send(err);}});
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articaleTitle},
    function(err){
      if(!err){res.send("Record is Successfully Deleted ...")}
      else{
        res.send(err)}
    }
  )
});



app.listen(PORT, function(){
  console.log(`Server is running Port: ${PORT} `);
});
