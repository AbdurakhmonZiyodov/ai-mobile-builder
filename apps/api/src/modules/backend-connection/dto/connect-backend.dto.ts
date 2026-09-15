import { connectBackendInput, type ConnectBackendInput } from "@amb/contracts";

export { connectBackendInput };
export type ConnectBackendDto = ConnectBackendInput;

/**
 * Ulanish holati — mijozga qaytariladigan yagona shakl.
 *
 * Kalitlarning O'ZI hech qachon qaytarilmaydi, faqat «bormi yo'qmi».
 * Bu ataylab: kalit bir marta kiritiladi va boshqa hech qachon o'qilmaydi.
 */
export interface BackendStatusDto {
  connected: boolean;
  provider?: string;
  url?: string | null;
  hasAnonKey?: boolean;
  serviceRoleActive?: boolean;
  serviceRoleDeletedAt?: Date | null;
}
