const axios = require("axios");

class Swyftx {
  #api;
  isDemoMode;

  constructor({ accessToken, isDemoMode } = { isDemoMode: false }) {
    this.isDemoMode = isDemoMode;

    const baseURL = this.isDemoMode
      ? "https://api.demo.swyftx.com.au"
      : "https://api.swyftx.com.au";

    // Set config defaults when creating the instance
    // We will set ours to be the demo
    this.#api = axios.create({
      baseURL,
    });

    // Alter defaults after instance has been created
    this.#api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }

  /**
   * Accessor for the `account` endpoints in the API reference.
   * @see https://docs.swyftx.com.au/#/reference/account
   */
  get account() {
    return {
      profile: {
        // Path the naming follows reference URL.
        // For example, this function uses https://docs.swyftx.com.au/#/reference/account/profile/get-profile
        // so we will make the accessor `instance.account.profile.getProfile`.
        // This is subject to change.
        getProfile: () => {
          if (this.isDemoMode) {
            this.#unsupportedEndpoint();
          }

          return this.#api.get("/user").then(({ data }) => data);
        },
      },
    };
  }

  get address() {
    return {
      deposit: {
        getActiveAddressesV2: (assetId, networkId) => {
          return this.#api
            .get(`/v1/address/deposit/${assetId}/${networkId}?version=2`)
            .then(({ data }) => data);
        },
      },
    };
  }

  get info() {
    return {
      info: {
        getInfo: () => {
          if (this.isDemoMode) {
            this.#unsupportedEndpoint();
          }

          return this.#api.get("/info/info/get-info").then(({ data }) => data);
        },
      },
    };
  }

  /**
   * Helper for us to raise an error for an unsupported endpoint when using a demo account.
   * For available methods, check the docs.
   * @see https://docs.swyftx.com.au/#/introduction/demo-mode
   */
  #unsupportedEndpoint() {
    throw new Error("Endpoint not supported in demo mode");
  }
}

module.exports = {
  Swyftx,
};
