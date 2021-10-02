const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/wikiDB');

const wikiSchema = new mongoose.Schema ({
    title: String,
    content: String
});

const Article = mongoose.model("Article", wikiSchema);

/********************************************* ROUTE FOR ALL ARTICLES *****************************************************/
app.route("/articles")
.get(function(req,res){
    Article.find(function(err,results){
        if(err){
            res.send(err);
        }else{
            res.send(results);
        }
    });
})
.post(function(req,res){
    const articleDoc = new Article({
        title: req.body.title,
        content: req.body.content
    });
    articleDoc.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("Successfully added a new article.")
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(err){
            res.send(err);
        } else {
            res.send("Successfully deleted all the articles.");
        }
    })
});

/****************************************** ROUTE FOR A SINGLE ARTICLE *****************************************************/
app.route("/articles/:articleName")
.get(function(req,res){
    Article.findOne({title: req.params.articleName},function(err,result){
        if(err){
            res.send(err);
        } else {
            if(result){
                res.send(result);
            } else {
                res.send("No articles found.");
            }
            
        }
    });
})
.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleName},
        {title: req.body.title, content: req.body.content},
        function(err){
            if(err){
                res.send(err);
            } else {
                res.send("Successfully updated the article.");
            }
        }
    );
})
.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleName},
        //{$set: {title: req.body.title, content: req.body.content}}, 
        {$set: req.body},
        function(err){
            if(err){
                res.send(err);
            } else {
                res.send("Successfully updated the article.");
            }
        }
    );
})
.delete(function(req,res){
    Article.deleteOne({title: req.params.articleName},function(err){
        if(err){
            res.send(err);
        } else {
            res.send("Successfully deleted the article.");
        }
    });
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Started successfully.");
});