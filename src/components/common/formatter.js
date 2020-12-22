import { ROUTES } from "../../const";

const moment = require("moment-timezone");

export default class Formatter {

    static getDate(time, format="MMM DD HH:mm:ss"){
        //return moment(time).tz("Europe/Amsterdam").format("MMM DD HH:mm:ss");
        return moment(time).format(format);
    }

    static getTweetDate(time){
      const format = "MMM DD HH:mm:ss";
      return moment(time).format(format);
    }

    static get basicDateFormat(){
      return "MM/DD/YYYY";
    }

    static get basicShortDateFormat(){
      return "MM/DD";
    }

    static get stockAverageDateFormat(){
      return "M/D";
    }

    static getTweetLink(userId, statusId){
        return `https://twitter.com/${userId}/status/${statusId}`
    }

    static getStockDeepLink(ticker){
        const route = `${ROUTES.TWEET}/${ticker}`;
        return route;
    }

    static filterDaily(data, minCount=50){
        return data.filter((element)=>{
            return (element.count >= minCount);
        })
    }

    static filterWeekly(data, minCount=50){
        return data.filter((element)=>{
            return (element.count >= minCount);
        })
    }

    static sort(data, sorting){
      if (data && sorting && Object.keys(sorting).length) {
        let key = Object.keys(sorting).find((sortKey)=>(sorting[sortKey]==='asc' || sorting[sortKey]==='des'));
        let dir = sorting[key];

        return data.sort((element1, element2) => {
          let var1 = element1[key];
          let var2 = element2[key];
          if(typeof var1 === "string"){
            var1 = parseFloat(var1.replace(/,/g, ""));
            var2 = parseFloat(var2.replace(/,/g, ""));
            if(isNaN(var1) || isNaN(var2)){
              return 0;
            }
          }

          if (var1 > var2) {
            return dir === "asc" ? 1 : -1;
          }
          if (var1 < var2) {
            return dir === "asc" ? -1 : 1;
          }
          return 0;
        });
      }
      //console.log({data, sorting});
      return data;
    }

    static updateSortObject(columnKey, sortObject){
      if(sortObject && sortObject[columnKey]){
        Object.keys(sortObject).forEach(key => {
          //If its the column to request sorting, we change it to its oposite.
          //Otherwise, we set it as none
          if(sortObject[key] === 'asc'){
            sortObject[key] = (columnKey === key) ? 'des' : 'none';
          }else if(sortObject[key] === 'des'){
            sortObject[key] = (columnKey === key) ? 'asc' : 'none';
          }else{
            sortObject[key] = (columnKey === key) ? 'asc' : 'none';
          }
        });
        return sortObject;
      }
    }

}