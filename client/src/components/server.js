
class Server {
  constructor() {
    this.url = "http://localhost";
    this.port = 3001;
  }

  serverURL() {
    return this.url + ":" + this.port;
  }

  accountsURL() {
    return this.serverURL() + "/accounts";
  }

  accountsDataKey() {
    return "account-data";
  }

  universesURL() {
    return this.serverURL() + "/universes";
  }

  playersURL() {
    return this.serverURL() + "/players";
  }
}

const NullAccount = {
  id: "",
  name: "",
  mail: "",
  password: "",
};

export default Server;
export { NullAccount };
