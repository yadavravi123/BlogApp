import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
// const {MongoClient}= require('mongodb');
let client;
async function mongoconnect(){
    try{
    const uri="mongodb+srv://raviyadav20102002:pAkMHwPsPdsFObBX@cluster0.l3wgtog.mongodb.net/?retryWrites=true&w=majority";
     client=new MongoClient(uri);
    await client.connect();
    const database=client.db("air_bnb");
    const collection=database.collection("blogdata");
    } catch(err){
        console.log(err);
    }
    finally{
        
    }
}
const app = express();
const port = 4000;

// In-memory data store



// Middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --------------------------------------------------------------------------

// creating a new post

app.post("/post",async(req,res)=>{
    try{
        await mongoconnect();
    let DATE=new Date();
    let post={
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: DATE,
    }
    // console.log(post);
    const result= await client.db("sample_airbnb").collection("blogdata").insertOne(post);
    console.log(result);
        res.json("added");

    } catch(err){
        console.log("error while creating post");
        console.log(err);
    } finally{
        await client.close();
    }

})

// partially update post
app.patch("/post/:id",async (req,res)=>{
    try{
        await mongoconnect();
        console.log("patch");
        const ID=new ObjectId(req.params.id);
        let old_post=await client.db("sample_airbnb").collection("blogdata").findOne({_id:ID});
        console.log(old_post);
        let Title=old_post.title;
        let Content=old_post.content;
        let Author=old_post.author;
        
        if(req.body.title) Title=req.body.title;
        if(req.body.content) Content=req.body.content;
        if(req.body.author) Author=req.body.author;
        let post={
            _id:ID,
            title:  Title,
            content: Content,
            author: Author,
            date: new Date(),
        }
        console.log(post);
        const result=await client.db("sample_airbnb").collection("blogdata").updateOne({_id:ID},{$set:post});
        res.json(result);
    } catch(err){
        console.log(`error while updating the post`);
        console.log(err);
    } finally{
        await client.close();
    }

})

// search post by its id

app.get("/post/:id",async (req,res)=>{
    try{
         await mongoconnect();
         console.log(req.params.id);
         let ID=new ObjectId(req.params.id);// this is the type of _id
        const post=await client.db("sample_airbnb").collection("blogdata").findOne({_id:ID});
        console.log(post);
      
        if(post)
        res.json(post);
        else
        res.json("No post available with given id");
    } catch(err){
        console.log(err);
    } finally{
        await client.close();
    }
})

// update a  post with given id 

// app.patch("/posts/:id",async(req,res)=>{
//     try{
//         await mongoconnect();
//     let ID=req.params.id;
//     let org_post=await client.db("sample_airbnb").collection("blogdata").findOne({id:ID});
//     if(req.body.title) org_post.title=req.body.title;
//     if (req.body.content) org_post.content = req.body.content;
//     if (req.body.author) org_post.author = req.body.author;

//     const result= await client.db("sample_airbnb").collection("blogdata").updateOne({id:ID},{$set:org_post});

//     console.log(result);
//     res.json(result);
//     } catch(err){
//         console.log(`error while updating post`);
//         console.log(err);
//     } finally{
//         await client.close();
//     }
// })

// delete a post using given id

app.delete("/post/:id",async(req,res)=>{
    try{
        await mongoconnect();
        console.log("delete req");
    let ID=new ObjectId(req.params.id);
    console.log(`id:${ID}`);
    const result=await client.db("sample_airbnb").collection("blogdata").deleteOne({_id:ID});
    console.log(result);
    if(result.deletedCount>0){
    res.json(result);
    }
    else{
        res.json(`No post available with id: ${ID}`);
    }
    } catch(err){
        console.log("error while deleting the post");
        console.log(err);
    } finally{
        await client.close();
    }
})

async function listDatabases(client){
    const databasesList= await client.db().admin().listDatabases();
    console.log(databasesList.databases.length);
    for(let i=0;i<databasesList.databases.length;i++){
        console.log(databasesList.databases[i].name);
    }
}

// get all the posts in the databases
app.get("/posts", async(req,res)=>{
    try{
        await mongoconnect();
        let cursor=await client.db("sample_airbnb").collection("blogdata").find();
      
        const result=await cursor.toArray();
        // for(let i=0;i<result.length;i++){
        //     console.log(result[i]);
        // }
        res.json(result);
    } catch(err){
        console.log(err);
    }
    finally{
        await client.close();
    }
})

app.delete("/delete/all",async(req,res)=>{
        try{
            await mongoconnect();
            const result=await client.db("sample_airbnb").collection("blogdata").deleteMany();
            console.log(result);
            res.json(result);
        } catch(err){
            console.log("error while deleting all the posts");
            console.log(err);
        } finally{
            await client.close();
        }
})
app.get('/create',async(req,res)=>{
    try{
        await mongoconnect();
    const result=await client.db("sample_airbnb").createCollection("blogdata");
    console.log(result);
    res.json("OK");
    } catch(err){
        console.log("error while creating the collection");
        console.log(err);
    } finally{
        await client.close();
    }

})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
