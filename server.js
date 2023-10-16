import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
// this is server from here api requests will be requested 
const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Route to render the main page
app.get("/", async (req, res) => {
  try {
    // console.log("HellO");
    const response = await axios.get(`${API_URL}/posts`);
    // console.log(response.data);
    res.render("index.ejs", { posts: response.data });
    // res.json("DK");
  } catch (error) {
    // res.status(500).json({ message: "Error fetching posts" });
    console.log(error);
    // res.json(error);
  }
}); 

// Route to render the edit page
app.get("/new", async (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    // console.log("JDF");
    const response = await axios.get(`${API_URL}/post/${req.params.id}`);
    console.log(response.data);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.post(`${API_URL}/post`, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  console.log(req.body);
  try {
    const response = await axios.patch(
      `${API_URL}/post/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/post/delete/:id", async (req, res) => {
  try {
    console.log("del req");
    await axios.delete(`${API_URL}/post/${req.params.id}`);// path parameters
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
