/** Ilova bo'ylab umumiy turlar. Domen turlari agent tomonidan shu yerga qo'shiladi. */

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
}

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };
