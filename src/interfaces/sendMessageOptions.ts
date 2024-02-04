export interface ISendMessageOptions {
  delayValue: number;
  ctx?: any;
  message?: string | number;
  action?: (ctx?: any) => Promise<any>;
}
