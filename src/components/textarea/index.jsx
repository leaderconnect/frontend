import useField from '../../hooks/field';

const AppTextarea = ({
    className = '',
    form = {},
    name = '',
    onChange = () => { },
    validation = {},
    ...props
}) => {
    const { setValue, fieldValue } = useField(form, { name, type: "string", validation });

    const onValueChange = ({ target: { value = '' } }) => {
        let inputValue = value;
        setValue(name, inputValue);
        onChange(value);
    };

    return (
        <textarea className={className} name={name} value={fieldValue} onChange={onValueChange} {...props}></textarea>
    );
};

export default AppTextarea;