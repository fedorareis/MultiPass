'use client'
import Input from './Input'
import { useState } from 'react'
import ErrorCallout from './ErrorCallout'
import { KeyIcon } from '@heroicons/react/24/outline'

export default function Enrollment() {
  const [emailError, setEmailError] = useState('')
  // const [passwordError, setPasswordError] = useState("");
  const [submissionError, setSubmissionError] = useState('')

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <KeyIcon aria-hidden="true" className="mx-auto h-8 text-cyan-500" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Register your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <Input
                name="email"
                type="email"
                label="Email address"
                required
                autoComplete="email"
                error={emailError}
                onChange={(event) => {
                  if (!event.target.value.includes('@')) {
                    setEmailError('Please enter a valid email address')
                  } else {
                    setEmailError('')
                  }
                }}
              />
            </div>

            <div>
              <Input
                name="new-password"
                type="password"
                label="New Password"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <Input
                name="verify-password"
                type="password"
                label="Verify Password"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              {submissionError && (
                <ErrorCallout title="Error">{submissionError}</ErrorCallout>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-2xs hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
