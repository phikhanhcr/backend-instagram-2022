interface ICrud {
  create: (data: any) => void;
  get: (getBy: any) => void;
  delete: (id: string) => void;
}

export { ICrud };
