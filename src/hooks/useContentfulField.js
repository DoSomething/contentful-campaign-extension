import { useState, useEffect } from 'react';

const useContentfulField = sdk => {
  const initialValue = sdk.field.getValue();
  const [value, setState] = useState(initialValue);

  useEffect(() => {
    sdk.window.startAutoResizer();

    // Subscribe to external changes (e.g. another user edits this field):
    const detachChangeHandler = sdk.field.onValueChanged(setState);

    // Detach the event listener when component unmounts:
    return detachChangeHandler;
  }, []);

  function onChange(event) {
    const { value } = event.currentTarget;
    setState(value);

    // Persist the new value to the Contentful entry:
    sdk.field.setValue(value);
  }

  return [value, onChange];
};

export default useContentfulField;
