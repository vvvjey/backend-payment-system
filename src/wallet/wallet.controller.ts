import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { IsNotEmpty } from 'class-validator';
import { EventsGateway } from 'src/events/events.gateway';
// DTO
class DTOWalletRequest{
    userId:number;
    deposit:number;
    senderWalletId:number
    receiverWalletId:number
    amount:number
    app_trans_id:any
    zp_trans_id:any
    status:any
    sub_return_code:any
    data:any
}
// class CreateWalletRequest{
//     userId:number;
// }

@Controller('wallet')
export class WalletController {
    constructor(private walletService:WalletService,
        private eventGateway:EventsGateway
    ){
        
    }
    @Post('create')
    async createWallet(@Body() body:DTOWalletRequest){
        try {
            const wallet = await this.walletService.createWallet(body.userId);
            return {
                errCode : 0 ,
                errMessage : "Create successfully",
                data:wallet
            }
        } catch (error) {
            return {
                errCode : 1,
                errMessage : error.message
            }
        }
    }
    @Get('get-by-id')
    async getWalletByUserId(@Body() req:DTOWalletRequest){
        try {
            const wallet = await this.walletService.getWalletByUserId(req.userId); 
            console.log("wallet here",wallet)
            return {
                errCode : 0 ,
                errMessage : "Find successfully",
                data:wallet
            }
        } catch (error) {
            return {
                errCode : 1,
                errMessage : error.message
            }
        }
    }
    @Post('add-deposit')
    async addDeposit(@Body() req:DTOWalletRequest){
        try {
        const wallet =await this.walletService.addDeposit(req.userId,req.deposit); 
        return {
            errCode : 0 ,
            errMessage : "Add successfully",
            data: wallet
        }
        } catch (error) {
            return {
                errCode : 1,
                errMessage : error.message
            }
        }
    }
    @Post("test")
    async testApi(@Body() req:DTOWalletRequest){
        console.log('test',req);
        return {
            errCode:0,
            errMessage:"Hello mn aa"
        }
    }
    @Post('tranfer-money')
    async tranferMoney(@Body() req:DTOWalletRequest){
        try {
            const wallet = await this.walletService.tranferMoney(req.senderWalletId,req.receiverWalletId,req.amount); 
            return {
                errCode : 0 ,
                errMessage : "Add successfully",
                data: wallet
            }
        } catch (error) {
            return {
                errCode : 1,
                errMessage : error.message
            }
        }
    }
    @Post('create-order-zalopay')
    async createZaloPayOrder(@Body() req:DTOWalletRequest){
        try {
            console.log("data moi",req)
            const wallet = await this.walletService.createZaloPayOrder(req.amount); 
            return {
                errCode : 0 ,
                errMessage : "Add successfully",
                data: wallet
            }
        } catch (error) {
            return {
                errCode : 1,
                errMessage : error.message
            }
        }
    }
    @Post('callback')
    async callback(@Body() req:DTOWalletRequest){
        try {
            console.log("data",req);
            console.log("data amount",req.data)
            const { sub_return_code } = req;
            let status = 'success';
            if(req.data){
                status = 'success';      
            } else {
                status = 'fail';
            }
            this.eventGateway.server.emit('transactionStatus', { status });
            return {
                errCode : 0 ,
                errMessage : "Call back returan successfully",
                data:req
            }
        } catch (error) {
            return {
                errCode : 1,
                errMessage : error.message
            }
        }
    }
}
