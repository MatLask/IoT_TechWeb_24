import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];




class DataController implements Controller {
    public path = '/api/data';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(${this.path}/latest, this.getLatestId);
        this.router.post(${this.path}/post/:id, this.addData);
        this.router.get( ${this.path}/get/:id, this.getId);
        this.router.get( ${this.path}/get/:id/:num, this.getByValue);
        this.router.delete( ${this.path}/delete/:id, this.deleteId);
        this.router.delete( ${this.path}/delete/all, this.deleteAll);

    }

    private getLatestId = async (request: Request, response: Response, next: NextFunction) => {



        response.status(200).json(testArr);
    };

    private getId = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json(testArr[Number(request.params.id)]);
    };

    private getByValue = async (request: Request, response: Response, next: NextFunction) => {
        let result: Number[] = [];
        for(let i = Number(request.params.id); i < testArr.length && i < Number(request.params.num); i++)
        {
            result.push(testArr[i]);
        }
        response.status(200).json(result);
    };

    private deleteId = async (request: Request, response: Response, next: NextFunction) => {
        const index = testArr.indexOf(Number(request.params.id), 0);
        if (index > -1) {
            testArr.splice(index, 1);
        }

        response.status(200).json(testArr);
    };

    private deleteAll = async (request: Request, response: Response, next: NextFunction) => {
        testArr = [];

        response.status(200).json(testArr);
    };

    private addData = async (request: Request, response: Response, next: NextFunction) => {
    const { elem } = request.body;

testArr.push(elem);

response.status(200).json(testArr);
};
}


export default DataController;
