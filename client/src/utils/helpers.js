/* helpers.js: various helper function definitions. */
export function validateEmail(str) {
    return /.+@.+\..+/.test(str);
}

export function formatPhoneNumber(str) {
    if (str.length < 10) return "Error!";
    return `${str.slice(0,3)}-${str.slice(3,6)}-${str.slice(6,10)}`;
}

// convert a date from one's local timezone to UTC
export function utcDate(str) {
    let date = new Date(str); // implicitly read as UTC and converted to PDT
    // we will use the getUTC...() functions to undo the offset
    let newdate = new Date(
        date.getUTCFullYear(), 
        date.getUTCMonth(), 
        date.getUTCDate(), 
        date.getUTCHours(), 
        date.getUTCMinutes(), 
        date.getUTCSeconds()
    );
    return newdate;
}

// format a date as "Month DD, YYYY"
export function formatDate(str) {
    let date = new Date(parseInt(str));
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options);
}

// store data from database queries in indexedDB
export function idbPromise(storeName, method, object) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("parking-pal", 1);

        // create variables for database, transaction, object store
        let db, tx, store;

        // if version changed / first time using this, create object stores
        request.onupgradeneeded = function (e) {
            const db = request.result;
            // create object store for each type of data.
            // set primary key index to be the _id of the data
            db.createObjectStore("spaces", {
                keyPath: "_id"
            }); // spaces owned by user
            db.createObjectStore("inventory", {
                keyPath: "_id"
            }); // user's space inventory
            db.createObjectStore("reservations", {
                keyPath: "_id"
            }); // user's reservations
        };

        // handle any errors with connecting
        request.onerror = function (e) {
            console.error("Error:", e);
        };

        // on database open success
        request.onsuccess = function (e) {
            // save reference of the database
            db = request.result;
            // open a transaction for one of the object stores
            tx = db.transaction(storeName, "readwrite");
            // save reference to that object store
            store = tx.objectStore(storeName);

            // if an error occurs, log it
            db.onerror = function (e) {
                console.error("Error: ", e);
            };

            switch (method) {
                case "put":
                    store.put(object);
                    resolve(object);
                    break;
                case "get":
                    const all = store.getAll();
                    all.onsuccess = function () {
                        resolve(all.result);
                    };
                    break;
                case "delete":
                    store.delete(object._id);
                    break;
                default:
                    console.log("No valid method");
                    break;
            }

            // when transaction completes, close connection
            tx.oncomplete = function () {
                db.close();
            };
        };
    });
}

// gets today's date, plus an offset by x days, where x is an integer.
export function todaysDate(x = 0) {
    let today = new Date();
    today.setDate(today.getDate() + x);

    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    return today.toString();
}