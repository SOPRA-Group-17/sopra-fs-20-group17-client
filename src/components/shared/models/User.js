/**
 * User model
 *
 */

//TODO remove unnecessary fields
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.password = null;
    this.creationDate = null;
    this.birthDate = null;
    this.name = null;
    this.score = null;
    this.role = null;
    this.game = null;
    Object.assign(this, data);
  }
}
export default User;
