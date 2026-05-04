export interface CategoryDto{
    id:string,
    name:string,
    slug:string,
    parent?:string | null,
    level:number,
    isActive:boolean,
    createdAt: string;
}