import { Test } from "@nestjs/testing"
import { describe, expect, it } from "vitest"
import { AppController } from "./app.controller"

describe("AppController", () => {
    it("resolves through Nest's DI container and returns the root payload", async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AppController],
        }).compile()

        const controller = moduleRef.get(AppController)
        expect(controller.getRoot()).toEqual({ message: "hello world!" })
    })
})
