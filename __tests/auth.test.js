require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const request = require("supertest");
const createServer = require("../utils/createServer");

const app = createServer();

describe("Authentification", () => {
	let access_token;
	let email = "test1@email.com";
	let password = "test";
	let invalidEmail = "invalidtest@email.com";
	let invalidPwd = "invalidtest@email.com";
	let cookies;

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
		const res = await request(app).post("/signin/agent").send({
			email: email,
			password: password,
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body.success).toEqual(
			`New agent with email: ${email} created!`
		);

		let user = await User.findOne({ email: email }).exec();

		expect(user.email).toEqual(email);
		expect(user.user_type).toEqual("agent");
	});

	it("should login the user create a new refresh token and return access token", async () => {
		const res = await request(app).post("/auth").send({
			email: email,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token = res.body.accessToken;
		cookies = res.headers["set-cookie"];
	});

	it("should't login the user with invalid email and send statuscode 401 Unauthorize ", async () => {
		const res = await request(app).post("/auth").send({
			email: invalidEmail,
			password: password,
		});
		expect(res.statusCode).toEqual(401);
	});

	it("should't login the user with invalid password and send statuscode 401 Unauthorize ", async () => {
		const res = await request(app).post("/auth").send({
			email: email,
			password: invalidPwd,
		});
		expect(res.statusCode).toEqual(401);
	});

	it("should get the user info of the request user with a valid access token", async () => {
		let res = await request(app).post("/auth").send({
			email: email,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token = res.body.accessToken;

		res = await request(app)
			.get("/user/me")
			.set("Authorization", `Bearer ${access_token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.email).toEqual(email);
	});

	it("shouldn't get the user info of the request user with invalid access_token and return 403", async () => {
		let res = await request(app).post("/auth").send({
			email: email,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token = res.body.accessToken;

		res = await request(app)
			.get("/user/me")
			.set("Authorization", `Bearer fdsfds`);
		expect(res.statusCode).toEqual(403);
	});

	it("should use the refresh token and return a new access token", async () => {
		let res = await request(app).post("/auth").send({
			email: email,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		cookies = res.headers["set-cookie"];
		res = await request(app).get("/refresh").set("Cookie", cookies);
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token = res.body.accessToken;
	});

	it("shouldn't refresh access token if cookies don't exist and return 401", async () => {
		res = await request(app).get("/refresh");
		expect(res.statusCode).toEqual(401);
	});

	it("shouldn't refresh access token if cookies jwt token is invalid and return 403", async () => {
		res = await request(app)
			.get("/refresh")
			.set("Cookie", ["jwt=ddfajjdlsajfh"]);
		expect(res.statusCode).toEqual(403);
	});

	it("should let a user to logout", async () => {
		let res = await request(app).post("/auth").send({
			email: email,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		cookies = res.headers["set-cookie"];
		res = await request(app).get("/logout").set("Cookie", cookies);
		expect(res.statusCode).toEqual(204);
	});
});
