const fs = require('fs').promises;

class User {
  constructor() {
    this.path = './database/users.json';
  }

  async findByID(id) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      const users = JSON.parse(data);
      const user = users.find(user => user.id === id);

      return user ? user : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async findByEmail(email) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      const users = JSON.parse(data);
      const user = users.find(user => user.email === email);

      return user ? user : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async create(record) {
    try {
      const data = await fs.readFile(this.path, 'utf8');

      let users = JSON.parse(data);
      users.push(record)

      await fs.writeFile(this.path, JSON.stringify(users));

      return record;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = User;
