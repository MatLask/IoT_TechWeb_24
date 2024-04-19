import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router, text} from 'express';
import {checkIdParam} from "../middlewares/deviceIdParam.middleware";
import DataService from "../modules/services/data.service";

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    public dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/:id/data`,checkIdParam, this.getAllDeviceData);
        this.router.post(`${this.path}/:id/data`,checkIdParam, this.addDataToDataBase);
        this.router.post(`${this.path}/:id`,checkIdParam, this.addData);
        this.router.get( `${this.path}/:id`,checkIdParam, this.getDataByValue);
        this.router.get( `${this.path}/:id/:num`,checkIdParam, this.getDataAmountByValue);
        this.router.delete( `${this.path}/:id`,checkIdParam, this.deleteDataByValue);
        this.router.delete( `${this.path}/all`, this.deleteAllDataByValue);

    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {



        response.status(200).json(testArr);
    };

    private getDataByValue = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json(testArr[Number(request.params.id)]);
    };

    private getDataAmountByValue = async (request: Request, response: Response, next: NextFunction) => {
        let result: Number[] = [];
        for(let i = Number(request.params.id); i < testArr.length && i < Number(request.params.num); i++)
        {
            result.push(testArr[i]);
        }
        response.status(200).json(result);
    };

    private deleteDataByValue = async (request: Request, response: Response, next: NextFunction) => {
        const index = testArr.indexOf(Number(request.params.id), 0);
        if (index > -1) {
            testArr.splice(index, 1);
        }

        response.status(200).json(testArr);
    };

    private deleteAllDataByValue = async (request: Request, response: Response, next: NextFunction) => {
        testArr = [];

        response.status(200).json(testArr);
    };

    private addData = async (request: Request, response: Response, next: NextFunction) => {
    const { elem } = request.body;
    //const { id } = request.params;

testArr.push(elem);

response.status(200).json(testArr);
};

    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
    };
    private deleteDataFromDevice = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
       const data = await this.dataService.deleteData(id);

        response.status(200).json(data);
    };

    private getLatestDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const Data = await this.dataService.lastestData(id);
        response.status(200).json(Data);
    };


    private addDataToDataBase = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;

        const data = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId: id,
            readingDate : new Date()
        }

        try {

            await this.dataService.createData(data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };

}

export default DataController;