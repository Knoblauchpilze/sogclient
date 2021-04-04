
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

  accountURL(id) {
    return this.serverURL() + "/accounts/" + id + "/players";
  }

  accountIDFromResponse(response) {
    // The response is expected to look like so:
    // '"[/accounts/id]"'. So first trim until
    // the beginning of the identifier.
    const parts = response.split('/');
    const idAndExtra = parts[parts.length - 1];

    // And then clean the end of the string.
    return idAndExtra.slice(0, idAndExtra.length - 2);
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
