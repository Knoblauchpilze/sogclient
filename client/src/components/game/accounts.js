
// List of possible validation.
const ACCOUNT_FETCH = "fetch_account";
const EXISTENCE_VERIFICATION = "duplicate";
const CREDENTIALS_VERIFICATION = "credentials";

// Validation status.
const VALID_ACCOUNT = "Account is valid";
const VALIDATION_FAILURE = "Failed to perform validation";
const INVALID_ACCOUNT = "Invalid account data";
const DUPLICATED_ACCOUNT = "Account already exists";
const ACCOUNT_NOT_FOUND = "Account does not exist";
const WRONG_CREDENTIALS = "Invalid credentials for account";

// Registration status.
const ACCOUNTS_FETCH_SUCCEEDED = "Accounts fetched";
const ACCOUNTS_FETCH_FAILURE = "Failed to fetch accounts";

const ACCOUNT_FETCH_SUCCEEDED = "Account fetched";
const ACCOUNT_FETCH_FAILURE = "Failed to fetch account";

const ACCOUNT_REGISTRATION_SUCCEEDED = "Registration succeeded";
const ACCOUNT_REGISTRATION_FAILURE = "Failed to perform registration";

class AccountsModule {
  constructor(server) {
    this.server = server;
  }

  async fetchAccounts() {
    // Fetch accounts from the server and discriminate
    // on the request's result.
    let out = {
      status: ACCOUNTS_FETCH_FAILURE,
      accounts: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.accountsURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch accounts: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = ACCOUNTS_FETCH_SUCCEEDED;

    // Extract accounts into a meaningful object.
    const rawAccounts = await res.text();
    out.accounts = JSON.parse(rawAccounts);

    return out;
  }

  async validate(account, operation) {
    let res = {
      account: account,
      status: INVALID_ACCOUNT,
    };

    // In case the account is not valid, do nothing.
    // We consider no name as valid as the server
    // will generate one anyway.
    if (account.mail === "" || account.name === "" || account.password === "") {
      return res;
    }

    // Fetch accounts.
    let reqStatus = "";
    const out = await this.fetchAccounts().catch(err => reqStatus = err);

    // In case the fetching failed, do nothing.
    if (out.status !== ACCOUNTS_FETCH_SUCCEEDED) {
      console.error("Failed to fetch accounts: " + out.status);
      res.status = VALIDATION_FAILURE;
      return res;
    }
    if (reqStatus !== "") {
      res.status = reqStatus;
      return res;
    }

    // Attempt to find this account in the list fetched
    // from the server.
    const foundAcc = out.accounts.find(a => a.mail === account.mail);

    // Return the validation status based on the type of
    // operation to perform on the account.
    res.status = VALID_ACCOUNT;
    if (operation === ACCOUNT_FETCH) {
      if (!foundAcc) {
        res.status = ACCOUNT_NOT_FOUND;
      }
    }
    if (operation === EXISTENCE_VERIFICATION) {
      if (foundAcc) {
        res.status = DUPLICATED_ACCOUNT;
      }
    }
    if (operation === CREDENTIALS_VERIFICATION) {
      if (!foundAcc) {
        res.status = ACCOUNT_NOT_FOUND;
      }
      else if (foundAcc && foundAcc.password !== account.password) {
        res.status = WRONG_CREDENTIALS;
      }
    }

    // Update the account with the found account if the
    // status indicates that it is valid and a fetch is
    // requested.
    if (res.status === VALID_ACCOUNT &&
        (operation === ACCOUNT_FETCH || operation === CREDENTIALS_VERIFICATION))
    {
      res.account = foundAcc;
    }

    return res;
  }

  async fetch(account) {
    let res = {
      account: account,
      status: ACCOUNT_FETCH_FAILURE,
    };

    // Validate the account first (to make sure it's not
    // already an existing one).
    const valid = await this.validate(account, CREDENTIALS_VERIFICATION);
    if (valid.status !== VALID_ACCOUNT) {
      res.status = valid.status;
      return res;
    }

    res.status = ACCOUNT_FETCH_SUCCEEDED;
    res.account = valid.account;

    return res;
  }

  async registerAccount(acc) {
    let out = {
      id: "",
      status: ACCOUNT_REGISTRATION_FAILURE,
    };

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
      out.status = reqStatus;
      return out;
    }

    if (!res.ok) {
      out.status = await res.text();
      return out;
    }

    // Fetch the identifier returned by the server.
    // It is returned through a format that is not
    // exactly pure so we clean it through a server
    // dedicated method.
    const id = await res.text();
    out.id = this.server.accountIDFromResponse(id);
    out.status = ACCOUNT_REGISTRATION_SUCCEEDED;

    return out;
  }

  async register(account) {
    let out = {
      id: "",
      status: ACCOUNT_REGISTRATION_FAILURE,
    };

    // Validate the account first (to make sure it's not
    // already an existing one).
    const valid = await this.validate(account, EXISTENCE_VERIFICATION);
    if (valid.status !== VALID_ACCOUNT) {
      out.status = valid.status;
      return out;
    }

    // Register account.
    let reqStatus = "";
    const res = await this.registerAccount(account).catch(err => reqStatus = err);

    // In case the resitration failed, return the status.
    if (res.status !== ACCOUNT_REGISTRATION_SUCCEEDED) {
      out.status = res.status;
      return out;
    }
    if (reqStatus !== "") {
      out.status = reqStatus;
      return out;
    }

    if (res.id === "") {
      return out;
    }

    out.id = res.id;
    out.status = ACCOUNT_REGISTRATION_SUCCEEDED;

    return out;
  }
}

export {
  ACCOUNTS_FETCH_SUCCEEDED,
  ACCOUNT_FETCH_SUCCEEDED,
  ACCOUNT_REGISTRATION_SUCCEEDED,
};

export default AccountsModule;
