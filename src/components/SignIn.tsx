"use client";
import { useState } from "react";
import Image from "next/image";
import Input from "./Input";

export default function SignIn() {
  const [emailError, setEmailError] = useState("");
  // const [passwordError, setPasswordError] = useState("");

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=cyan&shade=500"
            width={40}
            height={40}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign In
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <Input
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                required
                error={emailError}
                onChange={(event) => {
                  if (!event.target.value.includes("@")) {
                    setEmailError("Please enter a valid email address");
                  } else {
                    setEmailError("");
                  }
                }}
              />
            </div>

            <div>
              <Input
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
