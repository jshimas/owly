import axios from "axios";

class Api {
	constructor(baseURL) {
		this.client = axios.create({
			baseURL,
			withCredentials: true,
		});

		// Add common headers or configurations here
		// Example: this.client.defaults.headers.common['Authorization'] = 'Bearer <token>';
	}

	async get(url) {
		return await this.client.get(url);
	}

	async post(url, data = {}) {
		return await this.client.post(url, data);
	}

	async delete(url) {
		return await this.client.delete(url);
	}

	async update(url, data = {}) {
		return await this.client.update(url, data);
	}

	async patch(url, data = {}) {
		return await this.client.patch(url, data);
	}
}

export default Api;
