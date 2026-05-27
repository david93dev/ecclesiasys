const bcrypt = require("bcryptjs")
const request = require("supertest")
const app = require("../../src/app")
const User = require("../../src/models/User")

describe("Users", () => {

    let userId

    beforeEach(async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Lavique Dias",
                email: "lavique@email.com",
                password: "123456",
                role: "admin"
            })

        userId = response.body.user.id
    })

    describe("GET /user", () => {

        it("deve retornar todos os usuários", async () => {

            const response = await request(app)
                .get("/user")

            expect(response.statusCode).toBe(200)

            expect(response.body.message)
                .toBe("Usuários encontrados com sucesso")

            expect(Array.isArray(response.body.users))
                .toBe(true)

            expect(response.body.users.length)
                .toBeGreaterThan(0)

            expect(response.body.users[0])
                .not.toHaveProperty("passwordHash")
        })
    })

    describe("PUT /user/:id", () => {

        it("deve atualizar um usuário", async () => {

            const response = await request(app)
                .put(`/user/${userId}`)
                .send({
                    name: "Novo Nome",
                    email: "novoemail@email.com",
                    role: "user"
                })

            expect(response.statusCode).toBe(200)

            expect(response.body.message)
                .toBe("Usuário atualizado com sucesso")

            expect(response.body.user.name)
                .toBe("Novo Nome")

            expect(response.body.user.email)
                .toBe("novoemail@email.com")

            expect(response.body.user.role)
                .toBe("user")
        })

        it("não deve atualizar usuário inexistente", async () => {

            const fakeId = "665f1f77bcf86cd799439011"

            const response = await request(app)
                .put(`/user/${fakeId}`)
                .send({
                    name: "Teste"
                })

            expect(response.statusCode).toBe(404)

            expect(response.body.message)
                .toBe("Usuário não encontrado")
        })

        it("não deve atualizar com email inválido", async () => {

            const response = await request(app)
                .put(`/user/${userId}`)
                .send({
                    email: "email-invalido"
                })

            expect(response.statusCode).toBe(400)

            expect(response.body.errors)
                .toContain("Digite um e-mail válido")
        })
    })

    describe("DELETE /user/:id", () => {

        it("deve deletar um usuário", async () => {

            const response = await request(app)
                .delete(`/user/${userId}`)

            expect(response.statusCode).toBe(200)

            expect(response.body.message)
                .toBe("Usuário deletado com sucesso")

            const deletedUser = await User.findById(userId)

            expect(deletedUser).toBeNull()
        })

        it("não deve deletar usuário inexistente", async () => {

            const fakeId = "665f1f77bcf86cd799439011"

            const response = await request(app)
                .delete(`/user/${fakeId}`)

            expect(response.statusCode).toBe(404)

            expect(response.body.message)
                .toBe("Usuário não encontrado")
        })
    })
})