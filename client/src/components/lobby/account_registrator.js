
// Registration status.
const REGISTRATION_SUCCEEDED = "Registration succeeded";
const REGISTRATION_FAILURE = "Failed to perform registration";

class AccountRegistrator {
  constructor(server) {
    this.server = server;

    this.registrationStatus = "";
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
  }

  async register(account) {
    // In case the account is not valid, do nothing.
    if (account.mail === "" || account.name === "" || account.password === "") {
      return REGISTRATION_FAILURE;
    }

    // Fetch accounts;
    await this.registerAccount(account).catch(err => this.registrationStatus = err);

    // In case the fetching failed, return the status.
    if (this.registrationStatus !== "") {
      return this.registrationStatus;
    }

    return REGISTRATION_SUCCEEDED;
  }
}

export {
  REGISTRATION_SUCCEEDED,
  REGISTRATION_FAILURE
};

export default AccountRegistrator;
