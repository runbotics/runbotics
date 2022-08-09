export interface IAction {
  id?: string;
  label?: string | null;
  script?: string | null;
  form?: string | null;
}

export const defaultValue: Readonly<IAction> = {};
