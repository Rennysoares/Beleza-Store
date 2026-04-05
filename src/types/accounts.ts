export type Account = {
  id: number;
  cliente_id: number;
  saldo_devedor: number;
  status: 'aberta' | 'fechada';
};