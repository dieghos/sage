import { Task } from './task';

export class User{
  constructor(
    public _id?: String,
    public username?: String,
    public password?: String,
    public grado?: String,
    public legajo?: String,
    public apellido?: String,
    public nombres?: String,
    public roles?:String,
    public photo?:String,
    public tasks?:Task[]
  ){}


}
