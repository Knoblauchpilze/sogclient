
class Universe {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.country = props.country;
    this.online = props.online;
    this.kind = props.kind;
    this.age = props.age;
  }

  valid() {
    return this.id !== "";
  }

}

export default Universe;
