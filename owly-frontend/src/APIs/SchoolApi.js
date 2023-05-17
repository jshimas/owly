import Api from "./Api";

class SchoolsApi extends Api {
	constructor() {
		super("http://localhost:8080/api/v1/schools"); // Set the appropriate base URL for meetings endpoint
	}

	static async getAllSchools() {
		return await this.get();
	}

	async getSchoolById(id) {
		return await this.get(`/${id}`);
	}
}

export default SchoolsApi;
