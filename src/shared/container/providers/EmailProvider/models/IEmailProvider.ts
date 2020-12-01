import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IEmailProvider {
  send(data: ISendMailDTO): Promise<boolean>;
}
