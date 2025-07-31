export default interface ValidateDto {
  id: number;
  username: string;
  email?: string | null;
  status?: string | null;
}
