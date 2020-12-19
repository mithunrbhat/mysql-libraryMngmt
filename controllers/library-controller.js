const url = require('url');
const sugerDisplay = require('../utils/sugerCoatJson');

const mysql = require('mysql');
const sugerCoatJson = require('../utils/sugerCoatJson');

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
        const { category } = req.params;
        const {orderBy, searchBy} = req.query;

        let orderByArr = [];
        if (orderBy !== undefined) {
            orderByArr = orderBy.split(',');
            orderByArr = orderByArr.map(item => {
                return item.split('_');
            });
        }
        const [orderByStr, searchByStr] = sugerCoatJson.getString(orderByArr, searchBy)
        let sql = "";
        
        switch(category) {
            case 'book':
                sql = `SELECT b.id, title, totalPages, rating, isbn, publishedDate, a.id AS authorId, a.name AS authorName, a.email AS authorEmail, a.dob,p.id AS publisherId, p.name AS publisherName, p.email AS publisherEmail, p.contact, p.established FROM book b JOIN author a ON b.authorId = a.id JOIN publisher p ON b.publisherId = p.id ${searchByStr} ${orderByStr}`;
                break;
            case 'author':
                sql = "SELECT * FROM author";
                break;
            case 'publisher': 
                sql = "SELECT * FROM publisher";
                break;
        }

        bookdb.query(sql, (err, results)=>{
            if(err) return console.log('query' + err);
            if(category === 'book') {
                results = sugerDisplay.displayBooks(results);
            }
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
                sql = `SELECT b.id, title, totalPages, rating, isbn, publishedDate, a.id AS authorId, a.name AS authorName, a.email AS authorEmail, a.dob,p.id AS publisherId, p.name AS publisherName, p.email AS publisherEmail, p.contact, p.established FROM book b JOIN author a ON b.authorId = a.id JOIN publisher p ON b.publisherId = p.id WHERE b.id = ${id}`;
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
            if(results.length > 0) {
                if(category === 'book') results = sugerDisplay.displayBook(results[0]);
                res.json(results);
            }
            else res.json({"message": "Invalid ID"})
        });

    } catch (error) {
        console.error(error);
    }
}

function addItem(req, res) {
    try {
        const { category } = req.params;
        let sql = "";
        const {title, totalPages, rating, isbn, publishedDate, authorId, publisherId, name, email, dob, contact, established} = req.body;
        switch(category) {
            case 'book': 
                sql = `INSERT INTO book (id, title, totalPages, rating, isbn, publishedDate, authorId, publisherId) VALUES (null, ${JSON.stringify(title)}, ${JSON.stringify(totalPages)}, ${JSON.stringify(rating)}, ${JSON.stringify(isbn)}, ${JSON.stringify(publishedDate)}, ${JSON.stringify(authorId)}, ${JSON.stringify(publisherId)})`;
                break;
            case 'author':
                sql = `INSERT INTO author (id, name, email, dob) VALUES (null, ${JSON.stringify(name)}, ${JSON.stringify(email)}, ${JSON.stringify(dob)})`;
                break;
            case 'publisher': 
                sql = `INSERT INTO publisher (id, name, email, contact, established) VALUES (null, ${JSON.stringify(name)}, ${JSON.stringify(email)}, ${JSON.stringify(contact)}, ${JSON.stringify(established)})`;
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
        const { category, id } = req.params;
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