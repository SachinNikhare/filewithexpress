let express = require("express");
let app  = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port = process.env.PORT || 2410;
app.listen(port, ()=>console.log(`Node app listening on port ${port}!`));

let {studentsData} = require("./studentData.js");
let fs = require("fs");
let fname = "students.json";

app.get("/svr/resetData",function(req,res){
    let data = JSON.stringify(studentsData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is reset");
    })
})

app.get("/svr/students",function(req,res){
    // res.send(studentsData); // this is another approach to read the data from server without using readFile made by Sachin Pal...
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let stundetsArray = JSON.parse(data);
            res.send(stundetsArray);
        }
    })
})

app.get("/svr/students/:id",function(req,res){
    let id = +req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let stundetsArray = JSON.parse(data);
            let student = stundetsArray.find(st=>st.id==id);
            if(student) res.send(student);
            else res.status(404).send("No Student Found");
        }
    })
})

app.get("/svr/students/course/:name",function(req,res){
    let name = req.params.name;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let stundetsArray = JSON.parse(data);
            let arr1 = stundetsArray.filter(st=>st.course===name);
            res.send(arr1);
        }
    })
})

app.post("/svr/students",function(req,res){
    let body = req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            let maxid = studentsArray.reduce((acc,curr)=>(curr.id>acc?curr.id:acc),0);
            let newid = maxid + 1;
            let newStudent = {...body,id:newid};
            studentsArray.push(newStudent);
            let data1 = JSON.stringify(studentsArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(newStudent);
            })

        }
    })
})

app.put("/svr/students/:id",function(req,res){
    let body = req.body;
    let id = +req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            let index = studentsArray.findIndex(st=>st.id===id);
            if(index>=0){
                let updatedStudent = {...studentsArray[index],...body};
                studentsArray[index]=updatedStudent;
                let data1 = JSON.stringify(studentsArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(updatedStudent);
                })
            }
            else res.status(404).send("No Student found")
        }
    })
})

app.delete("/svr/students/:id",function(req,res){
    let id = +req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            let index = studentsArray.findIndex(st=>st.id===id);
            if(index>=0){
                let deletedStudent = studentsArray.splice(index,1);
                let data1 = JSON.stringify(studentsArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(deletedStudent);
                })
            }
            else res.status(404).send("No Student found")
        }
    })
})