import { lazy } from "react"
import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import { store } from "@/common/storages/stores"
import { Provider } from "react-redux"
const AsyncMainRoute = lazy(() => import("./MainRoute"))
import { Message } from '@/utils';
import { getUITypeName } from 'ui/utils';
import { WalletProvider } from 'ui/utils';

const { PortMessage } = Message;

const portMessageChannel = new PortMessage();

portMessageChannel.connect(getUITypeName());

const wallet: Record<string, any> = new Proxy(
  {},
  {
    get(obj, key) {
      switch (key) {
        case 'openapi':
          return new Proxy(
            {},
            {
              get(obj, key) {
                return function (...params: any) {
                  return portMessageChannel.request({
                    type: 'openapi',
                    method: key,
                    params,
                  });
                };
              },
            }
          );
          break;
        default:
          return function (...params: any) {
            return portMessageChannel.request({
              type: 'controller',
              method: key,
              params,
            });
          };
      }
    },
  }
);

function Popup() {
  return (
    <WalletProvider wallet={wallet}>
      <Provider store={store}>
        <div className="h-200 w-125 bg-hard-black">
          <AsyncMainRoute />
        </div>
      </Provider>
    </WalletProvider>
  )
}

export default Popup
