import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import {
  Description,
  Field,
  Input as HeadlessInput,
  Label,
} from "@headlessui/react";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  description?: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  return (
    <Field>
      <Label className="block text-sm/6 font-medium text-white">
        {props.label}
      </Label>
      {props.description ?? <Description>{props.description}</Description>}
      <div className="mt-2 grid grid-cols-1">
        <HeadlessInput
          name={props.name}
          type={props.type}
          placeholder={props.placeholder}
          aria-invalid={!!props.error}
          aria-describedby={`${props.name}-error`}
          className={
            props.error
              ? "col-start-1 row-start-1 block w-full rounded-md bg-white/5 py-1.5 pr-10 pl-3 text-base text-red-600 outline-1 -outline-offset-1 outline-red-300 placeholder:text-red-300 focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:pr-9 sm:text-sm/6"
              : "col-start-1 row-start-1 block w-full rounded-md bg-white/5 py-1.5 pr-10 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-500 sm:pr-9 sm:text-sm/6"
          }
          autoComplete={props.autoComplete}
          required={!!props.required}
          onChange={props.onChange}
        />
        {props.error ? (
          <ExclamationCircleIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
          />
        ) : null}
      </div>
      {props.error ? (
        <p id={`${props.name}-error`} className="mt-2 text-sm text-red-600">
          {props.error}
        </p>
      ) : null}
    </Field>
  );
}
