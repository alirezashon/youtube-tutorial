export const isNumberValid = ({number}:{number:number}):string=>{
    if(number > 18 ) return 'yes valid'
    else return 'no it is not valid'
}