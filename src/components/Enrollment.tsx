'use client';
// import Input from './Input';
import { useState } from 'react';
import ErrorCallout from './ErrorCallout';
import { KeyIcon } from '@heroicons/react/24/outline';
import { Heading } from './Catalyst/heading';
import { Field, FieldGroup, Fieldset, Label } from './Catalyst/fieldset';
import { Button } from './Catalyst/button';
import { Input } from './Catalyst/input';

export default function Enrollment() {
  const [emailError, setEmailError] = useState('');
  // const [passwordError, setPasswordError] = useState("");
  const [submissionError, setSubmissionError] = useState('');

  const onSubmit = async (event) => {};

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col justify-center gap-3 text-center sm:mx-auto sm:w-full sm:max-w-sm">
          <KeyIcon aria-hidden="true" className="mx-auto h-8 text-cyan-500" />
          <Heading>Register your Account</Heading>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <Fieldset>
              <FieldGroup>
                <Field>
                  <Label>Email address</Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    // error={emailError}
                    onChange={(event) => {
                      if (!event.target.value.includes('@')) {
                        setEmailError('Please enter a valid email address');
                      } else {
                        setEmailError('');
                      }
                    }}
                  />
                </Field>

                <Field>
                  <Label>New Password</Label>
                  <Input
                    name="new-password"
                    type="password"
                    required
                    autoComplete="new-password"
                  />
                </Field>

                <Field>
                  <Label>Verify Password</Label>
                  <Input
                    name="verify-password"
                    type="password"
                    required
                    autoComplete="new-password"
                  />
                </Field>

                <Field>
                  {submissionError && (
                    <ErrorCallout title="Error">{submissionError}</ErrorCallout>
                  )}
                </Field>

                <Button type="submit" color="cyan">
                  Submit
                </Button>
              </FieldGroup>
            </Fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
