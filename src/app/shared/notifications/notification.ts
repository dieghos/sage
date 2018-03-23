export class Notification{
  constructor(
    private _id?:string,
    private message?:string,
    private seen?:boolean,
    private create_date?:Date
  ){}
}
