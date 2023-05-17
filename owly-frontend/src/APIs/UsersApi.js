import Api from "./Api";

class UsersApi extends Api {
	constructor() {
		super("http://localhost:8080/api/v1/users");
	}

	async login({ email, password }) {
		return await this.post("/login", { email, password });
	}

	async getUserById(id) {
		return await this.get(`/${id}`);
	}

	async updateUser({ userId, roleId, schoolId, firstname, lastname }) {
		return await this.patch(`/${userId}`, {
			roleId,
			schoolId,
			firstname,
			lastname,
		});
	}

	async getAllUsers() {
		return await this.get();
	}

	async getCurrentUser() {
		return await this.get(`/me`);
	}

	async createUser({ firstname, lastname, email, roleId, schoolId }) {
		return await this.post("", {
			firstname,
			lastname,
			email,
			roleId,
			schoolId,
		});
	}
}

export default UsersApi;
