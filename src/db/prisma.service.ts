import { Injectable } from "@nestjs/common"
import { prismaClientOptions } from "../lib/prisma"
import { PrismaClient } from "./generated/prisma/client"

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super(prismaClientOptions)
    }
}
