/**
 * User model
 *
 */

//TODO add fields
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.date = null;
    this.token = null;
    this.status = null;
    Object.assign(this, data);
  }
}
export default User;
