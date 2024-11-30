import Validator from 'fastest-validator';

export const getValidator = () => {
    const v = new Validator();
    v.add('phone', function (_this, { messages = {} }) {
        const errorMessages = {
            phoneNumberStartsWith: "'{field}' must be started with '+'!",
            phoneNumberRequired: "'{field}' must have value.",
            phoneNumberExactLength: "'{field}' must have 11 or 12 numbers with country code.",
            phoneNumberOnlyNumbers: "'{field}' must not have other than numbers.",
            phoneNumberMinLength: "'{field}' must have at least 8 numbers.",
            phoneNumberMaxLength: "'{field}' must not have more than 14 numbers.",
            ...messages
        };
        return {
            source: `
                if(!value.startsWith('+')) {
                    ${_this.makeError({ type: "phoneNumberStartsWith", actual: "value", messages: errorMessages })}
                } else {
                    const number = value.substr(1, value.length);
                    // if(!value) {
                    //     ${_this.makeError({ type: "phoneNumberRequired", actual: "value", messages: errorMessages })}
                    // } else 
                    if(!(/^\\d*$/.test(number))) {
                        ${_this.makeError({ type: "phoneNumberOnlyNumbers", actual: "value", messages: errorMessages })}
                    } else if(number.length < 11 || number.length > 12) {
                        ${_this.makeError({ type: "phoneNumberExactLength", actual: "value", messages: errorMessages })}
                    } else {
                        return value;
                    }
                }
            `
        }
    });

    return v;
};

export const getSchema = ({ fieldType = 'string', validation = {} } = {}) => {

    let schema = {
        messages: validation.messages || {}
    };

    const {
        required = false,
        minLength,
        maxLength,
        type,
        items,
        field
    } = validation;

    const schemaType = type || fieldType;

    if (required === false) {
        schema.optional = true;
        schema.minLength = 1;
    }

    if (['email', 'phone', 'url', 'equal', 'array', 'boolean', 'number'].indexOf(schemaType) >= 0) {
        schema.type = schemaType;
    } else {
        schema.type = "string";
    }

    if (schemaType === 'equal') {
        schema.field = field;
    }

    if (schemaType === 'array') {
        schema.items = items;
    }

    if (minLength) {
        schema.min = minLength;
    }

    if (maxLength) {
        schema.max = maxLength;
    }

    if(schemaType === 'phone') {
        schema.minLength = 8;
        schema.maxLength = 15;
    }

    return schema;
};