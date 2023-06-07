export function currency(value: number){
    return Number(value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + " $";
}