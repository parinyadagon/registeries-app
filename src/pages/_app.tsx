import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { SessionProvider } from "next-auth/react";

import DefaultLayout from "@/components/layout/DefaultLayout";

import store from "@/slice/store";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <MantineProvider theme={{ colorScheme: "light", fontFamily: "Prompt" }}>
          <ModalsProvider>
            <Provider store={store}>
              <DefaultLayout>
                <Component {...pageProps} />
              </DefaultLayout>
            </Provider>
          </ModalsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
