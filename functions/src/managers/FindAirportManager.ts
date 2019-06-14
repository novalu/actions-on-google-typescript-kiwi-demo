import {inject, injectable} from "inversify";
import {TYPES} from "../di/types";
import {Logger} from "../utils/log/Logger";
import {NetworkRequest} from "../utils/network/NetworkRequest";
import {Airport} from "../model/Airport";
import {City} from "../model/City";

@injectable()
class FindAirportManager {

    private readonly URL = "https://kiwicom-prod.apigee.net/locations/query?locale=en-US&location_types=airport&limit=10&active_only=true";
    private readonly API_KEY = "";

    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.NetworkRequest) private networkRequest: NetworkRequest
    ) {}

    private getUrlForCity(city: City) {
        return `${this.URL}&term=${city.name}`;
    }

    private parseResponse(response: any): Airport {
        //this.logger.debug(response);
        if (response.locations[0].name) {
            const location = response.locations[0];
            const countryName = location.city.country.name;
            const airportName = location.name;
            return new Airport(airportName, countryName);
        } else {
            this.logger.warn(`Cannot find airport for city`);
            return undefined;
        }
    }

    async getAirportForCity(city: City): Promise<Airport> {
        const response = await this.networkRequest
            .getJson(this.getUrlForCity(city))
            .set("apiKey", this.API_KEY);
        return await this.parseResponse(response.body);
    }

}

export { FindAirportManager }