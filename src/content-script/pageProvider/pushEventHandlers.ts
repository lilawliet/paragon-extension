import { ethErrors } from "eth-rpc-errors";
import { ParagonProvider } from "./index";

class PushEventHandlers {
  provider: ParagonProvider;

  constructor(provider) {
    this.provider = provider;
  }

  _emit(event, data) {
    if (this.provider._initialized) {
      this.provider.emit(event, data);
    }
  }

  connect = (data) => {
    if (!this.provider._isConnected) {
      this.provider._isConnected = true;
      this.provider._state.isConnected = true;
      this._emit("connect", data);
    }
  };

  unlock = () => {
    this.provider._isUnlocked = true;
    this.provider._state.isUnlocked = true;
  };

  lock = () => {
    this.provider._isUnlocked = false;
  };

  disconnect = () => {
    this.provider._isConnected = false;
    this.provider._state.isConnected = false;
    this.provider._state.accounts = null;
    this.provider._selectedAddress = null;
    const disconnectError = ethErrors.provider.disconnected();

    this._emit("accountsChanged", []);
    this._emit("disconnect", disconnectError);
    this._emit("close", disconnectError);
  };

  accountsChanged = (accounts) => {
    if (accounts?.[0] === this.provider._selectedAddress) {
      return;
    }

    this.provider._selectedAddress = accounts?.[0];
    this.provider._state.accounts = accounts;
    this._emit("accountsChanged", accounts);
  };

  chainChanged = ({ chain, networkVersion }) => {
    this.connect({ chainId: chain });

    if (chain !== this.provider._chainId) {
      this.provider._chainId = chain;
      this._emit("chainChanged", chain);
    }

    if (networkVersion !== this.provider._networkVersion) {
      this.provider._networkVersion = networkVersion;
      this._emit("networkChanged", networkVersion);
    }
  };
}

export default PushEventHandlers;
