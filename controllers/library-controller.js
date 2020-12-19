const url = require('url');
// const sugerDisplay = require('../utils/sugerCoatJson');

const mysql = require('mysql');

const bookdb = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'bookdb',
});

bookdb.connect((err)=>{
    if(err){
        return console.log('connection' + err);
    }
    console.log('bookdb connected...');
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

        bookdb.query(sql, (err, results)=>{
            if(err) console.log('query' + err);
            res.json(results);
        });

    } catch (error) {
        console.error(error);
    }
}

function getById(req, res) {
    try {
        const {category, id} = req.params;
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

        bookdb.query(sql, (err, results)=>{
            if(err) return console.log('query' + err);
            if(results.length > 0) res.json(results);
            else res.json({"message": "Invalid ID"})
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
                sql = `INSERT INTO book (id, title, totalPages, rating, isbn, publishedDate, authorId, publisherId) VALUES (null, ${JSON.stringify(req.body.title)}, ${JSON.stringify(req.body.totalPages)}, ${JSON.stringify(req.body.rating)}, ${JSON.stringify(req.body.isbn)}, ${JSON.stringify(req.body.publishedDate)}, ${JSON.stringify(req.body.authorId)}, ${JSON.stringify(req.body.publisherId)})`;
                break;
            case 'author':
                sql = `INSERT INTO author (id, name, email, dob) VALUES (null, ${JSON.stringify(req.body.name)}, ${JSON.stringify(req.body.email)}, ${JSON.stringify(req.body.dob)})`;
                break;
            case 'publisher': 
                sql = `INSERT INTO publisher (id, name, email, contact, established) VALUES (null, ${JSON.stringify(req.body.name)}, ${JSON.stringify(req.body.email)}, ${JSON.stringify(req.body.contact)}, ${JSON.stringify(req.body.established)})`;
                break;;
        }

        bookdb.query(sql, (err, results)=>{
            if(err) console.log('query' + err);
            res.json(results);
        });

    } catch (error) {
        console.error(error);
    }
}

function deleteItem(req, res) {
    try {
        let category = req.params.category;
        let id = req.params.id;
        let sql = "";

        switch(category) {
            case 'book': 
                sql = `DELETE FROM book WHERE id=${id}`;
                break;
            case 'author':
                sql = `DELETE FROM author WHERE id=${id}`;
                break;
            case 'publisher': 
                sql = `DELETE FROM publisher WHERE id=${id}`;
                break;;
        }

        bookdb.query(sql, (err, results)=>{
            if(err) console.log('query' + err);
            res.json(results);
        });
    } catch (error) {
        console.error(error);
    }
}


module.exports = {getAll, getById, addItem, deleteItem}