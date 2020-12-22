import moment from 'moment-timezone';
import Formatter from './formatter';

export class AverageData {
    constructor(){
        this.ticker = "";
        this.tickerId = 0;
        this.date = new Date();   //
        this.occurrences = 0;
        this.sevendayAverage = 0;
    }

    get occurrenceVs7dayAvg(){
        return parseInt((this.occurrences / this.sevendayAverage)*100)
    }

    /**
     * @description Return DD/MM
     */
    get shortdate(){
        return moment(this.date).format(Formatter.stockAverageDateFormat);
    }

    getDate(format=Formatter.basicDateFormat){
        return moment(this.date).format(format);
    }
}

export class AverageDataFactory {
    /**
     * @description Data from /get_avg_occ_data.
     * @param {["ticker", "tickerId", "dateOnGMT", "occurrencesThatDay", "7dayAverage"][]} data
     */
    static parseFromDataArray(data){
        return data.map((element)=>this.parseFromElement(element))
    }

    /**
     * @description Parses from data element
     * @param {["ticker", "tickerId", "dateOnGMT", "occurrencesThatDay", "7dayAverage"]} element
     */
    static parseFromElement(element){
        const averageData = new AverageData();
        averageData.ticker = element[0];
        averageData.tickerId = element[1];
        averageData.date = new Date(element[2].replace("GMT",""));
        averageData.occurrences = parseInt(element[3]);
        averageData.sevendayAverage = parseFloat(element[4]);
        return averageData;
    }

    /**
     * @description Gets the data for the stock graphics
     * @param {AverageData[]} data The data to be parsed from
     */
    static parseDataForStock(data){
        let dats = [{
            ticker: "",
            date: "",
            avg: 0,
            daily: 0
        }];
        dats = [];
        const stateProps = {};

        data.forEach(element => {
            var avg = parseInt(element.sevendayAverage);
            if(avg<0){
                avg *= 1;
            }
            var group = { 
                ticker: element.ticker, 
                date: element.shortdate, 
                avg: parseInt(avg), 
                daily: parseInt(element.occurrences) 
            };
            dats.push(group);
        });

        const todayData = data[data.length - 2];

        const todaysAvg = Math.round(todayData.sevendayAverage);
        const dailyOcc = todayData.occurrences;
        const todaysOcc = todayData.occurrences;
        
        const percent = (dailyOcc / todaysAvg) * 100;
        const percentPie = (dailyOcc / todaysAvg) * 180;
        const todaysDec = Math.round(percent);

        let color = "red";

        if (todaysDec >= 100) {
            color = "green";
        }

        Object.assign(stateProps, {
            todaysAvg, 
            dailyOcc,
            todaysOcc, 
            todaysDec,
            info:'info-cont',
            graph:'graph',
            instruct:'no-show',
            percent: percentPie,
            color
        });

        return {
            dats,
            stateProps
        }
    }
}
/**
 * 0: "GOOS"
1: 2262
2: "Thu, 01 Oct 2020 00:00:00 GMT"
3: "5"
4: "34.1428571428571429"
 */