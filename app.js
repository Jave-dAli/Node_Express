const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

const https=require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});
app.post("/", function(req, res){
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;

    const data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);

    //Making request
    const url="https://us13.api.mailchimp.com/3.0/lists/5b2b4650a5";
    const options = {
        method: "POST",
        auth: "javed1:11bc47baa0681a27be33c56878d09d2ad-us13"
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

    //console.log(firstName+" "+lastName+" "+email);
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

const port = 3000;
app.listen(process.env.PORT || port, function(){
    console.log("Server is running at port "+port);
});

// NewletterSignupAPI Key
//1bc47baa0681a27be33c56878d09d2ad-us13

// unique id
//5b2b4650a5