import { FunctionComponent, InputHTMLAttributes } from "react";
import {  
  FieldError,  
  FieldErrorsImpl,  
  Merge,  
  UseFormRegisterReturn,
} from "react-hook-form";

export type HookForm = {
  id?: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  label?: string;
  accept?: string;
  register: UseFormRegisterReturn;
  errors?: FieldError | Merge<FieldError, FieldErrorsImpl>;
};
const FormInput: FunctionComponent<HookForm> = ({
  id,
  type,
  placeholder,
  label,
  accept,
  register,
  errors,
}:HookForm) => {
  return (
    <>
      {label ?? (<label className="text-red-500 text-sm text-center">
        {label}</label>)}
      <input
        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        id={id}
        type={type}
        accept={accept}
        placeholder={placeholder}
        {...register}
      />
      {errors  ? (
        <p className="text-red-500 text-sm text-center">
          {(errors.message as string)}
        </p>
      ):null}
    </>
  );
};
export default FormInput;
