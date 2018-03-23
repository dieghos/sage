import { User } from '../users/user';

export class File{
  constructor(
    public _id?:string,
    public file_code?: string,
    public description?: string,
    public comments?: string,
    public entry_date?: Date,
    public images_path?: string[],
    public etx?: string,
    public time_limit?: Date,
    public status?: string,
    public last_status_date?: Date,
    public assigned?: User
  ){}
}
