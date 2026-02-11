import { Select, SelectProps } from 'antd';

type ClassicSelectProps = {
  value?: string | null;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  bordered?: boolean;
  placeholder?: string;
};

export const ClassicSelect = (props: ClassicSelectProps & SelectProps) => {
  const handleChange = (value: string) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const { bordered = true, options, placeholder, ...otherProps } = props;

  return (
    <Select
      value={props.value}
      options={options}
      style={{ minWidth: 145 }}
      onChange={handleChange}
      variant={'borderless'}
      placeholder={placeholder}
      {...otherProps}
    />
  );
};
