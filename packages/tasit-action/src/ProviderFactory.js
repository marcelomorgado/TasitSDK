import "ethers/dist/shims.js";
// Note: ethers SHOULD be imported from their main object
// shims aren't injected with package import
import { ethers } from "ethers";
import {
  PROVIDER_NETWORK,
  PROVIDER_TYPE,
  PROVIDER_POLLING_INTERVAL,
  PROVIDER_JSONRPC_URL,
  PROVIDER_JSONRPC_PORT,
  PROVIDER_JSONRPC_USER,
  PROVIDER_JSONRPC_PASSWORD,
  PROVIDER_JSONRPC_ALLOW_INSECURE,
  INFURA_API_KEY,
  ETHERSCAN_API_KEY,
  EVENTS_TIMEOUT,
} from "react-native-dotenv";

const MAINNET = "mainnet";

export class ProviderFactory {
  // Since 'config' doesn't supported by expo/react-native we are using dotenv
  // to handle config parameters for now.
  // A solution like 'config' is better because allows user create dynamic configurations since the config file is a js file.
  // As short term solution, we are keeping de code as before and using that parse ENV-to-object function.
  static getConfig = () => {
    return {
      provider: {
        network: PROVIDER_NETWORK,
        provider: PROVIDER_TYPE,
        pollingInterval: Number(PROVIDER_POLLING_INTERVAL),
        jsonRpc: {
          url: PROVIDER_JSONRPC_URL,
          port: Number(PROVIDER_JSONRPC_PORT),
          user: PROVIDER_JSONRPC_USER,
          password: PROVIDER_JSONRPC_PASSWORD,
          allowInsecure: Boolean(PROVIDER_JSONRPC_ALLOW_INSECURE),
        },
        infura: {
          apiKey: INFURA_API_KEY,
        },

        etherscan: {
          apiKey: ETHERSCAN_API_KEY,
        },
      },
      events: {
        timeout: Number(EVENTS_TIMEOUT),
      },
    };
  };

  static getProvider = () => {
    const { provider } = ProviderFactory.getConfig();
    const json = provider;
    return ProviderFactory.createProvider(json);
  };

  static getDefaultConfig = () => {
    return {
      network: MAINNET,
      provider: "fallback",
      pollingInterval: 4000,
      jsonRpc: {
        url: "http://localhost",
        port: 8545,
        allowInsecure: false,
      },
    };
  };

  static createProvider = ({
    network,
    provider,
    pollingInterval,
    jsonRpc,
    infura,
    etherscan,
  }) => {
    const networks = ["mainnet", "rinkeby", "ropsten", "kovan", "other"];
    const providers = ["default", "infura", "etherscan", "jsonrpc"];

    if (!networks.includes(network)) {
      throw new Error(`Invalid network, use: [${networks}].`);
    }

    if (!providers.includes(provider)) {
      throw new Error(`Invalid provider, use: [${providers}].`);
    }

    if (provider === "fallback") network = "default";
    if (network === "mainnet") network = "homestead";
    else if (network === "other") network = undefined;

    const defaultConfig = ProviderFactory.getDefaultConfig();

    let ethersProvider;

    switch (provider) {
      case "default":
        ethersProvider = ethers.getDefaultProvider(network);

      case "infura":
        ethersProvider = new ethers.providers.InfuraProvider(
          network,
          infura.apiKey
        );

      case "etherscan":
        ethersProvider = new ethers.providers.EtherscanProvider(
          network,
          etherscan.apiKey
        );

      case "jsonrpc":
        let { url, port, user, password, allowInsecure } = jsonRpc;
        if (url === undefined) url = defaultConfig.jsonRpc.url;
        if (port === undefined) port = defaultConfig.jsonRpc.port;
        if (allowInsecure === undefined)
          allowInsecure = defaultConfig.jsonRpc.allowInsecure;

        ethersProvider = new ethers.providers.JsonRpcProvider(
          { url: `${url}:${port}`, user, password, allowInsecure },
          network
        );
    }

    if (pollingInterval) ethersProvider.pollingInterval = pollingInterval;
    return ethersProvider;
  };
}

export default ProviderFactory;
