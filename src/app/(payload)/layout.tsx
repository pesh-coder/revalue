/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import Link from 'next/link'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) =>
  !process.env.DATABASE_URL ? (
    <html lang="en">
      <body>
        <main className="revalue-admin-setup">
          <h1>Connect the Revalue CMS</h1>
          <p>
            The admin portal needs a PostgreSQL connection before you can sign in, edit content or
            upload files.
          </p>
          <p>
            Configure the local environment, then create the first administrator using the setup
            instructions in README.md.
          </p>
          <Link href="/">Return to the website preview</Link>
        </main>
      </body>
    </html>
  ) : (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )

export default Layout
