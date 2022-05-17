import { createContext, useContext } from 'react';
import { Object } from 'ts-toolbelt';

export type AccountController = Object.Merge<
  {
    openapi: {
      [key: string]: (...params: any) => Promise<any>;
    };
  },
  Record<string, (...params: any) => Promise<any>>
>;

const AccountContext = createContext<{
  account: AccountController;
} | null>(null);

const useAccount = () => {
  const { account } = useContext(AccountContext) as {
    account: AccountController;
  };

  return account;
};

export { AccountContext, useAccount };

// const AccountProvider = ({
//   children,
//   account,
// }: {
//   children?: ReactNode;
//   account: AccountController;
// }) => (
//   <AccountContext.Provider value={{ account }}>
//   {children}
//   </AccountContext.Provider>
// );