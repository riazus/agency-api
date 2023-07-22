require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const request = require("supertest");
const createServer = require("../utils/createServer");

const app = createServer();

describe("Users", () => {
	let access_token1, access_token2, id1, id2;
	let email1 = "testUser1@email.com";
	let email2 = "testUser2@email.com";

	let password = "test";

	beforeAll(async () => {
		const connection = await mongoose.connect(globalThis.__MONGO_URI__, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		if (!connection) {
			console.log("we can't connect to the database");
		}
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	});

	it("should create a new agent 1 and send statuscode 201", async () => {
		const res = await request(app).post("/signin/agent").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body.success).toEqual(
			`New agent with email: ${email1} created!`
		);

		let user = await User.findOne({ email: email1 }).exec();

		expect(user.email).toEqual(email1);
		expect(user.user_type).toEqual("agent");
		id1 = user._id;
	});

	it("should create a new agent 2 and send statuscode 201", async () => {
		const res = await request(app).post("/signin/agent").send({
			email: email2,
			password: password,
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body.success).toEqual(
			`New agent with email: ${email2} created!`
		);

		let user = await User.findOne({ email: email2 }).exec();

		expect(user.email).toEqual(email2);
		expect(user.user_type).toEqual("agent");
		id2 = user._id;
	});

	it("should get the user info of the request user with a valid access token", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get("/user/me")
			.set("Authorization", `Bearer ${access_token1}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.email).toEqual(email1);
	});

	it("should get the user info of all the user", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get("/user")
			.set("Authorization", `Bearer ${access_token1}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.length >= 2).toBe(true);
	});

	it("should get the user info of the user 2 if id2 is a url param", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get(`/user/${id2}`)
			.set("Authorization", `Bearer ${access_token1}`);
		expect(res.statusCode).toEqual(200);

		expect(res.body.email).toEqual(email2);
	});
});
