import {inject, injectable} from "inversify";
import {Fulfillment} from "../Fulfillment";
import {Logger} from "../../utils/log/Logger";
import {FindAirportManager} from "../../managers/FindAirportManager";
import {City} from "../../model/City";
import {TYPES} from "../../di/types";

@injectable()
class FindAirportFulfillment implements Fulfillment {

    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.FindAirportManager) private findAirportManager: FindAirportManager
    ) {}

    initialize(dialogflowApp: any) {
        this.buildFindAirportFulfilment(dialogflowApp);
    }

    private buildFindAirportFulfilment(dialogflowApp: any) {
        dialogflowApp.intent("Find an Airport", async (conv, { city }) => {
            try {
                const cityObj = new City(city);
                try {
                    const airport = await this.findAirportManager.getAirportForCity(cityObj);
                    if (airport) {
                        conv.close(`The airport in ${city} is ${airport.name}.`);
                    } else {
                        conv.ask(`I didn't find any airports in ${city}, please tell me different city.`);
                    }
                } catch (e) {
                    this.logger.error(`Cannot find airport for city: ${city}`);
                    conv.ask("There was an error while searching airport, please try again.");
                }
            } catch (err) {
                this.logger.error(err);
            }
        });
    }

}

export { FindAirportFulfillment }