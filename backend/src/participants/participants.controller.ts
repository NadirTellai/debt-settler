import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  SerializeOptions, UseGuards
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import {AuthGuard} from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'))
@Controller('participants')
export class ParticipantsController {
  constructor(
      private readonly participantsService: ParticipantsService,
      ) {}

  @SerializeOptions({})
  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto, @Request() req) {
    createParticipantDto.userId = req.user.id
    return this.participantsService.create(createParticipantDto);
  }

  @SerializeOptions({})
  @Get()
  findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('keyword') keyword: string,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
      @Query('ids') ids: number[],
      @Request() req
  ) {
    return this.participantsService.findAll({page, limit, keyword, ids, userId: req.user.id});
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.participantsService.findOne(+id, req.user.id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParticipantDto: UpdateParticipantDto, @Request() req) {
    updateParticipantDto.userId =  req.user.id
    return this.participantsService.update(+id, updateParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.participantsService.remove(+id,req.user.id);
  }
}
