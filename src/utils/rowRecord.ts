export const isEmptyRecord = (object: any) => {
  console.log(object);
  return object && object.hasOwnProperty("_id");
};

export const promiseNull = () => {
  return new Promise((resolve) => {
    resolve(null);
  });
};
