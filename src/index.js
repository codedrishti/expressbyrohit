const path = require("path");
const express = require("express");
const requests = require("requests");
const app = express();
const hbs = require("hbs");
const port = 8000;

//Built in middleware
const staticPath = path.join(__dirname,'../public');
const templatePath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

//To set the view engine
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);

app.use(express.static(staticPath));

//template engine route
app.get("/", (req, res)=>{
    res.render("index");
});

app.get("/about", (req, res)=>{
    res.status(200).send("About Us done!");
});


app.get("/weatherApi", (req, res)=>{
    //res.render("weatherApi");
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${req.query.name}&units=metric&appid=704ccb4099827d05c3c2395eed7e5446`)
    .on("data", (chunk)=>{
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        console.log(`city name is ${arrData[0].name} and the the temp is ${arrData[0].main.temp}`);

        res.write(arrData[0].name);
    })
    .on("end", (err)=>{
        if(err) return console.log("Connection closed due to errors.",err);
        res.end();
    });
});

app.get("/weatherApi/*", (req, res)=>{
    res.render("404", {
        errorcomment : "Opps! page couldn't found.",
    });
});

app.get("*", (req, res)=>{
    res.render("404", {
        errorcomment : "Opps page couldn't found",
    });
});


app.listen(port, ()=>{
    console.log(`lisenting the port ${port}`);
});

//The callback function has 2 parameters, request(req) and response(res).
