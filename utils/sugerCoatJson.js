function displayBooks(books) {
    let bookObj = [];
    books.forEach(book => {
        bookObj.push(displayBook(book))
    });
    return bookObj;
}

function displayBook(obj) {
    return {
        id: obj.id,
        title: obj.title,
        totalPages: obj.totalPages,
        rating: obj.rating,
        isbn: obj.isbn,
        publishedDate: obj.publishedDate,
        author: {
            authId: obj.authorId,
            name: obj.authorName,
            email: obj.authorEmail,
            DOB: obj.dob
        },
        publisher: {
            pubId: obj.publisherId,
            name: obj.publisherName,
            email: obj.publisherEmail,
            established: obj.established
        }
    };
}

function getString(orderArr, searchStr) {
    let orderByStr = "";
    let searchByStr = "";
    if(searchStr !== undefined) searchByStr = "WHERE b.title LIKE '" + searchStr + "';";
    if(orderArr.length > 0) {
        orderByStr = "ORDER BY";
        let index = 0;
        while(orderArr[index] !== undefined) {
            let [ele, order] = orderArr[index];
            let comma = ",";
            if(orderArr[index + 1] === undefined) {
                comma = "";
            }
            orderByStr += " "+ ele + " " + order + comma;
            ++index;
        }
    }
    return [orderByStr, searchByStr];
}

module.exports = {displayBooks, displayBook, getString};