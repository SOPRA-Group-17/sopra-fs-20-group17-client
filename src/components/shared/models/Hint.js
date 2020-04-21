class Hint {
  constructor(data = {}) {
    this.term = null;
    this.guess = null;
    this.hints = [];
    Object.assign(this, data);
  }
}
export default Hint;
