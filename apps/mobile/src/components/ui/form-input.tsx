import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { type TextInputProps } from "react-native";

import { Input } from "./input";

interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, "value" | "onChangeText"> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          label={label}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
}
