export interface IDocumentationPage {
  id?: number;
  title?: string | null;
  content?: string | null;
}

export const defaultValue: Readonly<IDocumentationPage> = {};
