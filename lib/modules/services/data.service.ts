import DataModel from '../schemas/data.schema';
import {IData, Query} from "../models/data.model";

export default class DataService {

    public async createData(dataParams: IData) {
        try {
            const dataModel = new DataModel(dataParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }
    public async deleteData(deviceID: string) {
        // await DataModel.deleteMany({deviceId: deviceID}
        // ).limit(1).sort({$natural: -1});
        const lastDocument = await DataModel.findOne({ deviceId: deviceID }).sort({ $natural: -1 });

        if (lastDocument) {
            await DataModel.deleteOne({ _id: lastDocument._id });
        }
    }
    
    public async query(deviceID: string) {
        try {
            const data = await DataModel.find({deviceId: deviceID}, { __v: 0, _id: 0 });
            return data;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async lastestData(deviceID: string) {
        try {
            const data = await DataModel.find({deviceId: deviceID}, {__v: 0, _id: 0}).limit(1).sort({$natural: -1});
            return data;
        } catch (error) {
            throw new Error('Query failed: ${error}');
        }
    }
}
