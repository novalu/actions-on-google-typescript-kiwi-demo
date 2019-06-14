import {inject, injectable} from "inversify";
import { TYPES } from "../functions/src/di/types";
import {Logger} from "../functions/src/utils/log/Logger";
import {FruitsStorage} from "../functions/src/storages/fruits/FruitsStorage";
import {FindAirportManager} from "../functions/src/managers/FindAirportManager";
import {City} from "../functions/src/model/City";

@injectable()
class TestApp {

    constructor(
        @inject(TYPES.FindAirportManager) private findAirportManager: FindAirportManager,
        @inject(TYPES.Logger) private logger: Logger
    ) {}

    public async start() {
        const airport = await this.findAirportManager.getAirportForCity(new City("Prague"));
        this.logger.debug(airport.name);
        process.exit(0);
    }

}

export { TestApp }