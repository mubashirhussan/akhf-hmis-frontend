'use client';

import { createContext, useContext } from 'react';

const FormFieldPrefixContext = createContext('form-field');

export function FormFieldPrefixProvider({ prefix = 'form-field', children }) {
  return (
    <FormFieldPrefixContext.Provider value={prefix}>{children}</FormFieldPrefixContext.Provider>
  );
}

export function useFormFieldPrefix() {
  return useContext(FormFieldPrefixContext);
}

export function formFieldId(prefix, name) {
  const key = Array.isArray(name) ? name.join('-') : String(name);
  return `${prefix}-${key}`;
}
