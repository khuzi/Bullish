import StockMainPage from '.';
import {getServerSideProps as AsyncF} from './index';

export default class StockIDPage extends StockMainPage {
}



export async function getServerSideProps(data){
    return AsyncF(data);
}