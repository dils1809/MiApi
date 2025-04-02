const db = require('../db');

class Incident {
    static create({ reporter, description, status }, callback) {
        db.run(`INSERT INTO incidents (reporter, description, status) VALUES (?, ?, ?)`,
            [reporter, description, status], function (err) {
                callback(err, this?.lastID);
            });
    }

    static getAll(callback) {
        db.all(`SELECT * FROM incidents`, [], callback);
    }

    static getById(id, callback) {
        db.get(`SELECT * FROM incidents WHERE id = ?`, [id], callback);
    }

    static updateStatus(id, status, callback) {
        db.run(`UPDATE incidents SET status = ? WHERE id = ?`, [status, id], function (err) {
            callback(err, this.changes);
        });
    }

    static delete(id, callback) {
        db.run(`DELETE FROM incidents WHERE id = ?`, [id], function (err) {
            callback(err, this.changes);
        });
    }
}

module.exports = Incident;
