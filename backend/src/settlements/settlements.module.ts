import { Module } from '@nestjs/common';
import { SettlementsService } from './settlements.service';
import { SettlementsController } from './settlements.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Settlement} from "./entities/settlement.entity";
import {Node} from "../nodes/nodes.entity";
import {Link} from "../links/links.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Settlement, Node, Link])],
  controllers: [SettlementsController],
  providers: [SettlementsService]
})
export class SettlementsModule {}
