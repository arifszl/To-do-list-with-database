//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");


const app = express();

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true });

const itemSchema = {
    name: String
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to to do list"
});

const item2 = new Item({
    name: "Hit + button to save"
});

const item3 = new Item({
    name: "Tap <-- to delete a to do"
});

const defaultItems = [item1];






app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems) {
        if (foundItems.length == 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err)
                    console.log(err);
                else {
                    console.log("Successfully added");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }




    })



});

app.post("/", function(req, res) {

    const newitem = req.body.newItem;

    const item = new Item({
        name: newitem
    })
    item.save();
    res.redirect("/");

});
app.post("/delete", function(req, res) {
    const delitem = req.body.checkbox;

    Item.findByIdAndRemove(delitem, function(err) {
        if (err)
            console.log(err);
        else {
            console.log("removed succesfully");
        }
    });
    res.redirect("/");
})

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});