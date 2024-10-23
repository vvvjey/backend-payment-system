import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateWalletResponse {
    wallet?: {
        createdAt: Date;
        updatedAt: Date;
        wallet_id: number;
        userId: number;
        balance: number;
    };
    error?: string;
}
@Injectable()
export class WalletService {
    constructor(private prismaService:PrismaService){   
    }
    async createWallet(userId:number){
        try {
            const userExists = await this.prismaService.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                throw new Error('User does not exist'); 
            }
            const wallet = await this.prismaService.wallet.create({
                data:{
                    userId:userId,
                    balance:0
                }
            })
            return { wallet };
        } catch (error) {
            throw new Error("Errror : "+ error.message);
        }
    }
    async getWalletByUserId(userId:number){
        try {
            const wallet = await this.prismaService.wallet.findUnique({
                where:{
                    userId:userId
                }
            })
            if(!wallet){
                throw new Error("Cannot find this wallet");
            }
            console.log('helo') 
            return wallet;
        } catch (error) {
            throw new Error("Errror : "+ error.message);
        }
    }
    async addDeposit(userId:number,deposit:number){
        try {
            const updatedWallet = await this.prismaService.wallet.update({
                where:{
                    userId:userId
                },
                data:{
                    balance:{
                        increment:deposit
                    }
                }
            })
            if(!updatedWallet){
                throw new Error("Cannot find this wallet");
            }
            return updatedWallet;
        } catch (error) {
            throw new Error("Errror : "+ error.message);
        }
    }
}