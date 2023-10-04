//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//-----------------mongoose start----------------------

mongoose.connect("mongodb+srv://onojapeter90:ofiegocho@cluster0.k6f3v2f.mongodb.net/todolistDB", {
  useNewUrlParser: true,       
  useUnifiedTopology: true    
});

const itemsSchema = new mongoose.Schema({
  name: String,
  // Other fields and their types
});

const Item = mongoose.model("Item", itemsSchema);

//-----------------mongoose stop----------------------

app.get("/",async function(req, res) {
  try {
    const item1 = new Item ({
      name: "Welcome to your todolist",
    });

    const item2 = new Item ({
      name: "Hit the submit button to add a new item",
    });

    const item3 = new Item ({
      name: "Peter",
    });

    const defaultItems = [item1, item2, item3];

    const foundItems  = await Item.find({});

    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems);
      console.log('defaultitems saved to the database.');
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems });
    }

  } catch (err) {
    console.error(err);
  }
});

// app.get("/:customListName", async function(req,res) {
//   const customListName = req.params.customListName;

//   const listSchema = {
//     name: String,
//     items: [itemsSchema],
//   }
//   const List = mongoose.model("List", listSchema);

//   List.findOne({name: customListName}); 
//     if(!err){
//       if(!foundList){
//         console.log("Doesnt exist!");
//       } else {
//         console.log("Exists!");
//       }
//     }
 

//   const list = new List({
//     name: customListName,
    
//   });
//   list.save();
// });

app.post("/", async function(req, res){

  const itemNew = await req.body.newItem;

  const item = new Item ({
    name: itemNew,
  });

  await item.save();

  res.redirect("/");

  
});

app.post("/delete", async function(req,res){
  try{
    const checkedItemId = await req.body.checkbox;
    await Item.findByIdAndRemove(checkedItemId);
    console.log("successfully deleted checked item");
    res.redirect("/");
  } catch(err) {
    console.error(err);
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
