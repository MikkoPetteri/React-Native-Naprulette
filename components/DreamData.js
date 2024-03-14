class DreamData {
  constructor() {
    this.state = "None";
  }

  setNapState(state) {
    this.state = state;
  }
  getNapState() {
    return this.state;
  }
}
  
export default new DreamData();