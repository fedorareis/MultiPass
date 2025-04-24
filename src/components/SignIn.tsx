'use client';
import { useState } from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';
import { Heading } from './Catalyst/heading';
import { Field, FieldGroup, Fieldset, Label } from './Catalyst/fieldset';
import { Input } from './Catalyst/input';
import { Button } from './Catalyst/button';

export default function SignIn() {
  const [emailError, setEmailError] = useState('');
  // const [passwordError, setPasswordError] = useState("");

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="flex flex-col justify-center gap-3 text-center sm:mx-auto sm:w-full sm:max-w-sm">
        <KeyIcon aria-hidden="true" className="mx-auto h-8 text-cyan-500" />
        <Heading>Sign In</Heading>
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
                  autoComplete="email"
                  required
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
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Button type="submit" color="cyan">
                Submit
              </Button>
            </FieldGroup>
          </Fieldset>
        </form>
      </div>
    </div>
  );
}
