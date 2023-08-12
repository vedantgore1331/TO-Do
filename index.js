import express from "express";
import mongoose, { model } from "mongoose";
import _ from "lodash";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://vedantgore:csk%401331@cluster0.zxrjhjk.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

const WorkSchema = new mongoose.Schema({
    name: String,
});

const Works = mongoose.model("work", WorkSchema);

const Listschema=new mongoose.Schema({
    name:String,
    list:[WorkSchema]
})

const Items=mongoose.model("item",Listschema);

const one = new Works({
    name: "Wecome to yout To-Do list",
})

const two = new Works({
    name: "Hit the + button to add a new item",
})

const three = new Works({
    name: "<< Hit this to delete an item",
})

const defaultitems = [one, two, three];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const Months = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
var date = new Date();
var day = dayNames[date.getDay()];
var month = Months[date.getMonth()];
var date = date.getDate();

const data = {
    title: day + "," + month + " " + date,
    arr: new Array(),
}

app.get("/", async (req, res) => {
    
    data.arr=await Works.find({}).exec();
    data.title= day + "," + month + " " + date;
    if(data.arr.length===0)
    {
        Works.insertMany(defaultitems);
        res.redirect("/");
    }
    else{
    res.render("index.ejs", data);}
})

app.post("/delete",async(req,res)=>{
    const del_id=req.body.ckk;
    const ListName=req.body.check;
    if(ListName===day+","+month+" "+date){
    Works.findByIdAndRemove(del_id).exec();
    res.redirect("/");
    }
    else{
        const itemList=await Items.findOne({name:ListName}).exec();
        Items.findOneAndUpdate({name:ListName},{$pull:{list:{_id:del_id}}}).exec();
        res.redirect(`${ListName}`)
    }
})


app.get("/:param",async(req,res)=>{
    const ListName=_.capitalize(req.params.param);
    const itemList=await Items.findOne({name:ListName}).exec();

    if(itemList===null){
        const item=new Items({
            name:ListName,
            list:defaultitems
        })
        item.save();
        res.redirect(`/${ListName}`);
    }
    else{
        data.title=ListName;
        data.arr=itemList.list;
        res.render("index.ejs",data);
    }
})

app.post("/:param",async(req,res)=>{
    const ListName=_.capitalize(req.params.param);
    const ele = req.body["neww"];
    const itemList=await Items.findOne({name:ListName}).exec();

    const neww=new Works({
        name:ele
    });

    if(ListName===_.capitalize(day+","+month+" "+date)){
        neww.save();
        res.redirect("/");
    }

    else{
    itemList.list.push(neww);
    itemList.save();
    res.redirect(`/${ListName}`);
    }
})

app.listen(3000, () => {
    console.log("server started on 3000");
})