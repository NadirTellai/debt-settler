import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode, UseGuards, Req
} from '@nestjs/common';
import { SettlementsService } from './settlements.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import {AuthGuard} from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'))
@Controller('settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post()
  create(@Body() createSettlementDto: CreateSettlementDto, @Request() req) {
    createSettlementDto.userId = req.user.id
    return this.settlementsService.create(createSettlementDto);
  }

  @Get()
  findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
      @Query('keyword') keyword: string,
      @Query('order') order: 'DESC' | 'ASC',
      @Query('sort') sort: string,
      @Request() req
  ) {
    return this.settlementsService.findAll({page, limit, order, sort, keyword, userId: req.user.id});
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.settlementsService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettlementDto: UpdateSettlementDto, @Request() req) {
    updateSettlementDto.userId = req.user.id
    return this.settlementsService.update(+id, updateSettlementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.settlementsService.remove(+id, req.user.id);
  }
}
