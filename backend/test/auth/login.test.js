const request = require("supertest")
const app = require("../../src/app")

describe("Login", () => {

    it("deve realizar login com sucesso", async () => {

        await request(app)
            .post("/auth/register")
            .send({
                name: "Lavique Dias",
                email: "lavique@email.com",
                password: "123456",
                role: "admin"
            })

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "lavique@email.com",
                password: "123456"
            })

        expect(response.statusCode).toBe(200)

        expect(response.body).toHaveProperty("token")

        expect(response.body.user.email)
            .toBe("lavique@email.com")

        expect(response.body.user.role)
            .toBe("admin")
    })

    it("não deve fazer login com email inexistente", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "naoexiste@email.com",
                password: "123456"
            })

        expect(response.statusCode).toBe(400)

        expect(response.body.message)
            .toBe("E-mail ou senha inválidos")
    })

    it("não deve fazer login com senha incorreta", async () => {

        await request(app)
            .post("/auth/register")
            .send({
                name: "Lavique Dias",
                email: "lavique@email.com",
                password: "123456",
                role: "admin"
            })

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "lavique@email.com",
                password: "senha-errada"
            })

        expect(response.statusCode).toBe(400)

        expect(response.body.message)
            .toBe("E-mail ou senha inválidos")
    })

    it("deve retornar token JWT no login", async () => {

        await request(app)
            .post("/auth/register")
            .send({
                name: "Lavique Dias",
                email: "lavique@email.com",
                password: "123456",
                role: "admin"
            })

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "lavique@email.com",
                password: "123456"
            })

        expect(response.body.token)
            .toBeDefined()

        expect(typeof response.body.token)
            .toBe("string")
    })
})