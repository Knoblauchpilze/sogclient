
// Registration status.
const REGISTRATION_SUCCEEDED = "Registration succeeded";
const REGISTRATION_FAILURE = "Failed to perform registration";

class AccountRegistrator {
  constructor(server) {
    this.server = server;

    this.registrationStatus = "";
    this.accountID = "";
  }

  async registerAccount(acc) {
    // Generate data to send to the server to register
    // the account.
    const formData  = new FormData();
    formData.append(this.server.accountsDataKey(), JSON.stringify(acc));

    let opts = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    };

    // Execute the request.
    let reqStatus = "";

    const res = await fetch(this.server.accountsURL(), opts)
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      this.registrationStatus = reqStatus;
      return;
    }

    if (!res.ok) {
      this.registrationStatus = await res.text();
      return;
    }

    // Fetch the identifier returned by the server.
    // It is returned through a format that is not
    // exactly pure so we clean it through a server
    // dedicated method.
    const id = await res.text();
    return this.server.accountIDFromResponse(id);
  }

  async register(account) {
    let res = {
      account: account,
      status: REGISTRATION_FAILURE,
    };

    // In case the account is not valid, do nothing.
    if (account.mail === "" || account.name === "" || account.password === "") {
      return res;
    }

    // Fetch accounts;
    const id = await this.registerAccount(account).catch(err => this.registrationStatus = err);

    // In case the fetching failed, return the status.
    if (this.registrationStatus !== "") {
      res.status = this.registrationStatus;
      return res;
    }

    if (id === "") {
      res.status = REGISTRATION_FAILURE;
    }

    res.id = id;
    res.status = REGISTRATION_SUCCEEDED;

    return res;
  }
}

export {
  REGISTRATION_SUCCEEDED,
  REGISTRATION_FAILURE
};

export default AccountRegistrator;
