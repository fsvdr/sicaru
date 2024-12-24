// Reference: https://github.com/formspark/formson
const toJSON = (formData: FormData) => {
  const object: Record<string, any> = {};

  formData.forEach((value, key) => {
    const parts = key.split(/[.\[\]]+/).filter(Boolean);
    let current = object;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const nextPart = parts[index + 1];
      const isNextArray = !isLast && !isNaN(Number(nextPart));

      if (isLast) {
        const isBoolean = value === 'true' || value === 'false';
        const isEmptyArray = value === '[]';

        if (isBoolean) {
          current[part] = value === 'true';
        } else if (isEmptyArray) {
          current[part] = [];
        } else {
          current[part] = value;
        }
      } else {
        if (isNextArray) {
          if (!Array.isArray(current[part])) {
            current[part] = [];
          }
          current = current[part];
        } else {
          if (!(typeof current[part] === 'object' && current[part] !== null)) {
            current[part] = {};
          }
          current = current[part];
        }
      }
    });
  });

  return object;
};

export default toJSON;
