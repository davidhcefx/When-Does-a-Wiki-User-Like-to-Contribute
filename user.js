const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('users.db');

db = db.run(
  `CREATE TABLE IF NOT EXISTS users (
    userName TEXT,
    stats TEXT,
    time DATETIME DEFAULT CURRENT_TIMESTAMP)`
);

/**
 * Count the number of contributions in each 1 hour intervals.
 * @param {string} userName
 * @returns {Object.<string, number>}
 */
exports.getStats = (userName) => {
  // first look up if already in db
  db.get('SELECT stats FROM users WHERE userName = ?', userName, (err, row) => {
    if (row !== undefined) {
      // TODO: how to read/write blobs
      return {1: 2};
    }
    // else fetch from Wiki
    const stats = fetchStats(userName);
    db.run('INSERT INTO users VALUES (?, ?)', userName, stats);
    trimDatabase(10);
    // TODO: how big is reasonable?
    
    return stats;
  });
}

/**
 * Fetch user statistics directly from Wiki.
 * @param {string} userName
 * @returns {Object.<string, number>}
 */
function fetchStats(userName) {
  return 'test';
}

/**
 * Throw away old entries if database is too large.
 * @param {number} maxLength
 */
function trimDatabase(maxLength) {
  db.get('SELECT COUNT(*) FROM users', (err, row) => {
    if (parseInt(row) > maxLength) {
      db.run('DELETE FROM users ORDER BY time DESC LIMIT 5');
    }
  });
}
