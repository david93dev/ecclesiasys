const request = require("supertest")
const app = require("../../src/app")

describe("Register", () => {

    it("deve cadastrar um usuário", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Lavique Dias",
                email: "lavique@email.com",
                password: "123456",
                role: "admin"
            })

        expect(response.statusCode).toBe(201)

        expect(response.body.user).toHaveProperty("id")

        expect(response.body.user.email)
            .toBe("lavique@email.com")

        expect(response.body.user.role)
            .toBe("admin")
    })

    it("não deve cadastrar email duplicado", async () => {

        await request(app)
            .post("/auth/register")
            .send({
                name: "Lavique",
                email: "lavique@email.com",
                password: "123456",
                role: "admin"
            })

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Outro",
                email: "lavique@email.com",
                password: "123456",
                role: "user"
            })

        expect(response.statusCode).toBe(400)

        expect(response.body.message)
            .toBe("Este e-mail já está cadastrado")
    })

    it("não deve cadastrar email inválido", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Lavique",
                email: "email-invalido",
                password: "123456",
                role: "admin"
            })

        expect(response.statusCode).toBe(400)

        expect(response.body.errors)
            .toContain("Digite um e-mail válido")
    })
})