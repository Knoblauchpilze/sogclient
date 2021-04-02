
class Server {
  constructor(props) {
    this.url = "http://localhost";
    this.port = 3001;
  }

  handleErrors(res, cb, cbErr) {
    // This was helpful in desinging this pattern:
    // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
    if (!res.ok) {
      res.text()
        .then(text => cbErr(text))
        .catch(err => cbErr(err));

      return;
    }

    cb(res);
  }

  serverURL() {
    return this.url + ":" + this.port;
  }

  accountsURL() {
    return this.serverURL() + "/accounts";
  }

  registerAccount(account, cb, cbErr) {
    // Register the account to the server.
    const formData  = new FormData();
    formData.append("account-data", JSON.stringify(account));

    let opts = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    };

    fetch(this.accountsURL(), opts)
      .then(res => this.handleErrors(res, cb, cbErr))
      .catch(err => cbErr(err));
  }

  universesURL() {
    return this.serverURL() + "/universes";
  }

  playersURL() {
    return this.serverURL() + "/players";
  }
}

export default Server;
