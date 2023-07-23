require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Agency = require("../models/Agency");
const request = require("supertest");
const path = require("path");
const img1Url = path.join(__dirname, "img", "house1.png");
const img2Url = path.join(__dirname, "img", "house2.png");

const createServer = require("../utils/createServer");

const app = createServer();

describe("Users", () => {
	let access_token1, access_token2, id1, id2;
	let email1 = "testAgency1@email.com";
	let email2 = "testAgency2@email.com";

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
	});

	it("should create a new agent 2 and send statuscode 201", async () => {
		const res = await request(app).post("/signin/candidate").send({
			email: email2,
			password: password,
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body.success).toEqual(
			`New candidate with email: ${email2} created!`
		);

		let user = await User.findOne({ email: email2 }).exec();

		expect(user.email).toEqual(email2);
		expect(user.user_type).toEqual("candidate");
	});

	it("should create a new agency and send statuscode 201", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		const name = "A agency";
		res = await request(app)
			.post("/agency")
			.set("Content-Type", "multipart/form-data")
			.set("Authorization", `Bearer ${access_token1}`)
			.field("name", name)
			.attach("logo", img1Url);

		expect(res.statusCode).toEqual(201);

		id1 = res.body._id;

		let agency = await Agency.findById(id1).exec();

		expect(agency.name).toEqual(name);
	});

	it("should create a another new agency and send statuscode 201", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		const name = "A new agency";
		res = await request(app)
			.post("/agency")
			.set("Content-Type", "multipart/form-data")
			.set("Authorization", `Bearer ${access_token1}`)
			.field("name", name)
			.attach("logo", img2Url);

		expect(res.statusCode).toEqual(201);

		id2 = res.body._id;

		let agency = await Agency.findById(id2).exec();

		expect(agency.name).toEqual(name);
	});

	it("should get all agencies by Id and send statuscode 200 ", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get(`/agency`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		let agencies = await Agency.find({}).exec();

		expect(agencies.length).toEqual(res.body.length);
	});

	it("should get agency by Id and send statuscode 200", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get(`/agency/${id1}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		let agency = await Agency.findById(id1).exec();

		expect(agency.name).toEqual(res.body.name);
	});

	it("should let a agent register to a agency and get this agency", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get(`/agency/my`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(204);

		res = await request(app)
			.post(`/agency/register/${id1}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		res = await request(app)
			.get(`/agency/my`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body._id).toEqual(id1);
	});

	it("should let a agent modify a agency if he was the creator", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		let agency = await Agency.findById(id1).exec();

		expect(agency.name).toEqual("A agency");

		res = await request(app)
			.put(`/agency/${id1}`)
			.set("Authorization", `Bearer ${access_token1}`)
			.send({ name: "A new name" });

		expect(res.statusCode).toEqual(200);

		asset = await Agency.findById(id1).exec();
		expect(asset.name).toEqual("A new name");
	});

	it("should let a agent delete a agency if he was the creator", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.delete(`/agency/${id1}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		asset = await Agency.findById(id1).exec();
		expect(asset).toEqual(null);
	});
});
