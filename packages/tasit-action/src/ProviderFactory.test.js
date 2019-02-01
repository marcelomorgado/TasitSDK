import ProviderFactory from "./ProviderFactory";
require("dotenv").config();

// Note: This test suite needs to be improved
describe("TasitAction.ProviderFactory", () => {
  it("should load config from .env file", async () => {
    const { PROVIDER_JSONRPC_URL, PROVIDER_JSONRPC_PORT } = process.env;
    const provider = ProviderFactory.getProvider();

    // Will throw if connection isn't established
    await provider.ready;

    const { connection } = provider;
    const { url } = connection;

    expect(url).to.equal(`${PROVIDER_JSONRPC_URL}:${PROVIDER_JSONRPC_PORT}`);
  });
});
