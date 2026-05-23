const request = require("supertest")
const app = require("../src/app")

describe("GET /", () => {

    it("deve retornar projeto rodando", async () => {

        const response = await request(app).get("/")

        expect(response.statusCode).toBe(200)

        expect(response.text).toBe("Projeto rodando!")
    })
})