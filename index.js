let express = require('express');
let app = express(); 

const storage = require('node-persist'); 
let bodyParser = require('body-parser');


let jsonParser = bodyParser.json(); 
storage.init();
let students = [];


app.post('/student', jsonParser, async(req,res) => {
    const { id, name, gpa} = req.body;
    await storage.setItem(id,{id: id, name: name, gpa: gpa});
    res.send(`Added student ${id}`);
});


//print all the student data
app.get('/allStudents', async(req,res) => {
    let htmlCode = `<h1>All students data!</h1>`;
    students = await storage.values();
    for(let i=0; i < students.length; i++) {
        htmlCode += `
            <h2>Student id: ${students[i].id}</h2>
            <h3>Name: ${students[i].name}</h3>
            <h3>GPA: ${students[i].gpa}</h3><br/><br/>
        `
    }
    res.send(htmlCode);
})


//Get individual student data
app.get('/student/:id', async(req,res) => {
    let student = [];
    if((await storage.keys()).includes(req.params.id)) {
        student = await storage.getItem(req.params.id); 
        res.send(`
        <h1>Student detail</h1>
        <h2>Student id: ${student.id}</h2>
        <h3>Name: ${student.name}</h3>
        <h3>GPA: ${student.gpa}</h3><br/><br/>
        `);
    }
    else {
        res.send('Student not found!');
    }
});



app.listen(5000, () => {
    console.log('Server has started!');
});     