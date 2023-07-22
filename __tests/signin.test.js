const mongoose = require("mongoose");
const User = require("../models/User");
const request = require("supertest");
const createServer = require("../utils/createServer");

const app = createServer();

describe("Sign in", () => {
	beforeAll(async () => {
		const connection = await mongoose.connect(String(process.env.DATABASE_URI), {
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

	it("should create a new agent and send statuscode 201", async () => {
		const email = "test@email.com";
		const res = await request(app).post("/signin/agent").send({
			email: email,
			password: "test",
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body.success).toEqual(
			`New agent with email: ${email} created!`
		);

		let user = await User.findOne({ email: email }).exec();

		expect(user.email).toEqual(email);
		expect(user.user_type).toEqual("agent");
	});

	it("should create a new candidate and send statuscode 201", async () => {
		const email = "newtest@email.com";
		const res = await request(app).post("/signin/candidate").send({
			email: email,
			password: "test",
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body.success).toEqual(
			`New candidate with email: ${email} created!`
		);

		const user = await User.findOne({ email: email }).exec();
		expect(user.email).toEqual(email);
		expect(user.user_type).toEqual("candidate");
	});

	it("should't create a new user because the user already exist and send statuscode 409 Conflict ", async () => {
		const res = await request(app).post("/signin/agent").send({
			email: "test@email.com",
			password: "test",
		});
		expect(res.statusCode).toEqual(409);
	});

	it("should't create a new user because the email attribute missing and send statuscode 400 ", async () => {
		const res = await request(app).post("/signin/agent").send({
			password: "test",
		});
		expect(res.statusCode).toEqual(400);
	});

	it("should't create a new user because the email attribute is invalid and send statuscode 400 ", async () => {
		const res = await request(app).post("/signin/agent").send({
			email: "testemail.com",
			password: "test",
		});
		expect(res.statusCode).toEqual(400);
	});
});
