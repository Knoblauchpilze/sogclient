
// List of possible validation.
const DUPLICATES_VERIFICATION = "duplicate";
const CREDENTIALS_VERIFICATION = "credentials";

// Validation status.
const VALID_ACCOUNT = "Account is valid";
const VALIDATION_FAILURE = "Failed to perform validation";
const INVALID_ACCOUNT = "Invalid account data";
const DUPLICATED_ACCOUNT = "Account already exists";
const ACCOUNT_NOT_FOUND = "Account does not exist";
const WRONG_CREDENTIALS = "Invalid credentials for account";

class AccountValidator {
  constructor(server) {
    this.server = server;

    this.fetchStatus = "";

    // No accounts are registered just yet.
    this.hasAccounts = false;
    this.accounts = [];
  }

  async fetchAccounts() {
    // Reset previous calls.
    this.fetchStatus = "";

    this.hasAccounts = false;
    this.accounts = [];

    // Fetch accounts from the server and discriminate
    // on the request's result.
    let reqStatus = "";

    const res = await fetch(this.server.accountsURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      this.fetchStatus = reqStatus;
      return;
    }
    if (!res.ok) {
      this.fetchStatus = res.statusText;
      return;
    }

    // Extract accounts in the local array.
    const rawAccounts = await res.text();
    this.accounts = JSON.parse(rawAccounts);
    this.hasAccounts = true;
  }

  async validate(account, operation) {
    // In case the account is not valid, do nothing.
    if (account.mail === "" || account.name === "" || account.password === "") {
      return INVALID_ACCOUNT;
    }

    // Fetch accounts;
    await this.fetchAccounts().catch(err => this.fetchStatus = err);

    // In case the fetching failed, do nothing.
    if (!this.hasAccounts || this.fetchStatus !== "") {
      console.error("Failed to fetch accounts: " + this.fetchStatus);
      return VALIDATION_FAILURE;
    }

    // Attempt to find this account in the list fetched
    // from the server.
    const foundAcc = this.accounts.find(a => a.mail === account.mail);

    // Return the validation status based on the type of
    // operation to perform on the account.
    let status = VALID_ACCOUNT;
    if (operation === DUPLICATES_VERIFICATION && foundAcc) {
      status = DUPLICATED_ACCOUNT;
    }
    if (operation === CREDENTIALS_VERIFICATION) {
      if (!foundAcc) {
        status = ACCOUNT_NOT_FOUND;
      } else if (foundAcc && foundAcc.password !== account.password) {
        status = WRONG_CREDENTIALS;
      }
    }

    return status;
  }
}

export { DUPLICATES_VERIFICATION, CREDENTIALS_VERIFICATION };
export {
  VALID_ACCOUNT,
  VALIDATION_FAILURE,
  INVALID_ACCOUNT,
  DUPLICATED_ACCOUNT,
  ACCOUNT_NOT_FOUND,
  WRONG_CREDENTIALS
};

export default AccountValidator;
