export function getHrefFromString(str: string){
    return `${str.toLowerCase().replace(" ", "_")}`;
}