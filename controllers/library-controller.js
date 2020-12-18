const url = require('url');
// const sugerDisplay = require('../utils/sugerCoatJson');

// const fileRW = require('../utils/fileReadWrite');
// const objGiver = require('../utils/objGiver');

// const filePath = 'mock.json';

const mysql = require('mysql');

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'bookdb',
});

db.connect((err)=>{
    if(err){
        return console.log('connection' + err);
    }
    console.log('mysql connected...');
});

function getAll(req, res) {
    try {
        let category = req.params.category;
        let sql = "";
        
        switch(category) {
            case 'book':
                sql = "SELECT b.id, title, totalPages, rating, isbn, publishedDate, a.id AS authorId, a.name AS 'authors name', a.email AS 'authors email', a.dob,p.id AS publisherId, p.name AS 'publishers name', p.email AS 'publishers email', p.contact, p.established FROM book b JOIN author a ON b.authorId = a.id JOIN publisher p ON b.publisherId = p.id";
                break;
            case 'author':
                sql = "SELECT * FROM author";
                break;
            case 'publisher': 
                sql = "SELECT * FROM publisher";
                break;
        }

        db.query(sql, (err, results)=>{
            if(err) console.log('query' + err);
            res.json(results);
        });

    } catch (error) {
        console.error(error);
    }
}

function getById(req, res) {
    try {
        let category = req.params.category;
        let id = req.params.id;
        let sql = "";

        switch(category) {
            case 'book': 
                sql = `SELECT b.id, title, totalPages, rating, isbn, publishedDate, a.id AS authorId, a.name AS 'authors name', a.email AS 'authors email', a.dob,p.id AS publisherId, p.name AS 'publishers name', p.email AS 'publishers email', p.contact, p.established FROM book b JOIN author a ON b.authorId = a.id JOIN publisher p ON b.publisherId = p.id WHERE b.id = ${id}`;
                break;
            case 'author':
                sql = `SELECT * FROM author WHERE id = ${id}`;
                break;
            case 'publisher': 
                sql = `SELECT * FROM publisher WHERE id = ${id}`;
                break;;
        }

        db.query(sql, (err, results)=>{
            if(err) console.log('query' + err);
            res.json(results);
        });

    } catch (error) {
        console.error(error);
    }
}

function addItem(req, res) {
    try {
        let category = req.params.category;
        let sql = "";

        switch(category) {
            case 'book': 
                sql = `INSERT INTO book (id, title, totalPages, rating, isbn, publishedDate, authorId, publisherId) VALUES (null, ${req.params.title}, ${req.params.totalPages}, ${req.params.rating}, ${req.params.isbn}, ${req.params.publishedDate }, ${req.params.authorId }, ${req.params.publisherId})`;
                break;
            case 'author':
                sql = `INSERT INTO author (id, name, email, dob) VALUES (null, ${JSON.stringify(req.body.name)}, ${JSON.stringify(req.body.email)}, ${JSON.stringify(req.body.dob)})`;
                break;
            case 'publisher': 
                sql = `INSERT INTO publisher (id, name, email, contact, established) VALUES (null, ${req.params.name}, ${req.params.email}, ${req.params.contact}, ${req.params.established})`;
                break;;
        }

        db.query(sql, (err, results)=>{
            if(err) console.log('query' + err);
            res.json(results);
        });

    } catch (error) {
        console.error(error);
    }
}

// async function deleteItem(req, res) {
//     try {
//         let category = req.params.category;
//         let dataObj = objGiver.returnObjs();
//         dataObj[category] = dataObj[category].filter((element) => {
//             return parseInt(element.id) !== parseInt(req.params.id)
//         });
//         await fileRW.writeIntoFile(filePath, dataObj, req, res, urlArr[1]);
//     } catch (error) {
//         console.error(error);
//     }
// }


module.exports = {getAll, getById, addItem}